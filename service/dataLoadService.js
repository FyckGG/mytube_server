const VideoStatistic = require("./../models/VideoStatistic");
const VideoComment = require("./../models/VideoComment");
const Video = require("./../models/Video");
const User = require("./../models/User");
const UserAvatar = require("./../models/UserAvatar");
const PageComment = require("./../CommentClasses/PageComment");

const getPageVIdeo = require("./../otherServices/getPageVideo");
const getPageChannels = require("./../otherServices/getPageChannels");
const WatchLaterVideo = require("../models/WatchLaterVideo");
const searchService = require("./searchService");

class DataLoadService {
  async loadComments(video_id, comment_count) {
    const video_stats = await VideoStatistic.findOne({ video: video_id });
    if (!video_stats) throw new Error("Не удалось загрузить статистику видео.");
    const commentList = await VideoComment.find({
      video_stat: video_stats._id,
    });
    if (!commentList)
      throw new Error("Не удалось найти комментарии для данного видео.");
    const page_comment_list = [];

    commentList.reverse(commentList);

    const newCommentList = commentList.slice(comment_count - 10, comment_count);

    for (let i = 0; i < newCommentList.length; i++) {
      const user = await User.findById(newCommentList[i].user);

      if (!user)
        throw new Error(
          "Не удалось найти пользователя, оставившего комментарий."
        );
      const user_avatar = await UserAvatar.findOne({
        user: newCommentList[i].user,
      });
      if (!user_avatar)
        throw new Error(
          "Не удалось найти аватар пользователя, оставившего комментарий."
        );
      const page_comment = new PageComment(
        newCommentList[i]._id,
        newCommentList[i].user,
        user.login,
        `${user_avatar.avatar_dir}${user_avatar.avatar_name}`,
        newCommentList[i].comment_text,
        newCommentList[i].comment_date
      );
      page_comment_list.push(page_comment);
    }

    const comments_count = video_stats.count_of_comments;
    return { comments_count: comments_count, comment_list: page_comment_list };
  }

  async loadVideos(user) {
    const page_videos = [];
    const videos = await Video.find();
    for (let video of videos) {
      const video_for_page = await getPageVIdeo(video);
      const is_watch_later = await WatchLaterVideo.findOne({
        video: video._id,
        user: user,
      });
      if (!user) page_videos.push({ ...video_for_page, is_watch_later: null });
      if (user && is_watch_later !== null)
        page_videos.push({ ...video_for_page, is_watch_later: true });
      if (user && is_watch_later === null)
        page_videos.push({ ...video_for_page, is_watch_later: false });
    }
    return page_videos;
  }

  async loadFilteredContent(user_id, search_string, current_page) {
    const filter_content = await searchService.getSearchResults(search_string);
    const public_filter_content = filter_content.videos.filter(
      (video) => video.is_public
    );
    console.log(public_filter_content);
    const filter_content_length = public_filter_content.length;

    const page_filter_content =
      public_filter_content.length > 32
        ? public_filter_content.slice(
            current_page * 32,
            (current_page + 1) * 32
          )
        : public_filter_content;
    const page_videos = [];

    for (let video of page_filter_content) {
      const video_for_page = await getPageVIdeo(video);
      const is_watch_later = await WatchLaterVideo.findOne({
        video: video._id,
        user: user_id,
      });
      if (!user_id)
        page_videos.push({ ...video_for_page, is_watch_later: null });
      if (user_id && is_watch_later !== null)
        page_videos.push({ ...video_for_page, is_watch_later: true });
      if (user_id && is_watch_later === null)
        page_videos.push({ ...video_for_page, is_watch_later: false });
    }
    const page_channels = await getPageChannels(filter_content.channels);
    if (page_channels.length > 5) page_channels.slice(0, 5);
    return {
      videos: page_videos,
      channels: page_channels,
      videos_length: filter_content_length,
    };
  }
}

module.exports = new DataLoadService();

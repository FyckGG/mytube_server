const VideoStatistic = require("./../models/VideoStatistic");
const VideoComment = require("./../models/VideoComment");
const Video = require("./../models/Video");
const User = require("./../models/User");
const UserAvatar = require("./../models/UserAvatar");
const VideoThumbnail = require("./../models/VideoThumbnail");
const PageComment = require("./../CommentClasses/PageComment");
const PageVideo = require("./../VideoClasses/PageVideo");

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

  async loadVideos() {
    const page_videos = [];
    const videos = await Video.find();
    for (let video of videos) {
      let video_preview = await VideoThumbnail.findOne({ video: video._id });
      if (!video_preview) throw new Error("Не удалось получить превью видео.");
      let video_channel = await User.findById(video.user);
      if (!video_channel)
        throw new Error(
          "Не удалось получить пользователя, загрузившего видео."
        );
      let channel_avatar = await UserAvatar.findOne({
        user: video_channel._id,
      });
      if (!channel_avatar)
        throw new Error("Не удалось получить аватар пользователя.");
      let video_stats = await VideoStatistic.findOne({ video: video._id });
      if (!video_stats)
        throw new Error("Не удалось получить статистику видео.");
      const video_for_page = new PageVideo(
        video._id,
        video.video_name,
        `${video_preview.thumbnail_directory}/${video_preview.thumbnail_name}`,
        video_channel._id,
        video_channel.login,
        `${channel_avatar.avatar_dir}${channel_avatar.avatar_name}`,
        video_stats.count_of_views,
        video.video_duration,
        video.upload_date
      );
      //console.log(video_for_page);
      page_videos.push(video_for_page);
    }
    return page_videos;
  }
}

module.exports = new DataLoadService();

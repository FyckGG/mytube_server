const UserAvatar = require("./../models/UserAvatar");
const Video = require("./../models/Video");
const User = require("./../models/User");
const VideoThumbnail = require("./../models/VideoThumbnail");
const VideoStatistic = require("./../models/VideoStatistic");
const UserStatistic = require("./../models/UserStatistic");
const Subscription = require("./../models/Subscription");
const LikeDislikeVideo = require("./../models/LikeDislikeVideo");
const WatchLaterVideo = require("./../models/WatchLaterVideo");
const ChannelDesciption = require("./../models/ChannelDesciption");
const UserVideo = require("./../VideoClasses/UserVideo");
const getPageVIdeo = require("./../otherServices/getPageVideo");
const SubsChannel = require("./../SubscriptionsClasses/SubsChannel");
const UserHistory = require("./../models/UserHistory");

class TokenService {
  async findAvatar(id) {
    const avatar = await UserAvatar.findOne({
      user: id,
    });
    return avatar;
  }

  async loadUserVideos(channel_id, user_id) {
    try {
      const user_videos_arr = [];
      const videos_result = await Video.find({ user: channel_id });
      let videos = [];
      if (channel_id != user_id)
        videos = videos_result.filter((video) => video.is_public);
      else videos = videos_result;
      for (let i = videos.length - 1; i >= 0; i--) {
        const thumbnails = await VideoThumbnail.findOne({
          video: videos[i]._id,
        });
        const statistics = await VideoStatistic.findOne({
          video: videos[i]._id,
        });
        const userVideo = new UserVideo(
          videos[i]._id,
          videos[i].video_name,
          videos[i].video_duration,
          statistics.count_of_views,
          `${thumbnails.thumbnail_directory}/${thumbnails.thumbnail_name}`,
          videos[i].upload_date
        );
        //console.log(userVideo);
        if (user_id) {
          const is_watch_later = await WatchLaterVideo.findOne({
            video: videos[i]._id,
            user: user_id,
          });
          if (is_watch_later == null)
            user_videos_arr.push({
              ...userVideo,
              count_of_likes: statistics.count_of_like,
              count_of_dislikes: statistics.count_of_dislike,
              is_watch_later: false,
            });
          if (is_watch_later != null)
            user_videos_arr.push({
              ...userVideo,
              count_of_likes: statistics.count_of_like,
              count_of_dislikes: statistics.count_of_dislike,
              is_watch_later: true,
            });
        } else user_videos_arr.push(userVideo);
      }

      return user_videos_arr;
    } catch (e) {
      console.log("Ошибка при получении видео: " + e);
    }
  }

  async loadUserStats(user_id) {
    try {
      const user_stats = await UserStatistic.findOne({ user: user_id });
      if (!user_stats)
        throw new Error("Не найдена статистика для данного пользователя.");
      return user_stats;
    } catch (e) {
      console.log("Ошибка при загрузке статистики пользователя: " + e);
    }
  }

  async loadUser(user_id) {
    try {
      const user = await User.findById(user_id);
      if (!user) throw new Error("Пользователь не найден!");
      return user;
    } catch (e) {
      console.log("Ошибка при загрузке данных пользователя: " + e);
    }
  }

  async getSub(channel_id, subscriber_id) {
    const channel = await User.findById(channel_id);
    const subscriber = await User.findById(subscriber_id);
    if (!channel || !subscriber)
      throw new Error("Не удалось найти пользователя.");
    const subscribtion = await Subscription.findOne({
      channel: channel_id,
      subscriber: subscriber_id,
    });
    if (subscribtion) return true;
    else return false;
  }

  async getChannelStatus(user_id, video_id) {
    const channel = await Video.findById(video_id);
    if (!channel) throw new Error("Не удалось найти видео по id.");
    if (!user_id) return { channel: channel.user, subs_status: undefined };
    const subs_info = await Subscription.findOne({
      channel: channel.user,
      subscriber: user_id,
    });
    if (subs_info) return { channel: channel.user, subs_status: true };
    else return { channel: channel.user, subs_status: false };
  }

  async getVideoMark(user_id, video_id) {
    const user = await User.findById(user_id);
    if (!user && user_id) throw new Error("Не удалось найти пользователя.");
    const video = await Video.findById(video_id);
    if (!video) throw new Error("Не удалось найти видео.");
    const video_mark = await LikeDislikeVideo.findOne({
      video: video_id,
      user: user_id,
    });
    return video_mark;
  }

  async getLikedVideos(user_id) {
    const page_videos = [];
    const user = await User.findById(user_id);
    if (!user) throw new Error("Несуществующий пользователь.");
    const videos_likes = await LikeDislikeVideo.find({
      user: user_id,
      is_like: true,
    });
    videos_likes.reverse();
    for (let video of videos_likes) {
      const like_video = await Video.findById(video.video);
      const page_video = await getPageVIdeo(like_video);
      const is_watch_later = await WatchLaterVideo.findOne({
        video: video.video,
        user: user_id,
      });

      if (is_watch_later != null)
        page_videos.push({ ...page_video, is_watch_later: true });
      else page_videos.push({ ...page_video, is_watch_later: false });
    }

    return page_videos;
  }

  async getSubsChannels(user_id) {
    const page_channels = [];
    const user = await User.findById(user_id);
    if (!user) throw new Error("Пользователь не найден.");
    const subs_channels = await Subscription.find({ subscriber: user_id });
    subs_channels.reverse();
    for (let subs_channel of subs_channels) {
      const channel = await User.findById(subs_channel.channel);
      const channel_avatar = await UserAvatar.findOne({
        user: subs_channel.channel,
      });
      const channel_stats = await UserStatistic.findOne({
        user: subs_channel.channel,
      });
      const page_channel = new SubsChannel(
        subs_channel.channel,
        channel.login,
        `${channel_avatar.avatar_dir}${channel_avatar.avatar_name}`,
        channel_stats.count_of_subs
      );
      page_channels.push(page_channel);
    }
    return page_channels;
  }
  async getWatchLaterVideos(user_id) {
    const watch_later_videos = [];
    const user = await User.findById(user_id);
    if (!user) throw new Error("Пользователь не найден.");
    const watch_later_list = await WatchLaterVideo.find({ user: user_id });
    for (let video of watch_later_list) {
      const watch_later_video = await Video.findById(video.video);
      const page_video = await getPageVIdeo(watch_later_video);

      watch_later_videos.push(page_video);
    }
    return watch_later_videos;
  }

  async getChannelDescription(user_id) {
    const user = await User.findById(user_id);
    if (!user) throw new Error("Пользователь не найден.");
    const description = await ChannelDesciption.findOne({ user: user_id });
    //if (!description) throw new Error("Описание канала не найдено.");
    return description;
  }

  async getUserHistoryVideos(user_id, current_page) {
    const user = await User.findById(user_id);
    if (!user) throw new Error("Пользователь не найден.");
    const history = await UserHistory.findOne({ user: user_id });
    if (history.history_videos.length == 0) return history;
    const video_length = history.history_videos.length;

    const cut_history =
      history.history_videos.length > 32
        ? history.history_videos.slice(
            current_page * 32,
            (current_page + 1) * 32
          )
        : history.history_videos;

    const page_videos = [];
    for (let history_item of cut_history) {
      const video = await Video.findById(history_item);
      if (video) {
        const page_video = await getPageVIdeo(video);
        const is_watch_later = await WatchLaterVideo.findOne({
          video: video._id,
          user: user_id,
        });
        if (!user_id) page_videos.push({ ...page_video, is_watch_later: null });
        if (user_id && is_watch_later !== null)
          page_videos.push({ ...page_video, is_watch_later: true });
        if (user_id && is_watch_later === null)
          page_videos.push({ ...page_video, is_watch_later: false });
      }
    }

    return { videos: page_videos, videos_length: video_length };
  }
}

module.exports = new TokenService();

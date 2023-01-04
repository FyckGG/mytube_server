const UserAvatar = require("./../models/UserAvatar");
const Video = require("./../models/Video");
const User = require("./../models/User");
const VideoThumbnail = require("./../models/VideoThumbnail");
const VideoStatistic = require("./../models/VideoStatistic");
const UserStatistic = require("./../models/UserStatistic");
const Subscription = require("./../models/Subscription");
const LikeDislikeVideo = require("./../models/LikeDislikeVideo");
const UserVideo = require("./../VideoClasses/UserVideo");
const getPageVIdeo = require("./../otherServices/getPageVideo");
const SubsChannel = require("./../SubscriptionsClasses/SubsChannel");

class TokenService {
  async findAvatar(id) {
    const avatar = await UserAvatar.findOne({
      user: id,
    });
    return avatar;
  }

  async loadUserVideos(user_id) {
    try {
      const user_videos_arr = [];
      const videos = await Video.find({ user: user_id });

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
        user_videos_arr.push(userVideo);
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
      console.log(page_video);

      page_videos.push(page_video);
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
}

module.exports = new TokenService();

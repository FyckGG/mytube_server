const PageVideo = require("./../VideoClasses/PageVideo");
const VideoThumbnail = require("./../models/VideoThumbnail");
const User = require("./../models/User");
const VideoStatistic = require("./../models/VideoStatistic");
const UserAvatar = require("./../models/UserAvatar");
const WatchLaterVideo = require("./../models/WatchLaterVideo");

const getPageVIdeo = async (video) => {
  try {
    let video_preview = await VideoThumbnail.findOne({ video: video._id });
    if (!video_preview) throw new Error("Не удалось получить превью видео.");
    let video_channel = await User.findById(video.user);
    if (!video_channel)
      throw new Error("Не удалось получить пользователя, загрузившего видео.");
    let channel_avatar = await UserAvatar.findOne({
      user: video_channel._id,
    });
    if (!channel_avatar)
      throw new Error("Не удалось получить аватар пользователя.");
    let video_stats = await VideoStatistic.findOne({ video: video._id });
    if (!video_stats) throw new Error("Не удалось получить статистику видео.");

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
    return video_for_page;
  } catch (e) {
    return e;
  }
};

module.exports = getPageVIdeo;

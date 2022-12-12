const UserAvatar = require("./../models/UserAvatar");
const Video = require("./../models/Video");
const VideoThumbnail = require("./../models/VideoThumbnail");
const VideoStatistic = require("./../models/VideoStatistic");
const UserStatistic = require("./../models/UserStatistic");
const UserVideo = require("./../VideoClasses/UserVideo");

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
      console.log(user_videos_arr);
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
}

module.exports = new TokenService();

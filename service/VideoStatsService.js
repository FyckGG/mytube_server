const VideoStatistic = require("./../models/VideoStatistic");
const LikeDislikeVideo = require("./../models/LikeDislikeVideo");
const Video = require("./../models/Video");
const User = require("./../models/User");
const UserStatistic = require("./../models/UserStatistic");

class VideoStatsService {
  async addView(video_id) {
    const video = await Video.findById(video_id);
    if (!video) throw new Error("Видео не найдено.");
    const video_stats = await VideoStatistic.findOne({ video: video_id });
    if (!video_stats) throw new Error("Статистика видео не найдена.");
    video_stats.count_of_views++;
    const user_stats = await UserStatistic.findOne({ user: video.user });
    user_stats.count_of_views++;
    user_stats.save();
    return video_stats.save();
  }

  async addMark(video, user, is_like) {
    const is_user_marked = await LikeDislikeVideo.findOne({
      video: video,
      user: user,
    });

    if (is_user_marked) throw new Error("Пользователь уже оценил видео.");
    const video_mark = await LikeDislikeVideo.create({
      video: video,
      user: user,
      is_like: is_like,
    });
    const video_stats = await VideoStatistic.findOne({ video: video });
    if (is_like) video_stats.count_of_like++;
    else video_stats.count_of_dislike++;
    return video_stats.save();
  }

  async deleteMark(video, user, is_like) {
    const deleted_mark = await LikeDislikeVideo.deleteOne({
      video: video,
      user: user,
    });
    if (!deleted_mark)
      throw new Error("Не удалось найти запись в базе данных.");
    const video_stats = await VideoStatistic.findOne({ video: video });
    if (is_like) video_stats.count_of_like--;
    else video_stats.count_of_dislike--;
    return video_stats.save();
  }
}

module.exports = new VideoStatsService();

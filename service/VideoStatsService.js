const VideoStatistic = require("./../models/VideoStatistic");
const LikeDislikeVideo = require("./../models/LikeDislikeVideo");

class VideoStatsService {
  async addView(video_id) {
    const video_stats = await VideoStatistic.findOne({ video: video_id });
    video_stats.count_of_views++;

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
    console.log(video_stats);
    if (is_like) video_stats.count_of_like--;
    else video_stats.count_of_dislike--;
    return video_stats.save();
  }
}

module.exports = new VideoStatsService();

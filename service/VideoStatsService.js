const VideoStatistic = require("./../models/VideoStatistic");
const LikeDislikeVideo = require("./../models/LikeDislikeVideo");

class VideoStatsService {
  async addView(video_id) {
    const video_stats = await VideoStatistic.findOne({ video: video_id });
    video_stats.count_of_views++;
    console.log(video_stats.count_of_views);
    return video_stats.save();
  }

  async addMark(video, user, is_like) {
    const video_mark = await LikeDislikeVideo.create({
      video: video,
      user: user,
      is_like: is_like,
    });
    const video_stats = await VideoStatistic.findOne({ video: video });
    if (is_like) video_stats.count_of_like++;
    else video_stats.count_of_dislike++;
    console.log(video_stats);
    return video_stats.save();
  }
}

module.exports = new VideoStatsService();

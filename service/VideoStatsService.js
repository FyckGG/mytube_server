const VideoStatistic = require("./../models/VideoStatistic");

class VideoStatsService {
  async addView(video_id) {
    const video_stats = await VideoStatistic.findOne({ video: video_id });
    video_stats.count_of_views++;
    console.log(video_stats.count_of_views);
    return video_stats.save();
  }
}

module.exports = new VideoStatsService();

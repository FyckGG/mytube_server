const VideoStatsService = require("./../service/VideoStatsService");

class VideoStatsController {
  async add_view(req, res, next) {
    try {
      const { video_id } = req.body;
      const result = await VideoStatsService.addView(video_id);
      return result;
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new VideoStatsController();

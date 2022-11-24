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

  async add_mark(req, res, next) {
    try {
      const { video, user, is_like } = req.body;
      const result = await VideoStatsService.addMark(video, user, is_like);
      return result;
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new VideoStatsController();

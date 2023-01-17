const VideoDataLoadService = require("./../service/videoDataLoadService");

class VideoDataLoadController {
  async get_video_for_edit(req, res) {
    try {
      const { video_id, user_id } = req.body;
      const result = await VideoDataLoadService.getVideoForEdit(
        video_id,
        user_id
      );
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new VideoDataLoadController();

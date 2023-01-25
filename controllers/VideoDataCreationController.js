const VideoDataCreationService = require("../service/VIdeoDataCreationService");

class VideoDataCreationController {
  async save_tokens(req, res) {
    try {
      const { video_id, tags, hashTags } = req.body;
      const result = VideoDataCreationService.saveVideoTags(
        video_id,
        tags,
        hashTags
      );
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new VideoDataCreationController();

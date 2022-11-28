const UserActionsService = require("./../service/UserActionsService");
const UserActionService = require("./../service/UserActionsService");

class UserActionController {
  async addNewVideo(req, res, next) {
    try {
      const { userId, name, path, description, is_public, subject, duration } =
        req.body;
      const result = await UserActionService.addNewVideo(
        userId,
        name,
        path,
        description,
        is_public,
        subject,
        duration
      );
      return res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }

  async upload_video(req, res, next) {
    try {
      if (req.file) {
       
        res.json({ video_name: req.file.filename });
      } else {
        throw new Error("Название видео не получено.");
      }
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async create_video_thumbnail(req, res, next) {
    try {
      const { videoId, video_dir, thumbnail_dir, thumbnail_name } = req.body;
      const result = await UserActionsService.createVideoThubnail(
        videoId,
        video_dir,
        thumbnail_dir,
        thumbnail_name
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
  async load_video_for_watch(req, res, next) {
    try {
      const { video_id } = req.body;
      const result = await UserActionService.loadVideoForWatch(video_id);
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
}

module.exports = new UserActionController();

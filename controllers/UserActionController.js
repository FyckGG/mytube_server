const UserActionService = require("./../service/UserActionsService");

class UserActionController {
  async addNewVideo(req, res, next) {
    try {
      const { userId, name, path, description, is_public, subject } = req.body;
      const result = await UserActionService.addNewVideo(
        userId,
        name,
        path,
        description,
        is_public,
        subject
      );
      return res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }

  async upload_video(req, res, next) {
    try {
      if (req.file) {
        // console.log(req.file);
        // console.log(req.body);
        res.json({ video_name: req.file.filename });
      } else {
        throw new Error("Название видео не получено.");
      }
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
}

module.exports = new UserActionController();

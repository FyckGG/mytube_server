const UserDataChangeService = require("./../service/UserDataChangeService");

class UserDataChangeController {
  async change_avatar(req, res) {
    try {
      if (req.file) {
        const { id } = req.body;

        const avatar_change_result = await UserDataChangeService.changeAvatar(
          id,
          req.file.filename
        );
        res.json({ avatar_change_result });
      } else throw new Error("Имя изображения не получено.");
    } catch (e) {
      res.status.send({ error: e });
    }
  }

  async change_description(req, res) {
    try {
      const { user_id, text } = req.body;
      const result = await UserDataChangeService.changeChannelDescription(
        user_id,
        text
      );
      res.json({ result });
    } catch (e) {
      res.status.send({ error: e });
    }
  }

  async add_video_to_history(req, res) {
    try {
      const { user_id, video_id } = req.body;
      const result = await UserDataChangeService.addVideoToHistory(
        user_id,
        video_id
      );
      res.json({ result });
    } catch (e) {
      res.status.send({ error: e });
    }
  }
}

module.exports = new UserDataChangeController();

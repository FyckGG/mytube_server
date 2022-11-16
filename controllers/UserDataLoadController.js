const UserDataLoadService = require("./../service/userDataLoadService");

class UserDataLoadController {
  async findAvatar(req, res, next) {
    try {
      const { id } = req.body;

      const result = await UserDataLoadService.findAvatar(id);
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
  async loadUserVideos(req, res, next) {
    try {
      const { user_id } = req.body;
      const result = await UserDataLoadService.loadUserVideos(user_id);
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new UserDataLoadController();

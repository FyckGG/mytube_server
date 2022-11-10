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
}

module.exports = new UserActionController();

const UserDataLoadService = require("./../service/userDataLoadService");

class UserDataLoadController {
  async findAvatar(req, res, next) {
    try {
      const { id } = req.body;
      //console.log(req.body);
      //console.log(id);
      const result = await UserDataLoadService.findAvatar(id);
      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new UserDataLoadController();
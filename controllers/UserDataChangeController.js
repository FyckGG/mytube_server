const UserDataChangeService = require("./../service/UserDataChangeService");

class UserDataChangeController {
  async change_avatar(req, res) {
    try {
      if (req.file) {
        //console.log(req.file);
        //console.log(req.body);
        const { id } = req.body;
        //console.log(id);
        const avatar_change_result = await UserDataChangeService.changeAvatar(
          id,
          req.file.filename
        );
      } else throw new Error("Имя изображения не получено.");
    } catch (e) {
      res.status.send({ error: e });
    }
  }
}

module.exports = new UserDataChangeController();

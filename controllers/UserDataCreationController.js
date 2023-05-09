const fs = require("fs");
const path = require("path");
const UserDataCreationService = require("./../service/userDataCreationService");

class UserDataCreationController {
  async createDir(req, res, next) {
    try {
      const { id } = req.body;
      const result = await UserDataCreationService.createDir(id);

      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async createUsersDir(req, res, next) {
    try {
      const { id } = req.body;
      const result = await UserDataCreationService.createUsersDir(id);

      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async addDefaultImg(req, res, next) {
    try {
      const { id } = req.body;
      const result = await UserDataCreationService.addDefaultImg(id);

      return res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async upload_avatar(req, res, next) {
    try {
      if (req.file) {
        res.json({ avatar_name: req.file.filename });
      } else {
        throw new Error("Имя изображения не получено.");
      }
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async saveAvatarInfo(req, res, next) {
    try {
      const { id, avatar_name, avatar_dir } = req.body;
      const result = await UserDataCreationService.saveAvatarInfo(
        id,
        avatar_dir,
        avatar_name
      );
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
}

module.exports = new UserDataCreationController();

const path = require("path");
const fs = require("fs");
const UserAvatar = require("../models/UserAvatar");

class UserDataCreationService {
  async createDir(id) {
    fs.mkdir(path.join(__dirname + "/../usersData/" + id), (err) => {
      if (err) {
        throw new Error("Не удалось создать папку.");
      }
    });
    return "Директория успешно создана.";
  }

  async createUsersDir(id) {
    fs.mkdir(
      path.join(__dirname + "/../usersData/" + id + "/avatar"),
      (err) => {
        if (err) {
          throw new Error("Не удалось создать папку для аватара.");
        }
      }
    );
    fs.mkdir(
      path.join(__dirname + "/../usersData/" + id + "/videos"),
      (err) => {
        if (err) {
          throw new Error("Не удалось создать папку для видео.");
        }
      }
    );
    fs.mkdir(
      path.join(__dirname + "/../usersData/" + id + "/videos_thumbnails"),
      (err) => {
        if (err) {
          throw new Error("Не удалось создать папку для миниатюр видео.");
        }
      }
    );
    return { avatar_path: "/usersData/" + id + "/avatar/" };
  }

  async addDefaultImg(id) {
    fs.copyFile(
      `${__dirname}/../defaultImgs/no_photo.jpg`,
      `${__dirname}/../usersData/${id}/avatar/no_photo.jpg`,
      (err) => {
        if (err) throw new Error("Не удалось загрузить аватар по умолчанию.");
      }
    );
    return { avatar_name: "no_photo.jpg" };
  }

  async saveAvatarInfo(userId, avatar_path, avatar_name) {
    const avatarData = await UserAvatar.findOne({ user: userId });
    if (avatarData) {
      avatarData.avatar_name = avatar_name;
      return avatarData.save();
    }
    const avatar = await UserAvatar.create({
      user: userId,
      avatar_name: avatar_name,
      avatar_dir: avatar_path,
    });
    return avatar;
  }
}

module.exports = new UserDataCreationService();

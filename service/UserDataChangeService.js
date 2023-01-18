const fs = require("fs");
const User = require("./../models/User");
const UserAvatar = require("./../models/UserAvatar");
const ChannelDesciption = require("./../models/ChannelDesciption");

class UserDataChangeService {
  async changeAvatar(user_id, avatar_name) {
    const user = await User.findById(user_id);
    if (!user) throw new Error("Не удалось найти пользователя");
    const avatar = await UserAvatar.findOne({ user: user_id });
    fs.unlink(
      `${__dirname}/../${avatar.avatar_dir}${avatar.avatar_name}`,
      (err) => {
        if (err) throw err;
        console.log("Файл успешно удалён");
      }
    );
    avatar.avatar_name = avatar_name;
    return avatar.save();
  }

  async changeChannelDescription(user_id, text) {
    const user = await User.findById(user_id);
    if (!user) throw new Error("Не удалось найти пользователя");
    const channel_description = await ChannelDesciption.findOne({
      user: user_id,
    });
    if (!channel_description)
      throw new Error("Не удалось найти описание канала");
    channel_description.description = text;
    return channel_description.save();
  }
}

module.exports = new UserDataChangeService();

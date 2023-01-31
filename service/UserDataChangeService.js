const fs = require("fs");
const User = require("./../models/User");
const UserAvatar = require("./../models/UserAvatar");
const ChannelDesciption = require("./../models/ChannelDesciption");
const UserHistory = require("./../models/UserHistory");
const Video = require("../models/Video");

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

  async addVideoToHistory(user_id, video_id) {
    const user = await User.findById(user_id);
    if (!user) throw new Error("Пользователь не найден");
    const video = await Video.findById(video_id);
    if (!video) throw new Error("Видео не найдено");
    const user_history = await UserHistory.findOne({ user: user_id });
    if (!user_history) {
      const new_history = await UserHistory.create({
        user: user_id,
        history_videos: [video_id],
      });
      return new_history;
    }
    const filtered_videos = user_history.history_videos.filter(
      (video) => video != video_id
    );
    filtered_videos.unshift(video_id);
    user_history.history_videos = [...filtered_videos];
    return user_history.save();
  }
}

module.exports = new UserDataChangeService();

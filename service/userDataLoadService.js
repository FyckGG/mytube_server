const UserAvatar = require("./../models/UserAvatar");
const Video = require("./../models/Video");

class TokenService {
  async findAvatar(id) {
    const avatar = await UserAvatar.findOne({
      user: id,
    });
    return avatar;
  }

  async loadUserVideos(user_id) {
    try {
      const videos = await Video.find({ user: user_id });
      return videos;
    } catch (e) {
      console.log("Ошибка при получении видео: " + e);
    }
  }
}

module.exports = new TokenService();

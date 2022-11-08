const Video = require("./../models/Video");

class UserActionService {
  async addNewVideo(userId, name, path, description, is_public, subject) {
    try {
      const video = await Video.create({
        user: userId,
        video_name: name,
        video_directory: path,
        video_description: description,
        is_public: is_public,
        video_subject: subject,
      });
      return video;
    } catch (e) {
      return "Ошибка при загрузке видео:" + e;
    }
  }
}

module.exports = new UserActionService();

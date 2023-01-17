const Video = require("./../models/Video");

class VideoDataLoadService {
  async getVideoForEdit(video_id, user_id) {
    const video = await Video.findById(video_id);
    if (!video) throw new Error("Видео не найдено");
    console.log(user_id);
    console.log(video.user);
    if (video.user != user_id)
      throw new Error("Пользователь не имеет права редактировать это видео");
    return {
      name: video.video_name,
      description: video.video_description,
      access_type: video.is_public,
      subject: video.video_subject,
    };
  }
}

module.exports = new VideoDataLoadService();

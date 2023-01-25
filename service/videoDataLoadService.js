const Video = require("./../models/Video");
const VideoTags = require("./../models/VideoTags");

class VideoDataLoadService {
  async getVideoForEdit(video_id, user_id) {
    const video = await Video.findById(video_id);
    if (!video) throw new Error("Видео не найдено");

    if (video.user != user_id)
      throw new Error("Пользователь не имеет права редактировать это видео");
    const video_tags = await VideoTags.findOne({ video: video_id });
    return {
      name: video.video_name,
      description: video.video_description,
      access_type: video.is_public,
      subject: video.video_subject,
      tags: video_tags,
    };
  }
}

module.exports = new VideoDataLoadService();

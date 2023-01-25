const Video = require("./../models/Video");
const VideoTags = require("./../models/VideoTags");

class VideoDataCreationService {
  async saveVideoTags(video_id, tags, hashTags) {
    const video = await Video.findById(video_id);
    if (!video) throw new Error("Видео не найдено");

    const is_tag_list = await VideoTags.findOne({ video: video_id });
    if (is_tag_list)
      throw new Error("Запись тегов для данного видео уже существует");

    const tags_result = await VideoTags.create({
      video: video_id,
      tags_list: tags,
      hash_tags_list: hashTags,
    });

    return tags_result;
  }
}

module.exports = new VideoDataCreationService();

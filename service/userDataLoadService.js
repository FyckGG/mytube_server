const UserAvatar = require("./../models/UserAvatar");
const Video = require("./../models/Video");
const VideoThumbnail = require("./../models/VideoThumbnail");
const UserVideo = require("./../VideoClasses/UserVideo");

class TokenService {
  async findAvatar(id) {
    const avatar = await UserAvatar.findOne({
      user: id,
    });
    return avatar;
  }

  async loadUserVideos(user_id) {
    try {
      const user_videos_arr = [];
      const videos = await Video.find({ user: user_id });

      for (let i = 0; i < videos.length; i++) {
        const thumbnails = await VideoThumbnail.findOne({
          video: videos[i]._id,
        });
        const userVideo = new UserVideo(
          videos[i]._id,
          videos[i].video_name,
          videos[i].video_duration,
          228,
          `${thumbnails.thumbnail_directory}/${thumbnails.thumbnail_name}`
        );
        user_videos_arr.push(userVideo);
      }

      return user_videos_arr;
    } catch (e) {
      console.log("Ошибка при получении видео: " + e);
    }
  }
}

module.exports = new TokenService();

const Video = require("./../models/Video");
const VideoThumbnail = require("./../models/VideoThumbnail");
const thumbsupply = require("thumbsupply");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

class UserActionService {
  async addNewVideo(
    userId,
    name,
    path,
    description,
    is_public,
    subject,
    duration
  ) {
    try {
      const video = await Video.create({
        user: userId,
        video_name: name,
        video_directory: path,
        video_description: description,
        is_public: is_public,
        video_subject: subject,
        video_duration: duration,
      });
      return video;
    } catch (e) {
      return "Ошибка при загрузке видео: " + e;
    }
  }

  async createVideoThubnail(videoId, video_dir, thumbnail_dir, thumbnail_name) {
    try {
      const thubnail = new ffmpeg(__dirname + video_dir)
        .on("filenames", function (filenames) {
          console.log("Will generate " + filenames.join(", "));
        })
        .on("end", function () {
          console.log("Screenshots taken");
        })
        .takeScreenshots(
          {
            count: 1,
            timemarks: ["0"], // number of seconds
            filename: `${thumbnail_name}.png`,
            folder: __dirname + thumbnail_dir,
          },

          function (err) {
            console.log("screenshots were saved");
          }
        );
      const thumbnail = await VideoThumbnail.create({
        video: videoId,
        thumbnail_name: `${thumbnail_name}.png`,
        thumbnail_directory: thumbnail_dir.substring(3),
      });
      return resizeBy.json(thubnail);
    } catch (e) {
      return "Ошибка при создании миниатюры видео: " + e;
    }
  }

  async loadVideoForWatch(video_id) {
    try {
      const video = await Video.findOne({ _id: video_id });
      return video;
    } catch (e) {
      return "Ошибка при загруке видео: " + e;
    }
  }
}

module.exports = new UserActionService();

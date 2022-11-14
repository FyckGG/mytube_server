const Video = require("./../models/Video");
const thumbsupply = require("thumbsupply");
//const ffmpeg_g = require("ffmpeg-static");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
//const { ffprobe } = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
//ffprobe.setFfprobePath(ffprobePath);

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
      return "Ошибка при загрузке видео: " + e;
    }
  }

  // async createVideoThubnail(video_dir, thumbsupply_dir) {
  //   try {
  //     console.log(__dirname + "/super.mp4");
  //     await thumbsupply.generateThumbnail("./super.mp4", {
  //       size: thumbsupply.ThumbSize.MEDIUM, // or ThumbSize.LARGE
  //       timestamp: "10%", // or `30` for 30 seconds
  //       forceCreate: true,
  //       //cacheDir: thumbsupply_dir,
  //       cacheDir: "./../usersData",
  //       mimetype: "video/mp4",
  //     });
  //     return "succes";
  //   } catch (e) {
  //     return "Ошибка при создании миниатюры видео: " + e;
  //   }
  // }
  async createVideoThubnail(video_dir, thumbnail_dir, thumbnail_name) {
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
      return "Миниатюра была создана.";
    } catch (e) {
      return "Ошибка при создании миниатюры видео: " + e;
    }
  }
}

module.exports = new UserActionService();

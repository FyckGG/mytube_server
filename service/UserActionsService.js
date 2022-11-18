const Video = require("./../models/Video");
const VideoThumbnail = require("./../models/VideoThumbnail");
const VideoStatistics = require("./../models/VideoStatistic");
const User = require("./../models/User");
const UserAvatar = require("./../models/UserAvatar");
const UserStatistic = require("./../models/UserStatistic");
const thumbsupply = require("thumbsupply");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
const WatchVideoInfo = require("./../VideoClasses/WatchVideoInfo");

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
      const video_statistic = await VideoStatistics.create({
        video: video._id,
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

  // channel_name,
  //   count_subs,
  //   count_views,
  //   count_likes,
  //   count_dislikes

  async loadVideoForWatch(video_id) {
    try {
      const video = await Video.findOne({ _id: video_id });
      const video_stat = await VideoStatistics.findOne({ video: video_id });
      const channel = await User.findOne({ _id: video.user });
      const channel_avatar = await UserAvatar.findOne({ user: channel._id });
      const channel_stat = await UserStatistic.findOne({ user: channel._id });
      const video_info = new WatchVideoInfo(
        channel.login,
        channel_stat.count_of_subs,
        video_stat.count_of_views,
        video_stat.count_of_like,
        video_stat.count_of_dislike,
        channel_avatar.avatar_dir + channel_avatar.avatar_name
      );
      console.log(video_info);
      return { ...video_info, video: video };
    } catch (e) {
      return "Ошибка при загруке видео: " + e;
    }
  }
}

module.exports = new UserActionService();

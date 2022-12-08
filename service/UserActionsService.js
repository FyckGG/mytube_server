const Video = require("./../models/Video");
const VideoThumbnail = require("./../models/VideoThumbnail");
const VideoStatistics = require("./../models/VideoStatistic");
const User = require("./../models/User");
const UserAvatar = require("./../models/UserAvatar");
const UserStatistic = require("./../models/UserStatistic");
const VideoComment = require("./../models/VideoComment");
const LikeDislikeVideo = require("./../models/LikeDislikeVideo");
const thumbsupply = require("thumbsupply");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
const WatchVideoInfo = require("./../VideoClasses/WatchVideoInfo");
const PageComment = require("./../CommentClasses/PageComment");

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

  async loadVideoForWatch(video_id, user_id) {
    try {
      const video = await Video.findOne({ _id: video_id });
      const video_stat = await VideoStatistics.findOne({ video: video_id });
      const channel = await User.findOne({ _id: video.user });
      const channel_avatar = await UserAvatar.findOne({ user: channel._id });
      const channel_stat = await UserStatistic.findOne({ user: channel._id });
      const video_mark = await LikeDislikeVideo.findOne({
        video: video_id,
        user: user_id,
      });
      console.log("ld");
      const is_like = video_mark ? video_mark.is_like : null;
      console.log(is_like);
      const video_info = new WatchVideoInfo(
        channel.login,
        channel_stat.count_of_subs,
        video_stat.count_of_views,
        video_stat.count_of_like,
        video_stat.count_of_dislike,
        channel_avatar.avatar_dir + channel_avatar.avatar_name,
        is_like
      );
      console.log(video_info);
      return { ...video_info, video: video };
    } catch (e) {
      return "Ошибка при загруке видео: " + e;
    }
  }

  async sendComment(video_id, user_id, text) {
    try {
      const video_stat = await VideoStatistics.findOne({ video: video_id });
      const video_stat_id = video_stat._id;
      const comment = await VideoComment.create({
        video_stat: video_stat_id,
        user: user_id,
        comment_text: text,
      });
      video_stat.count_of_comments++;
      video_stat.save();
      const user = await User.findById(user_id);
      const user_avatar = await UserAvatar.findOne({ user: user_id });
      const page_comment = new PageComment(
        user.login,
        `${user_avatar.avatar_dir}${user_avatar.avatar_name}`,
        comment.comment_text,
        comment.comment_date
      );
      return page_comment;
    } catch (e) {
      return "Ошибка при отправке комментария: " + e;
    }
  }
}

module.exports = new UserActionService();

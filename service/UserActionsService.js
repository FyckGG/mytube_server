const Video = require("./../models/Video");
const VideoThumbnail = require("./../models/VideoThumbnail");
const VideoStatistics = require("./../models/VideoStatistic");
const User = require("./../models/User");
const UserAvatar = require("./../models/UserAvatar");
const UserStatistic = require("./../models/UserStatistic");
const Subscription = require("./../models/Subscription");
const VideoComment = require("./../models/VideoComment");
const LikeDislikeVideo = require("./../models/LikeDislikeVideo");
const WatchLaterVideo = require("./../models/WatchLaterVideo");
const VideoTags = require("./../models/VideoTags");
const UserComplaint = require("./../models/UserComplaint");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
const WatchVideoInfo = require("./../VideoClasses/WatchVideoInfo");
const PageComment = require("./../CommentClasses/PageComment");
const deleteVideoFromDB = require("../otherServices/deleteVideoFromDB");
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
          console.log("Будет создано" + filenames.join(", "));
        })
        .on("end", function () {
          console.log("Скриншот сделан");
        })
        .takeScreenshots(
          {
            count: 1,
            timemarks: ["0"], // number of seconds
            filename: `${thumbnail_name}.png`,
            folder: __dirname + thumbnail_dir,
          },

          function (err) {
            console.log("Скриншот сохранён");
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

      if (!video) throw new Error("Видео для просмотра не найдено");

      const video_stat = await VideoStatistics.findOne({ video: video_id });
      if (!video_stat) throw new Error("Статистика видео не найдена");

      const channel = await User.findOne({ _id: video.user });
      if (!channel) throw new Error("Владелец видео не найден");

      const channel_avatar = await UserAvatar.findOne({ user: channel._id });
      if (!channel_avatar) throw new Error("Аватар владельца видео не найден");

      const channel_stat = await UserStatistic.findOne({ user: channel._id });
      if (!channel_stat)
        throw new Error("Статистика владельца видео не найдена");

      const video_mark = await LikeDislikeVideo.findOne({
        video: video_id,
        user: user_id,
      });

      const is_like = video_mark ? video_mark.is_like : null;

      const video_info = new WatchVideoInfo(
        channel.login,
        channel_stat.count_of_subs,
        video_stat.count_of_views,
        video_stat.count_of_like,
        video_stat.count_of_dislike,
        channel_avatar.avatar_dir + channel_avatar.avatar_name,
        is_like
      );

      return { ...video_info, video: video };
    } catch (e) {
      return e;
    }
  }

  async sendComment(video_id, user_id, text) {
    try {
      const video_stat = await VideoStatistics.findOne({ video: video_id });

      if (!video_stat) throw new Error("Статистика видео не найдена");

      const video_stat_id = video_stat._id;
      const comment = await VideoComment.create({
        video_stat: video_stat_id,
        user: user_id,
        comment_text: text,
      });
      video_stat.count_of_comments++;
      video_stat.save();

      const user = await User.findById(user_id);

      if (!user) throw new Error("Пользователь не найден");

      const user_avatar = await UserAvatar.findOne({ user: user_id });

      if (!user_avatar) throw new Error("Аватар пользователя не найден");

      const page_comment = new PageComment(
        comment._id,
        user._id,
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

  async deleteComment(comment) {
    try {
      const comment_for_deleting = await VideoComment.findById(comment);
      if (!comment_for_deleting)
        throw new Error("Не удалось найти комментарий для удаления.");
      const deleted_comment = await VideoComment.deleteOne({ _id: comment });
      const video_stats = await VideoStatistics.findOne({
        _id: comment_for_deleting.video_stat,
      });
      video_stats.count_of_comments--;
      return video_stats.save();
    } catch (e) {
      return "Ошибка при удалении комментария: " + e;
    }
  }

  async subscribe(channel_id, subscriber_id) {
    try {
      if (channel_id === subscriber_id)
        throw new Error("Попытка подписки на самого себя.");
      const channel = await User.findById(channel_id);
      const subscriber = await User.findById(subscriber_id);
      if (!channel || !subscriber)
        throw new Error("Несуществующий пользователь.");
      const channel_stats = await UserStatistic.findOne({ user: channel_id });
      if (!channel_stats)
        throw new Error("Не удалось загрузить статистику канала.");

      const is_subs = await Subscription.findOne({
        channel: channel_id,
        subscriber: subscriber_id,
      });
      if (is_subs) throw new Error("Пользователь уже подписался.");
      const subscribe = await Subscription.create({
        channel: channel_id,
        subscriber: subscriber_id,
      });
      channel_stats.count_of_subs++;
      channel_stats.save();
      return subscribe;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async unsubscribe(channel_id, subscriber_id) {
    try {
      if (channel_id === subscriber_id)
        throw new Error("Попытка отписки от самого себя.");
      const channel = await User.findById(channel_id);
      const subscriber = await User.findById(subscriber_id);
      if (!channel || !subscriber)
        throw new Error("Несуществующий пользователь.");
      const channel_stats = await UserStatistic.findOne({ user: channel_id });
      if (!channel_stats)
        throw new Error("Не удалось загрузить статистику канала.");
      const is_subs = await Subscription.findOne({
        channel: channel_id,
        subscriber: subscriber_id,
      });
      if (!is_subs) throw new Error("Подписка не найдена.");
      const unsubscribe = await Subscription.deleteOne({
        channel: channel_id,
        subscriber: subscriber_id,
      });
      channel_stats.count_of_subs--;
      channel_stats.save();
      return unsubscribe;
    } catch (e) {
      return e;
    }
  }

  async addToWatchLater(video_id, user_id) {
    const video = await Video.findById(video_id);
    const user = await User.findById(user_id);
    if (!user) throw new Error("Видео не найдено.");
    const watch_later_video = await WatchLaterVideo.findOne({
      video: video_id,
      user: user_id,
    });
    if (watch_later_video !== null)
      throw new Error("Запись о просмотре позже уже добавлена.");
    const watch_later_res = await WatchLaterVideo.create({
      video: video_id,
      user: user_id,
    });
    return watch_later_res;
  }

  async deleteWatchLater(video_id, user_id) {
    const video = await Video.findById(video_id);
    const user = await User.findById(user_id);
    if (!video) throw new Error("Пользователь не найден.");
    if (!user) throw new Error("Видео не найдено.");
    const watch_later_result = await WatchLaterVideo.deleteOne({
      video: video_id,
      user: user_id,
    });

    return watch_later_result;
  }

  async editVideo(
    user_id,
    video_id,
    video_name,
    video_description,
    video_access
  ) {
    const user = await User.findById(user_id);
    if (!user) throw new Error("Пользователь не найден");
    const video = await Video.findById(video_id);
    if (video.user != user_id) {
      throw new Error("Пользователь не имеет права редактировать это видео");
    }
    if (!video) throw new Error("Видео для редактирования не найдено");
    video.video_name = video_name;
    video.video_description = video_description;
    video.is_public = video_access;

    return video.save();
  }

  async editTags(user_id, video_id, tags, hash_tags) {
    const user = await User.findById(user_id);
    if (!user) throw new Error("Пользователь не найден");
    const video = await Video.findById(video_id);
    if (video.user != user_id) {
      throw new Error(
        "Пользователь не имеет права редактировать теги этого видео"
      );
    }
    const video_tags = await VideoTags.findOne({ video: video_id });
    video_tags.tags_list = tags;
    video_tags.hash_tags_list = hash_tags;
    return video_tags.save();
  }

  async deleteVideo(video_id) {
    const result = await deleteVideoFromDB(video_id);

    return result;
  }

  async sendComplaint(complaint_source, complaint_target, complaint_text) {
    const complaint = await UserComplaint.create({
      complaint_source: complaint_source,
      complaint_target: complaint_target,
      complaint_text: complaint_text,
    });

    return complaint;
  }
}

module.exports = new UserActionService();

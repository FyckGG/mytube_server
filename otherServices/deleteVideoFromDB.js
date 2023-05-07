const Video = require("../models/Video");
const VideoThumbnail = require("../models/VideoThumbnail");
const VideoTags = require("../models/VideoTags");
const VideoStatistics = require("../models/VideoStatistic");
const VideoComment = require("../models/VideoComment");
const LikeDislikeVideo = require("../models/LikeDislikeVideo");
const WatchLaterVideo = require("../models/WatchLaterVideo");
const fs = require("fs");

const deleteVideoFromDB = async (video_id) => {
  const video = await Video.findById(video_id);
  if (!video) throw new Error("Видео для удаления не найдено");
  const video_preview = await VideoThumbnail.findOne({ video: video_id });
  if (!video_preview) throw new Error("Не найдено превью видео для удаления");
  console.log(`${__dirname}/../${video.video_directory}`);
  fs.unlink(`${__dirname}/../${video.video_directory}`, (err) => {
    if (err) throw err;
    console.log("Видео удалено");
  });
  fs.unlink(
    `${__dirname}/../${video_preview.thumbnail_directory}/${video_preview.thumbnail_name}`,
    (err) => {
      if (err) throw err;
      console.log("Превью видео удалено");
    }
  );
  await Video.deleteOne({ _id: video_id });
  await VideoThumbnail.deleteOne({ video: video_id });

  await VideoTags.deleteOne({ video: video_id });

  const video_stats = await VideoStatistics.findOne({ video: video_id });
  await VideoStatistics.deleteOne({ video: video_id });

  const comments = await VideoComment.find({ video_stat: video_stats._id });

  if (comments) await VideoComment.deleteMany({ video_stat: video_stats._id });

  const marks = await LikeDislikeVideo.find({ video: video_id });
  if (marks) await LikeDislikeVideo.deleteMany({ video: video_id });

  const watch_later = await WatchLaterVideo.find({ video: video_id });
  if (watch_later) await WatchLaterVideo.deleteMany({ video: video_id });

  return "Видео полностью удалено с сервера";
};

module.exports = deleteVideoFromDB;

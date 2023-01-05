const { Schema, model } = require("mongoose");

const WatchLaterVideo = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = new model("WatchLaterVideo", WatchLaterVideo);

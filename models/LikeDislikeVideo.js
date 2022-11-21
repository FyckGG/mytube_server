const { Schema, model } = require("mongoose");

const LikeDislikeVideo = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  is_like: { type: Boolean, required: true },
});

module.exports = new model("LikeDislikeVideo", LikeDislikeVideo);

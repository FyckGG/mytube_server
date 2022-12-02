const { model, Schema } = require("mongoose");

const VideoComment = new Schema({
  video_stat: { type: Schema.Types.ObjectId, ref: "UserStatistics" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment_text: { type: String, required: true },
  comment_date: { type: Date, default: Date.now },
});

module.exports = new model("VideoComment", VideoComment);

const { Schema, model } = require("mongoose");

const Video = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  video_name: { type: String, required: true },
  video_directory: { type: String, required: true },
  video_description: { type: String },
  is_public: { type: Boolean, default: true },
  video_subject: { type: String, required: true },
  video_duration: { type: Number, required: true },
  upload_date: { type: Date, default: Date.now },
});

module.exports = new model("Video", Video);

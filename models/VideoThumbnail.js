const { Schema, model } = require("mongoose");

const VideoThumbnail = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video" },
  thumbnail_name: { type: String, required: true },
  thumbnail_directory: { type: String, required: true },
});

module.exports = new model("VideoThumbnail", VideoThumbnail);

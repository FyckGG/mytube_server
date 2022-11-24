const { Schema, model } = require("mongoose");

const VideoMark = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  is_good: { type: Boolean, required: true },
});

module.export = new model("VideoMark", VideoMark);

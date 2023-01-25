const { Schema, model } = require("mongoose");

const VideoTags = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video" },
  tags_list: { type: [String] },
  hash_tags_list: { type: [String] },
});

module.exports = new model("VideoTags", VideoTags);

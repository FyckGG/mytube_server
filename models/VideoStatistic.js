const { Schema, model } = require("mongoose");

const VideoStatistics = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video" },
  count_of_like: { type: Number, required: true },
  count_of_dislike: { type: Number, required: true },
  count_of_views: { type: Number, required: true },
  count_of_comments: { type: Number, required: true },
});

module.exports = new model("VideoStatistics", VideoStatistics);

const { Schema, model } = require("mongoose");

const VideoComplaint = new Schema({
  complaint_source: { type: Schema.Types.ObjectId, ref: "User" },
  complaint_target: { type: Schema.Types.ObjectId, ref: "Video" },
  complaint_text: { type: String, required: true },
  complaint_date: { type: Date, default: Date.now },
});

module.exports = new model("VideoComplaint", VideoComplaint);

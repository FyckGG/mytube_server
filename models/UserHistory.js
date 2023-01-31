const { Schema, model } = require("mongoose");

const UserHistory = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  history_videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});

module.exports = new model("UserHistory", UserHistory);

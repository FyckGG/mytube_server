const { Schema, model } = require("mongoose");

const UserAvatar = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  avatar_name: { type: String, required: true },
  avatar_dir: { type: String, required: true },
});

module.exports = new model("UserAvatar", UserAvatar);

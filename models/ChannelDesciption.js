const { Schema, model } = require("mongoose");

const ChannelDescription = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String, default: "Описание отсутствует" },
});

module.exports = new model("ChannelDescription", ChannelDescription);

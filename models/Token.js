const { Schema, model } = require("mongoose");

const Token = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

module.exports = new model("Token", Token);

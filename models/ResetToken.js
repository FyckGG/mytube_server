const { Schema, model } = require("mongoose");

const ResetToken = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  resetToken: { type: String, required: true },
});

module.exports = new model("ResetToken", ResetToken);

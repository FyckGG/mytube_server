const { Schema, model } = require("mongoose");

const User = new Schema({
  email: { type: String, unique: true, required: true },
  login: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  img_profile: { type: String, default: "vfvfv" },
});

module.exports = new model("User", User);

const { Schema, model } = require("mongoose");

const User = new Schema({
  email: { type: String, unique: true, required: true },
  login: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  sign_date: { type: Date, default: Date.now },
});

module.exports = new model("User", User);

const { Schema, model } = require("mongoose");

const Subscription = new Schema({
  channel: { type: Schema.Types.ObjectId, ref: "User" },
  subscriber: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = new model("Subscription", Subscription);

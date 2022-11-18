const { Schema, model } = require("mongoose");

const UserStatistics = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  count_of_subs: { type: Number, required: true, default: 0 },
  count_of_views: { type: Number, required: true, default: 0 },
});

module.exports = new model("UserStatistics", UserStatistics);

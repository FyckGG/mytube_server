const { Schema, model } = require("mongoose");

const UserComplaint = new Schema({
  complaint_source: { type: Schema.Types.ObjectId, ref: "User" },
  complaint_target: { type: Schema.Types.ObjectId, ref: "User" },
  complaint_text: { type: String, required: true },
  complaint_date: { type: Date, default: Date.now },
});

module.exports = new model("UserComplaint", UserComplaint);

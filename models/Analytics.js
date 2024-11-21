const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  feature: String,
  age: String,
  gender: String,
  timeSpent: Number,
  date: Date,
});

module.exports = mongoose.model("Analytics", analyticsSchema);

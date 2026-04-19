const mongoose = require('mongoose');

const WeeklyMenuSchema = new mongoose.Schema({
  dayIndex: { type: Number, required: true, unique: true },
  A: { type: String, required: true },
  B: { type: String, required: true },
  C: { type: String, required: true },
  dessert: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyMenu', WeeklyMenuSchema);
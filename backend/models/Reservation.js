const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  location: { type: String, enum: ['beltér', 'kerthelyiség'], required: true },
  options: [String],
  party_color: { type: String, default: null },
  message: { type: String },
  agree: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
const Reservation = require('../models/Reservation');

exports.submitReservation = async (req, res) => {
  try {
    const { name, phone, email, date, time, guests, location, options, party_color, message, agree } = req.body;
    const reservation = new Reservation({
      name, phone, email, date, time, guests, location,
      options: options || [],
      party_color: party_color || null,
      message, agree: agree === 'on' || agree === true
    });
    await reservation.save();
    res.json({ success: true, message: 'Reservation saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
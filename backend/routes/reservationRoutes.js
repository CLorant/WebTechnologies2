const express = require('express');
const { submitReservation, getReservations } = require('../controllers/reservationController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', submitReservation);
router.get('/', auth, getReservations);

module.exports = router;
const express = require('express');
const { getWeeklyMenu, updateWeeklyMenu } = require('../controllers/weeklyMenuController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getWeeklyMenu);
router.put('/', auth, updateWeeklyMenu);

module.exports = router;
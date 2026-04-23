const express = require('express');
const { submitContact, getContacts } = require('../controllers/contactController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', submitContact);
router.get('/', auth, getContacts);

module.exports = router;
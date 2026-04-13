const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
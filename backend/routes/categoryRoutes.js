const express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory, uploadImage } = require('../controllers/categoryController');
const { upload } = require('../middleware/upload');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.post('/upload', auth, upload.single('image'), uploadImage);

module.exports = router;
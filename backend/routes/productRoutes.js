const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImage } = require('../controllers/productController');
const { upload } = require('../middleware/upload');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/upload', auth, upload.single('image'), uploadImage);

module.exports = router;
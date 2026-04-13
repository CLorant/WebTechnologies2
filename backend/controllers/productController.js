const { upload, processImage } = require('../middleware/upload');
const Product = require('../models/Product');

// Get all products (with optional search and category filter)
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, img, price, category } = req.body;
    const product = new Product({ name, description, img, price, category });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { name, description, img, price, category } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (img) product.img = img;
    if (price) product.price = price;
    if (category) product.category = category;

    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.remove();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { productName, productId } = req.body;
    if (!productName || !productId) {
      return res.status(400).json({ success: false, message: 'Missing productName or productId' });
    }
    const imagePath = await processImage(req.file, 'products', productName, productId);
    res.json({ success: true, imagePath });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
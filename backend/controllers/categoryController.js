const { upload, processImage } = require('../middleware/upload');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get single category
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, icon } = req.body;
        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).json({ success: false, message: 'Category name already exists' });
        const category = new Category({ name, icon });
        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name, icon } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        if (name) category.name = name;
        if (icon) category.icon = icon;
        await category.save();
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete category (only if no products use it)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        const productsUsing = await Product.findOne({ category: category.name }); // or store category ID in Product
        if (productsUsing) {
            return res.status(400).json({ success: false, message: 'Cannot delete category because it is used by products' });
        }
        await category.deleteOne();
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { categoryName, categoryId } = req.body;
    if (!categoryName || !categoryId) {
      return res.status(400).json({ success: false, message: 'Missing categoryName or categoryId' });
    }
    const imagePath = await processImage(req.file, 'categories', categoryName, categoryId);
    res.json({ success: true, imagePath });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getMenu = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const menu = {};

    for (const cat of categories) {
      const products = await Product.find({ category: cat._id })
        .select('name description img price')
        .lean();

      if (products.length > 0) {
        menu[cat.slug] = {
          name: cat.name,
          icon: cat.icon,
          items: products.map(p => ({
            name: p.name,
            description: p.description,
            img: p.img,
            price: p.price
          }))
        };
      }
    }
    res.json(menu);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
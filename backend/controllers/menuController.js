const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getMenu = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const menu = {};

    for (const cat of categories) {
      const items = await Product.find({ category: cat.slug }).select('name description img price');
      if (items.length > 0) {
        menu[cat.slug] = {
          name: cat.name,
          icon: cat.icon,
          items: items.map(p => ({
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
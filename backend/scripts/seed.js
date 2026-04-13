const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const menuData = require('./menu.json');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    const adminPassword = await bcrypt.hash('WB2002', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@westernbite.com',
      phone: '+36 1 234 5678',
      password: adminPassword
    });
    await admin.save();
    console.log('Admin user created');

    const categoryMap = new Map();
    for (const [key, value] of Object.entries(menuData)) {
      const category = new Category({
        name: value.name,
        icon: value.icon
      });
      await category.save();
      categoryMap.set(key, category._id);
      console.log(`Category created: ${value.name}`);
    }

    for (const [categoryKey, categoryData] of Object.entries(menuData)) {
      const categoryId = categoryMap.get(categoryKey);
      const items = categoryData.items;
      for (const item of items) {
        const product = new Product({
          name: item.name,
          description: item.description,
          img: item.img,
          price: item.price,
          category: categoryId
        });
        await product.save();
      }
    }
    console.log('Products seeded');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
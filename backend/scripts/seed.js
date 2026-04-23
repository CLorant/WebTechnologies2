const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const WeeklyMenu = require('../models/WeeklyMenu');

dotenv.config({ path: path.join(__dirname, '../.env') });

const menuData = require('./menu.json');
const weeklyMenuData = require('./weekly-menu.json');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await WeeklyMenu.deleteMany({});
    console.log('Cleared existing data');

    const admin = new User({
      name: 'Admin',
      email: 'admin@westernbite.com',
      phone: '+36 1 234 5678',
      password: 'WB2002'
    });
    await admin.save();
    console.log('Admin user created');

    const categoryMap = new Map();
    for (const [key, value] of Object.entries(menuData)) {
      const category = new Category({
        name: value.name,
        slug: key,
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

    for (let i = 0; i < weeklyMenuData.length; i++) {
      const day = weeklyMenuData[i];
      const weeklyMenuItem = new WeeklyMenu({
        dayIndex: i,
        A: day.A,
        B: day.B,
        C: day.C,
        dessert: day.dessert
      });
      await weeklyMenuItem.save();
    }
    console.log(`Weekly menu seeded (${weeklyMenuData.length} days)`);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
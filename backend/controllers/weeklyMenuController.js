const WeeklyMenu = require('../models/WeeklyMenu');

exports.getWeeklyMenu = async (req, res) => {
  try {
    const menu = await WeeklyMenu.find().sort({ dayIndex: 1 });
    // Transform to array of objects like original format
    const result = menu.map(day => ({
      A: day.A,
      B: day.B,
      C: day.C,
      dessert: day.dessert
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWeeklyMenu = async (req, res) => {
  try {
    const { menu } = req.body; // menu is an array of 5 items (Mon-Fri)
    // Delete existing
    await WeeklyMenu.deleteMany({});
    // Insert new
    const docs = menu.map((day, idx) => ({
      dayIndex: idx,
      A: day.A,
      B: day.B,
      C: day.C,
      dessert: day.dessert
    }));
    await WeeklyMenu.insertMany(docs);
    res.json({ success: true, message: 'Weekly menu updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const WeeklyMenu = require('../models/WeeklyMenu');

exports.getWeeklyMenu = async (req, res) => {
  try {
    let menu = await WeeklyMenu.find().sort({ dayIndex: 1 });
    if (menu.length === 0) {
      const emptyDays = Array(5).fill().map((_, i) => ({
        A: '', B: '', C: '', dessert: ''
      }));
      return res.json(emptyDays);
    }
    const result = menu.map(day => ({
      A: day.A, B: day.B, C: day.C, dessert: day.dessert
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWeeklyMenu = async (req, res) => {
  try {
    const { menu } = req.body;
    await WeeklyMenu.deleteMany({});
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
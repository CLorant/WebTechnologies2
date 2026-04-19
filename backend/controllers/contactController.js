const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const { name, phone, email, message, agree } = req.body;
    const contact = new Contact({ name, phone, email, message, agree: agree === 'on' || agree === true });
    await contact.save();
    res.json({ success: true, message: 'Contact saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
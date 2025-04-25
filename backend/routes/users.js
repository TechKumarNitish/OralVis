const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get all dentists
router.get('/dentists', protect, async (req, res) => {
  try {
    const dentists = await User.find({ role: 'dentist' })
      .select('name email phoneNumber address');

    res.status(200).json({
      status: 'success',
      data: { dentists }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
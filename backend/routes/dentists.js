const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User');
const Checkup = require('../models/Checkup');

// Get dentist's profile
router.get('/profile', protect, restrictTo('dentist'), async (req, res) => {
  try {
    const dentist = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      status: 'success',
      data: { dentist }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update dentist's profile
router.patch('/profile', protect, restrictTo('dentist'), async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;
    const dentist = await User.findByIdAndUpdate(
      req.user._id,
      { name, phoneNumber, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: { dentist }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dentist's checkup requests
router.get('/checkups', protect, restrictTo('dentist'), async (req, res) => {
  try {
    const checkups = await Checkup.find({ dentist: req.user._id })
      .populate('patient', 'name email phoneNumber')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { checkups }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dentist's completed checkups
router.get('/completed-checkups', protect, restrictTo('dentist'), async (req, res) => {
  try {
    const checkups = await Checkup.find({ 
      dentist: req.user._id,
      status: 'completed'
    })
      .populate('patient', 'name email phoneNumber')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { checkups }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dentist's pending checkups
router.get('/pending-checkups', protect, restrictTo('dentist'), async (req, res) => {
  try {
    const checkups = await Checkup.find({ 
      dentist: req.user._id,
      status: 'pending'
    })
      .populate('patient', 'name email phoneNumber')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { checkups }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dentist's statistics
router.get('/stats', protect, restrictTo('dentist'), async (req, res) => {
  try {
    const totalCheckups = await Checkup.countDocuments({ dentist: req.user._id });
    const completedCheckups = await Checkup.countDocuments({ 
      dentist: req.user._id,
      status: 'completed'
    });
    const pendingCheckups = await Checkup.countDocuments({ 
      dentist: req.user._id,
      status: 'pending'
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalCheckups,
          completedCheckups,
          pendingCheckups
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
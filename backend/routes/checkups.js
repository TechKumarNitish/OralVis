const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, restrictTo } = require('../middleware/auth');
const Checkup = require('../models/Checkup');
const Image = require('../models/Image');
const mongoose = require('mongoose');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a new checkup request
router.post('/', protect, restrictTo('patient'), async (req, res) => {
  try {
    const { dentistId, appointmentDate, reason } = req.body;
   
    
    const checkup = await Checkup.create({
      patient: req.user._id,
      dentist: dentistId,
      appointmentDate,
      reason
    });

    res.status(201).json({
      status: 'success',
      checkup 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, restrictTo('dentist'), async (req, res) => {
  try {
    const { status, additionalNote } = req.body;
    const checkup = await Checkup.findByIdAndUpdate(req.params.id, { status, additionalNote }, { new: true });
    res.status(200).json({
      status: 'success',
    checkup 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get all checkups for a patient
router.get('/patient', protect, async (req, res) => {
  try {
    let checkups = [];
    if(req.user.role === 'patient') checkups = await Checkup.find({ patient: req.user._id })
      .populate('dentist', 'name email phoneNumber')
      .sort('-createdAt');
    else checkups = await Checkup.find({ dentist: req.user._id })
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

// Get all checkups for a dentist
router.get('/dentist', protect, restrictTo('dentist'), async (req, res) => {
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



// Get a single checkup
router.get('/:id', protect, async (req, res) => {
  try {
    const checkup = await Checkup.findById(req.params.id)
      .populate('patient', 'name email phoneNumber')
      .populate('dentist', 'name email phoneNumber').
      populate('images');

    if (!checkup) {
      return res.status(404).json({ message: 'Checkup not found' });
    }

    // Check if user is authorized to view this checkup
    if (req.user.role === 'patient' && checkup.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this checkup' });
    }

    if (req.user.role === 'dentist' && checkup.dentist._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this checkup' });
    }

    res.status(200).json({
      status: 'success',
      checkup
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.post('/:id/image', protect, restrictTo('dentist'),upload.single('image'), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    const checkupId = req.params.id;
    const checkup = await Checkup.findById(checkupId).session(session);
    
    if(!checkup){
      return res.status(404).json({ message: 'Checkup not found' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const { note } = req.body;
    const image = new Image({ url: imageUrl, note });
    await image.save({ session });

    checkup.images.push(image._id);
    await checkup.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Image uploaded and Checkup updated', image });

  }catch(error){
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:checkupId/image/:imageId', protect, restrictTo('dentist'),async (req, res) => {
  const { imageId, checkupId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find image
    const image = await Image.findById(imageId).session(session);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // 2. Remove image reference from checkup
    const checkup = await Checkup.findById(checkupId).session(session);
    if (!checkup) return res.status(404).json({ message: 'Checkup not found' });

    checkup.images.pull(imageId);
    await checkup.save({ session });

    // 3. Delete image doc
    await Image.deleteOne({ _id: imageId }).session(session);

    // 4. Physically remove the file
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(image.url));
    fs.unlink(filePath, (err) => {
      if (err) console.warn('File deletion warning:', err.message); // soft fail
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Image deleted successfully' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});



module.exports = router; 
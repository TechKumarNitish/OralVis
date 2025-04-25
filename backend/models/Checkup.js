const mongoose = require('mongoose');

const Image = require('./Image');
const User = require('./User');

const checkupSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dentist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: String, 
  appointmentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  additionalNote: String,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Checkup', checkupSchema); 
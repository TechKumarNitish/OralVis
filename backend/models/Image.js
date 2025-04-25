const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema); 
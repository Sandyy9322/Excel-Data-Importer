const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  verified: {
    type: String,
    required: true,
    enum: ['Yes', 'No'],
  },
});

module.exports = mongoose.model('Data', dataSchema);
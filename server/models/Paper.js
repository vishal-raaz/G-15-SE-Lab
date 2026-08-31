const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    default: 'University of Mumbai'
  },
  examination: {
    type: String,
    default: 'End Semester Examination'
  },
  time: {
    type: String,
    default: '3 Hours'
  },
  maxMarks: {
    type: Number,
    default: 50
  },
  sections: [{
    title: { type: String },
    questions: [{
      text: { type: String },
      marks: { type: Number },
      difficulty: { type: String }
    }]
  }],
  totalMarks: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Paper', paperSchema);

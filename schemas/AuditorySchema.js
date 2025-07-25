const mongoose = require('mongoose');

const AuditorySchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
    default: 'AUDITORY'
  },
  questions: [{
    id: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: String,
      required: true
    },
    audioText: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }]
  }],
  audioUrl: {
    type: String,
    required: false // Optional, as the audio is referenced in the frontend
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditoryQuiz', AuditorySchema);
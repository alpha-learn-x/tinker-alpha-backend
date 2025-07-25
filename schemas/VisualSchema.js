const mongoose = require('mongoose');

const VisualSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
    default: 'VISUAL'
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
    pauseAt: {
      type: Number,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }]
  }],
  youtubeUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VisualQuiz', VisualSchema);
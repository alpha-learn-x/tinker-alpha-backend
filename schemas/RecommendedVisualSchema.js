const mongoose = require('mongoose');

const VisualSchema = new mongoose.Schema({
  quizName: { type: String, required: true, default: 'VISUAL' },
  question: { type: String, required: true },
  answer1: { type: String, required: true },
  answer2: { type: String, required: true },
  answer3: { type: String, required: true },
  answer4: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  pauseAt: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VisualQuiz', VisualSchema);
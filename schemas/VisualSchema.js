const mongoose = require('mongoose');

const VisualSchema = new mongoose.Schema({
  quizName: {type: String, required: true, default: 'VISUAL'},
  question: {type: String, required: true},
  answer1: {type: String},
  answer2: {type: String},
  answer3: {type: String},
  answer4: {type: String},
  correctAnswer: {type: String},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('VisualQuiz', VisualSchema);

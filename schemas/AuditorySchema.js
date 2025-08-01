const mongoose = require('mongoose');

const AuditorySchema = new mongoose.Schema({
  quizName: {type: String, required: true, default: 'AUDITORY'},
  question: {type: String, required: true},
  answer1: {type: String},
  answer2: {type: String},
  answer3: {type: String},
  answer4: {type: String},
  correctAnswer: {type: String},
  audioUrl: {type: String, required: false},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('AuditoryQuiz', AuditorySchema);
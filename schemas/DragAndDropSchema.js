const mongoose = require('mongoose');

const DragAndDropSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
    default: 'DRAGANDDROP'
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
    options: [{
      type: String,
      required: true
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DragAndDropQuiz', DragAndDropSchema);
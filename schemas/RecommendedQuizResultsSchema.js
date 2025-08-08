const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    quizName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    participatedQuestions: {
        type: Number,
        required: true
    },
    totalTime: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rec_QuizResult', quizResultSchema);
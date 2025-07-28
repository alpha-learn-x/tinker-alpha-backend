// Schema Definition
const mongoose = require('mongoose');

const ReadWriteSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
        default: 'READWRITE'
    },
    questions: [{
        id: {
            type: Number,
            required: true
        },
        scenario: {
            type: String,
            required: true
        },
        steps: [{
            type: String,
            required: true
        }],
        correctOrder: [{
            type: Number,
            required: true
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReadWriteQuiz', ReadWriteSchema);



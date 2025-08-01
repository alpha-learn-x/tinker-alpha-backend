const mongoose = require('mongoose');

const AuditorySchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
        default: 'RECAUDITORY'
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
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RecAuditoryQuiz', AuditorySchema);
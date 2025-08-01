// backend/schemas/KinestheticSchema.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    }
});

const KinestheticSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
        default: 'RECKINESTHETIC'
    },
    tasks: [{
        id: {
            type: Number,
            required: true
        },
        images: [imageSchema],
        options: [{
            type: String,
            required: true
        }],
        correctAnswers: {
            type: Object,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RecKinestheticQuiz', KinestheticSchema);
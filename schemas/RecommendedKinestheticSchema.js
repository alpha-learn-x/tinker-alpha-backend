const mongoose = require('mongoose');

const MatchItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

const KinestheticSchema = new mongoose.Schema({
    quizName: { type: String, required: true, default: 'KINESTHETIC' },
    question: { type: String, required: true },
    matchItems: [MatchItemSchema],
    correctPairs: { type: Map, of: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KinestheticQuiz', KinestheticSchema);

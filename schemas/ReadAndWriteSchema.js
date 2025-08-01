// Schema Definition
const mongoose = require('mongoose');

const ReadWriteSchema = new mongoose.Schema({
    quizName: {type: String, required: true, default: 'READWRITE'},
    question: {type: String, required: true},
    answer1Id: {type: String},
    answer1: {type: String},
    answer2Id: {type: String},
    answer2: {type: String},
    answer3Id: {type: String},
    answer3: {type: String},
    answer4Id: {type: String},
    answer4: {type: String},
    correctAnswerOrder: {type: String},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ReadWriteQuiz', ReadWriteSchema);



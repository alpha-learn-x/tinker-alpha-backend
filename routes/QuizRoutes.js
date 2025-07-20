const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/QuizResultsController');

router.post('/saveQuizResults', quizResultController.saveQuizResults);

router.get('/get-all-quiz-results', quizResultController.getAllQuizResults);

module.exports = router;
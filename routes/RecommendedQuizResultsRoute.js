const express = require('express');
const router = express.Router();
const quizResultsController = require('../controllers/QuizResultsController');
const authMiddleware = require("../utill/authMiddleware");

// Routes
router.post('/results', quizResultsController.saveQuizResult);
router.get('/results', quizResultsController.getAllQuizResults);
router.get('/results/user/:userId', quizResultsController.getQuizResultsByUser);
router.get('/results/user/:userId/quiz/:quizName', quizResultsController.getQuizResultsByUserAndQuizName);
router.get('/results/percentages', quizResultsController.getUserQuestionTypePercentages);
router.get('/results/me/percentages', authMiddleware, quizResultsController.getLoggedInUserQuestionTypePercentages);

module.exports = router;
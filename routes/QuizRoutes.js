const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/QuizResultsController');

router.post('/results/create', quizResultController.saveQuizResult);
router.get('/get-all', quizResultController.getAllQuizResults);
router.get('/get-by/user/:userId', quizResultController.getQuizResultsByUser);
router.get('/get-by/user/:userId/quiz/:quizName', quizResultController.getQuizResultsByUserAndQuizName);

module.exports = router;

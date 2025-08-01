const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/RecommendedQuizResultsController');
const authMiddleware = require('../utill/authMiddleware');

router.get('/user-quiz-totals', authMiddleware, quizResultController.getLoggedInUserQuizTotals);

router.post('/saveQuizResults', quizResultController.saveQuizResults);

router.get('/get-all-quiz-results', quizResultController.getAllQuizResults);

// router.get('/student-quiz-totals', quizResultController.getStudentQuizTotals);

router.get('/quiz-results/:quizName/:userId', quizResultController.getUserQuizResults);


module.exports = router;
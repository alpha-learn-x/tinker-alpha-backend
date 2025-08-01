// backend/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const kinestheticController = require('../controllers/RecommendedKinestheticController');

router.get('/tasks', kinestheticController.getQuizTasks);
router.post('/tasks', kinestheticController.saveQuizTasks);
router.post('/saveQuizResults', kinestheticController.saveQuizResults);
router.get('/results/:userId', kinestheticController.getUserQuizResults);

module.exports = router;
const express = require('express');
const router = express.Router();
const visualController = require('../controllers/RecommendedVisualController');

router.get('/questions', visualController.getQuizQuestions);
router.post('/questions', visualController.saveQuizQuestions);
router.post('/saveQuizResults', visualController.saveQuizResults);

module.exports = router;
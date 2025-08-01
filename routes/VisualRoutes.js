const express = require('express');
const router = express.Router();
const visualController = require('../controllers/VisualController');

router.get('/get-all', visualController.getAllVisualQuizzes);
router.post('/create', visualController.saveVisualQuiz);
router.post('/check-answer', visualController.checkVisualAnswer);

module.exports = router;

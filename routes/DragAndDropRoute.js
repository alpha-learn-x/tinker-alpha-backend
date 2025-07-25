const express = require('express');
const router = express.Router();
const dragAndDropController = require('../controllers/DragAndDropController');

router.get('/questions', dragAndDropController.getQuizQuestions);
router.post('/questions', dragAndDropController.saveQuizQuestions);
router.post('/saveQuizResults', dragAndDropController.saveQuizResults);

module.exports = router;
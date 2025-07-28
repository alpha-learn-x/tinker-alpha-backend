// Routes
const express = require('express');
const router = express.Router();
const readWriteController = require('../controllers/ReadAndWriteController');

router.get('/questions', readWriteController.getQuizQuestions);
router.post('/questions', readWriteController.saveQuizQuestions);

module.exports = router;

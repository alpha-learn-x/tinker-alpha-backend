const express = require('express');
const router = express.Router();
const readWriteController = require('../controllers/ReadAndWriteController');

router.get('/get-all', readWriteController.getAllReadWriteQuizzes);
router.post('/create', readWriteController.saveReadWriteQuiz);
router.post('/check-answer', readWriteController.checkReadWriteAnswer);

module.exports = router;

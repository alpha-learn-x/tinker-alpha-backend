const express = require('express');
const router = express.Router();
const kinestheticController = require('../controllers/KinestheticController');

router.get('/get-all', kinestheticController.getAllKinestheticQuizzes);
router.post('/create', kinestheticController.saveKinestheticQuiz);
router.post('/check-answer', kinestheticController.checkKinestheticAnswer);

module.exports = router;

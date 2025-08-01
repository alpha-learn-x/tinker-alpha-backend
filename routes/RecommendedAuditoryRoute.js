const express = require('express');
const router = express.Router();
const auditoryController = require('../controllers/RecommendedAuditoryController');

router.get('/questions', auditoryController.getQuizQuestions);
router.post('/questions', auditoryController.saveQuizQuestions);
router.post('/saveQuizResults', auditoryController.saveQuizResults);

module.exports = router;
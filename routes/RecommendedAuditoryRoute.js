const express = require('express');
const router = express.Router();
const auditoryController = require('../controllers/AuditoryController');

router.get('/get-all', auditoryController.getAllAuditoryQuizzes);
router.post('/create', auditoryController.saveAuditoryQuiz);
router.post('/check-answer', auditoryController.checkAuditoryAnswer);


module.exports = router;

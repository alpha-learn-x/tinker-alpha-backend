const express = require('express');
const router = express.Router();
const activityController = require('../controllers/ActivityController');

// Get activity progress
router.get('/:activityId/progress/:userId', activityController.getActivityProgress);

// Save completions
router.post('/:activityId/circuit/:userId', activityController.saveCircuitCompletion);
router.post('/:activityId/activity/:userId', activityController.saveActivityCompletion);
router.post('/:activityId/puzzle/:userId', activityController.savePuzzleCompletion);

// Save user actions
router.post('/:activityId/action/:userId', activityController.saveUserAction);

// Get analytics
router.get('/analytics/:userId', activityController.getUserAnalytics);

module.exports = router;
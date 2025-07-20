const UserActivityProgress = require('../schemas/UserActivityProgressSchema');
const UserAction = require('../schemas/UserActionSchema');
const User = require('../schemas/UserSchema');
const Activity = require('../schemas/ActivitySchema');

// Initialize or get user's activity progress
exports.getActivityProgress = async (req, res) => {
  try {
    const { userId, activityId } = req.params;
    
    let progress = await UserActivityProgress.findOne({
      userId,
      activityId
    }).populate('userId', 'name email').populate('activityId', 'title subject');
    
    if (!progress) {
      // Create new progress record
      const activity = await Activity.findById(activityId);
      progress = new UserActivityProgress({
        userId,
        activityId,
        activityTitle: activity.title,
        status: 'not_started'
      });
      await progress.save();
    }
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity progress',
      error: error.message
    });
  }
};

// Save circuit completion
exports.saveCircuitCompletion = async (req, res) => {
  try {
    const { userId, activityId } = req.params;
    const { circuitData, starsEarned } = req.body;
    
    const progress = await UserActivityProgress.findOne({ userId, activityId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Activity progress not found'
      });
    }
    
    // Update circuit completion
    progress.circuitAnswers.push({
      components: circuitData.components,
      connections: circuitData.connections,
      working: circuitData.working,
      completedAt: new Date(),
      timeSpent: circuitData.timeSpent || 0,
      attempts: circuitData.attempts || 1
    });
    
    progress.sectionProgress.circuitCompleted = true;
    progress.starsEarned += starsEarned;
    progress.totalScore += 25; // Circuit completion points
    progress.currentSection = 'activity';
    progress.updatedAt = new Date();
    
    await progress.save();
    
    // Update user's total stats
    await User.findByIdAndUpdate(userId, {
      $inc: { totalStars: starsEarned, totalScore: 25 }
    });
    
    res.json({
      success: true,
      message: 'Circuit completion saved successfully',
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving circuit completion',
      error: error.message
    });
  }
};

// Save activity completion
exports.saveActivityCompletion = async (req, res) => {
  try {
    const { userId, activityId } = req.params;
    const { activityData, starsEarned } = req.body;
    
    const progress = await UserActivityProgress.findOne({ userId, activityId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Activity progress not found'
      });
    }
    
    // Update activity completion
    progress.activityAnswers.push({
      activityType: activityData.activityType,
      questionsAnswered: activityData.questionsAnswered,
      correctAnswers: activityData.correctAnswers,
      score: activityData.score,
      timeSpent: activityData.timeSpent,
      completedAt: new Date(),
      answers: activityData.answers || []
    });
    
    progress.sectionProgress.activityCompleted = true;
    progress.starsEarned += starsEarned;
    progress.totalScore += activityData.score;
    progress.currentSection = 'puzzle';
    progress.updatedAt = new Date();
    
    await progress.save();
    
    // Update user's total stats
    await User.findByIdAndUpdate(userId, {
      $inc: { totalStars: starsEarned, totalScore: activityData.score }
    });
    
    res.json({
      success: true,
      message: 'Activity completion saved successfully',
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving activity completion',
      error: error.message
    });
  }
};

// Save puzzle completion
exports.savePuzzleCompletion = async (req, res) => {
  try {
    const { userId, activityId } = req.params;
    const { puzzleData, starsEarned } = req.body;
    
    const progress = await UserActivityProgress.findOne({ userId, activityId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Activity progress not found'
      });
    }
    
    // Update puzzle completion
    progress.puzzleAnswer = {
      question: puzzleData.question,
      userAnswer: puzzleData.userAnswer,
      correctAnswer: puzzleData.correctAnswer,
      isCorrect: puzzleData.isCorrect,
      completedAt: new Date(),
      attempts: puzzleData.attempts || 1,
      hintsUsed: puzzleData.hintsUsed || 0
    };
    
    progress.sectionProgress.puzzleCompleted = true;
    progress.starsEarned += starsEarned;
    progress.totalScore += puzzleData.isCorrect ? 100 : 0;
    progress.currentSection = 'complete';
    progress.status = 'completed';
    progress.completedAt = new Date();
    progress.updatedAt = new Date();
    
    // Award badges
    if (puzzleData.isCorrect) {
      progress.badgesEarned.push({
        name: 'Circuit Master',
        description: 'Successfully completed all circuit challenges',
        earnedAt: new Date()
      });
    }
    
    await progress.save();
    
    // Update user's total stats
    const scoreIncrement = puzzleData.isCorrect ? 100 : 0;
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        totalStars: starsEarned, 
        totalScore: scoreIncrement,
        activitiesCompleted: 1
      },
      $push: puzzleData.isCorrect ? {
        badges: {
          name: 'Circuit Master',
          earnedAt: new Date(),
          category: 'Electronics'
        }
      } : {}
    });
    
    res.json({
      success: true,
      message: 'Puzzle completion saved successfully',
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving puzzle completion',
      error: error.message
    });
  }
};

// Save user action
exports.saveUserAction = async (req, res) => {
  try {
    const { userId, activityId } = req.params;
    const { action, section, data, deviceInfo } = req.body;
    
    const userAction = new UserAction({
      userId,
      activityId,
      action,
      section,
      data,
      deviceInfo,
      sessionId: req.sessionID || 'default'
    });
    
    await userAction.save();
    
    res.json({
      success: true,
      message: 'User action saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving user action',
      error: error.message
    });
  }
};

// Get user's learning analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const analytics = await UserActivityProgress.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          completedActivities: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalScore: { $sum: '$totalScore' },
          totalStars: { $sum: '$starsEarned' },
          avgScore: { $avg: '$totalScore' },
          totalTimeSpent: { $sum: '$totalTimeSpent' }
        }
      }
    ]);
    
    const recentActions = await UserAction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: {
        analytics: analytics[0] || {},
        recentActions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics',
      error: error.message
    });
  }
};
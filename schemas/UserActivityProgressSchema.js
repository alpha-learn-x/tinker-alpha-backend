const mongoose = require('mongoose');

const circuitAnswerSchema = new mongoose.Schema({
  components: [String],
  connections: String,
  working: Boolean,
  completedAt: Date,
  timeSpent: Number, // in seconds
  attempts: Number
});

const activityAnswerSchema = new mongoose.Schema({
  activityType: String,
  questionsAnswered: Number,
  correctAnswers: Number,
  score: Number,
  timeSpent: String,
  completedAt: Date,
  answers: [{
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
  }]
});

const puzzleAnswerSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  completedAt: Date,
  attempts: Number,
  hintsUsed: Number
});

const userActivityProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  activityTitle: String,
  
  // Overall Progress
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  currentSection: {
    type: String,
    enum: ['intro', 'circuit', 'activity', 'puzzle', 'complete'],
    default: 'intro'
  },
  
  // Section Completion Status
  sectionProgress: {
    introCompleted: { type: Boolean, default: false },
    circuitCompleted: { type: Boolean, default: false },
    activityCompleted: { type: Boolean, default: false },
    puzzleCompleted: { type: Boolean, default: false }
  },
  
  // Detailed Answers
  circuitAnswers: [circuitAnswerSchema],
  activityAnswers: [activityAnswerSchema],
  puzzleAnswer: puzzleAnswerSchema,
  
  // Performance Metrics
  totalScore: {
    type: Number,
    default: 0
  },
  maxPossibleScore: {
    type: Number,
    default: 100
  },
  starsEarned: {
    type: Number,
    default: 0
  },
  maxStars: {
    type: Number,
    default: 15
  },
  
  // Time Tracking
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  totalTimeSpent: Number, // in seconds
  
  // Learning Analytics
  userActions: [{
    action: String,
    data: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Feedback and Assessment
  feedback: [{
    type: String, // 'success', 'hint', 'error'
    message: String,
    timestamp: Date
  }],
  
  // Learning Objectives Met
  learningObjectives: [{
    objective: String,
    met: Boolean,
    evidence: String
  }],
  
  // Badges Earned in this Activity
  badgesEarned: [{
    name: String,
    description: String,
    earnedAt: Date
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userActivityProgressSchema.index({ userId: 1, activityId: 1 });
userActivityProgressSchema.index({ userId: 1, status: 1 });
userActivityProgressSchema.index({ completedAt: 1 });

module.exports = mongoose.model('UserActivityProgress', userActivityProgressSchema);
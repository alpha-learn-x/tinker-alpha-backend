const mongoose = require('mongoose');

const userActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  },
  sessionId: String,
  
  action: {
    type: String,
    required: true,
    enum: [
      'SECTION_NAVIGATION',
      'CIRCUIT_COMPLETION',
      'ACTIVITY_COMPLETION',
      'PUZZLE_COMPLETION',
      'SUCCESS_FEEDBACK',
      'AUDIO_INSTRUCTION',
      '3D_CIRCUIT_VIEW',
      'SIMULATION_LOADED',
      'HINT_REQUESTED',
      'ANSWER_SUBMITTED',
      'VIDEO_PLAYED',
      'BUTTON_CLICKED'
    ]
  },
  
  section: {
    type: String,
    enum: ['intro', 'circuit', 'activity', 'puzzle', 'complete']
  },
  
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  timestamp: {
    type: Date,
    default: Date.now
  },
  
  // Device and Browser Info
  deviceInfo: {
    userAgent: String,
    platform: String,
    screenResolution: String,
    timezone: String
  }
});

userActionSchema.index({ userId: 1, timestamp: -1 });
userActionSchema.index({ activityId: 1, action: 1 });

module.exports = mongoose.model('UserAction', userActionSchema);
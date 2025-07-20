const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Engineering']
  },
  category: {
    type: String,
    required: true,
    enum: ['CircuitBuilding', 'MotorConstruction', 'ChemicalReactions', 'Programming', 'Electronics']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  maxStars: {
    type: Number,
    default: 15
  },
  maxScore: {
    type: Number,
    default: 100
  },
  sections: [{
    name: String,
    type: String, // 'video', 'simulation', 'interactive', 'puzzle'
    maxPoints: Number
  }],
  learningObjectives: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
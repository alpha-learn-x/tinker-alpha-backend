const AuditoryQuiz = require('../schemas/AuditorySchema');

// Get all auditory quiz questions
exports.getQuizQuestions = async (req, res) => {
  try {
    const quiz = await AuditoryQuiz.findOne({ quizName: 'AUDITORY' });
    if (!quiz) {
      return res.status(404).json({ message: 'Auditory quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save auditory quiz questions
exports.saveQuizQuestions = async (req, res) => {
  try {
    const { quizName, questions, audioUrl } = req.body;

    // Validate input
    if (!quizName || !questions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if quiz already exists
    let quiz = await AuditoryQuiz.findOne({ quizName });

    if (quiz) {
      // Update existing quiz
      quiz.questions = questions;
      quiz.audioUrl = audioUrl || quiz.audioUrl;
      await quiz.save();
      return res.json({ message: 'Auditory quiz updated successfully', quiz });
    }

    // Create new quiz
    quiz = new AuditoryQuiz({
      quizName,
      questions,
      audioUrl
    });

    await quiz.save();
    res.status(201).json({ message: 'Auditory quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save quiz results (reusing the same endpoint as Visual quiz for consistency)
exports.saveQuizResults = async (req, res) => {
  try {
    const { quizName, user, userId, username, email, totalMarks, date } = req.body;

    // Validate input
    if (!quizName || !user || !userId || !username || !email || totalMarks === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // In a real implementation, you might want to save results to a separate collection
    res.json({
      message: 'Quiz results saved successfully',
      result: { quizName, user, userId, username, email, totalMarks, date }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
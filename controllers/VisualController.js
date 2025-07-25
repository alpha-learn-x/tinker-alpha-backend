const VisualQuiz = require('../schemas/VisualSchema');

// Get all quiz questions
exports.getQuizQuestions = async (req, res) => {
  try {
    const quiz = await VisualQuiz.findOne({ quizName: 'VISUAL' });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save quiz questions
exports.saveQuizQuestions = async (req, res) => {
  try {
    const { quizName, questions, youtubeUrl } = req.body;
    
    // Validate input
    if (!quizName || !questions || !youtubeUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if quiz already exists
    let quiz = await VisualQuiz.findOne({ quizName });
    
    if (quiz) {
      // Update existing quiz
      quiz.questions = questions;
      quiz.youtubeUrl = youtubeUrl;
      await quiz.save();
      return res.json({ message: 'Quiz updated successfully', quiz });
    }

    // Create new quiz
    quiz = new VisualQuiz({
      quizName,
      questions,
      youtubeUrl
    });

    await quiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save quiz results
exports.saveQuizResults = async (req, res) => {
  try {
    const { quizName, user, userId, username, email, totalMarks, date } = req.body;
    
    // Validate input
    if (!quizName || !user || !userId || !username || !email || totalMarks === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // In a real implementation, you might want to save results to a separate collection
    // For this example, we'll just return a success message
    res.json({
      message: 'Quiz results saved successfully',
      result: { quizName, user, userId, username, email, totalMarks, date }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
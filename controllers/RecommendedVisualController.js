const VisualQuiz = require('../schemas/RecommendedVisualSchema');
exports.getAllVisualQuizzes = async (req, res) => {
  try {
    const quizzes = await VisualQuiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

// Save a new visual quiz
exports.saveVisualQuiz = async (req, res) => {
  try {
    const {
      question,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
      youtubeUrl,
      pauseAt
    } = req.body;

    // Validate required fields
    if (!question || !correctAnswer || !youtubeUrl || !pauseAt) {
      return res.status(400).json({ error: 'Question, correctAnswer, youtubeUrl, and pauseAt are required' });
    }

    // Create a new quiz entry
    const newQuiz = new VisualQuiz({
      question,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
      youtubeUrl,
      pauseAt
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz saved successfully', quiz: newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save quiz' });
  }
};

// Check if the selected answer is correct
exports.checkVisualAnswer = async (req, res) => {
  try {
    const { quizId, selectedAnswer } = req.body;

    // Validate required fields
    if (!quizId || !selectedAnswer) {
      return res.status(400).json({ error: 'quizId and selectedAnswer are required' });
    }

    const quiz = await VisualQuiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const isCorrect = quiz.correctAnswer === selectedAnswer;

    res.status(200).json({ correct: isCorrect });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check answer' });
  }
};
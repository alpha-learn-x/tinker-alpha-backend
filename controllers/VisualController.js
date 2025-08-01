const VisualQuiz = require('../schemas/VisualSchema');

exports.getAllVisualQuizzes = async (req, res) => {
  try {
    const quizzes = await VisualQuiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

exports.saveVisualQuiz = async (req, res) => {
  try {
    const {
      question,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer
    } = req.body;

    if (!question || !correctAnswer) {
      return res.status(400).json({ error: 'Question and correctAnswer are required' });
    }

    const newQuiz = new VisualQuiz({
      question,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz saved successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save quiz' });
  }
};

exports.checkVisualAnswer = async (req, res) => {
  try {
    const { quizId, selectedAnswer } = req.body;

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
    res.status(500).json({ error: 'Failed to check answer' });
  }
};

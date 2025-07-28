// Controller
const ReadWriteQuiz = require('../schemas/ReadAndWriteSchema');

// Get all read-write quiz questions
exports.getQuizQuestions = async (req, res) => {
    try {
        const quiz = await ReadWriteQuiz.findOne({ quizName: 'READWRITE' });
        if (!quiz) {
            return res.status(404).json({ message: 'Read Write quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Save read-write quiz questions
exports.saveQuizQuestions = async (req, res) => {
    try {
        const { quizName, questions } = req.body;

        // Validate input
        if (!quizName || !questions) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if quiz already exists
        let quiz = await ReadWriteQuiz.findOne({ quizName });

        if (quiz) {
            // Update existing quiz
            quiz.questions = questions;
            await quiz.save();
            return res.json({ message: 'Read Write quiz updated successfully', quiz });
        }

        // Create new quiz
        quiz = new ReadWriteQuiz({
            quizName,
            questions
        });

        await quiz.save();
        res.status(201).json({ message: 'Read Write quiz created successfully', quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller
const ReadWriteQuiz = require('../schemas/RecommendedReadAndWriteSchema');

// Get all read-write quiz questions
exports.getQuizQuestions = async (req, res) => {
    try {
        const quiz = await ReadWriteQuiz.find({ quizName: 'RECREADWRITE' });
        if (!quiz) {
            return res.status(404).json({ message: 'Read Write quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.saveQuizQuestions = async (req, res) => {
    try {
        const { quizName, questions } = req.body;

        if (!quizName || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Missing or invalid fields' });
        }

        const validatedQuestions = questions.filter(q =>
            q.id && q.scenario && q.steps?.length === 5 && q.correctOrder?.length === 5
        );

        if (validatedQuestions.length !== questions.length) {
            return res.status(400).json({ message: 'Some questions are invalid' });
        }

        // Always create a new record
        const quiz = new ReadWriteQuiz({
            quizName,
            questions: validatedQuestions,
            createdAt: new Date() // Add timestamp if needed
        });

        await quiz.save();
        res.status(201).json({ message: 'Read Write quiz saved', quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


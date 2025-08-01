const VisualQuiz = require('../schemas/RecommendedVisualSchema');

// Get all quiz tasks
exports.getQuizQuestions = async (req, res) => {
    try {
        const quiz = await VisualQuiz.findOne({ quizName: 'RECVISUAL' });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Save quiz tasks
exports.saveQuizQuestions = async (req, res) => {
    try {
        const { quizName, tasks } = req.body;

        if (!quizName || !tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ message: 'Missing or invalid required fields' });
        }

        let quiz = await VisualQuiz.findOne({ quizName });

        if (quiz) {
            quiz.tasks = tasks;
            await quiz.save();
            return res.json({ message: 'Quiz updated successfully', quiz });
        }

        quiz = new VisualQuiz({
            quizName,
            tasks
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

        if (!quizName || !user || !userId || !username || !email || totalMarks === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        res.json({
            message: 'Quiz results saved successfully',
            result: { quizName, user, userId, username, email, totalMarks, date }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

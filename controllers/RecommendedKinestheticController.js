// backend/controllers/KinestheticController.js
const KinestheticQuiz = require('../schemas/RecommendedKinestheticSchema');

// Get all kinesthetic quiz tasks
exports.getQuizTasks = async (req, res) => {
    try {
        const quiz = await KinestheticQuiz.find({ quizName: 'RECKINESTHETIC' });
        if (!quiz || quiz.length === 0) {
            return res.status(404).json({ message: 'Kinesthetic quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Save kinesthetic quiz tasks
exports.saveQuizTasks = async (req, res) => {
    try {
        const { quizName, tasks } = req.body;

        if (!quizName || !Array.isArray(tasks)) {
            return res.status(400).json({ message: 'Missing or invalid fields' });
        }

        // Validate tasks
        const validatedTasks = tasks.filter(t =>
            t.id &&
            t.images?.length === 5 &&
            t.options?.length === 5 &&
            t.correctAnswers &&
            typeof t.correctAnswers === 'object' &&
            Object.keys(t.correctAnswers).length === 5
        );

        if (validatedTasks.length !== tasks.length) {
            return res.status(400).json({ message: 'Some tasks are invalid' });
        }

        // Always create a new record
        const quiz = new KinestheticQuiz({
            quizName,
            tasks: validatedTasks,
            createdAt: new Date()
        });

        await quiz.save();
        res.status(201).json({ message: 'Kinesthetic quiz saved', quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Save quiz results (for compatibility with frontend)
exports.saveQuizResults = async (req, res) => {
    try {
        const {
            quizName,
            user,
            userId,
            username,
            email,
            totalMarks,
            totalTime,
            date,
            taskResults
        } = req.body;

        if (!quizName || !user || !userId || !username || !email || totalMarks === undefined || totalTime === undefined || !date || !Array.isArray(taskResults)) {
            return res.status(400).json({ message: 'Missing or invalid fields' });
        }

        const quizResult = new KinestheticQuiz({
            quizName,
            user,
            userId,
            username,
            email,
            totalMarks,
            totalTime,
            date: new Date(date),
            taskResults
        });

        await quizResult.save();
        res.status(201).json({ message: 'Quiz results saved successfully', data: quizResult });
    } catch (error) {
        res.status(500).json({ message: 'Server error while saving quiz results', error: error.message });
    }
};

// Get quiz results for a user
exports.getUserQuizResults = async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await KinestheticQuiz.find({ userId, quizName: 'RECKINESTHETIC' }).sort({ date: -1 });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching quiz results', error: error.message });
    }
};
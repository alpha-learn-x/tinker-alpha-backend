const QuizResult = require('../schemas/QuizResultsSchema');

// Save a new quiz result
exports.saveQuizResult = async (req, res) => {
    try {
        const {
            user,
            userId,
            quizName,
            username,
            email,
            totalMarks,
            participatedQuestions,
            totalTime,
            date,
        } = req.body;

        if (
            !user ||
            !userId ||
            !quizName ||
            !username ||
            !email ||
            totalMarks === undefined ||
            participatedQuestions === undefined
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newResult = new QuizResult({
            user,
            userId,
            quizName,
            username,
            email,
            totalMarks,
            participatedQuestions,
            totalTime,
            date,
        });

        const savedResult = await newResult.save();
        res.status(201).json(savedResult);
    } catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
};

// Get all quiz results
exports.getAllQuizResults = async (req, res) => {
    try {
        const results = await QuizResult.find().sort({ date: -1 });
        res.json(results);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ error: 'Failed to get quiz results' });
    }
};

// Get quiz results by userId
exports.getQuizResultsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await QuizResult.find({ userId }).sort({ date: -1 });
        res.json(results);
    } catch (error) {
        console.error('Error fetching user quiz results:', error);
        res.status(500).json({ error: 'Failed to get user quiz results' });
    }
};

exports.getQuizResultsByUserAndQuizName = async (req, res) => {
    try {
        const { userId, quizName } = req.params;
        const results = await QuizResult.find({ userId, quizName }).sort({ date: -1 });
        res.json(results);
    } catch (error) {
        console.error('Error fetching quiz results by user and quiz:', error);
        res.status(500).json({ error: 'Failed to get quiz results by user and quiz' });
    }
};

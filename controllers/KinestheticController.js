const KinestheticQuiz = require('../schemas/KinestheticSchema');

exports.getAllKinestheticQuizzes = async (req, res) => {
    try {
        const quizzes = await KinestheticQuiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
};

exports.saveKinestheticQuiz = async (req, res) => {
    try {
        const { question, matchItems, correctPairs } = req.body;

        if (!question || !matchItems || !correctPairs) {
            return res.status(400).json({ error: 'question, matchItems, and correctPairs are required' });
        }

        const newQuiz = new KinestheticQuiz({
            question,
            matchItems,
            correctPairs
        });

        await newQuiz.save();
        res.status(201).json({ message: 'Quiz saved successfully', quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save quiz' });
    }
};

exports.checkKinestheticAnswer = async (req, res) => {
    try {
        const { quizId, userPairs } = req.body;

        if (!quizId || !userPairs) {
            return res.status(400).json({ error: 'quizId and userPairs are required' });
        }

        const quiz = await KinestheticQuiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const correctPairs = quiz.correctPairs;
        const isCorrect = Object.entries(userPairs).every(
            ([key, value]) => correctPairs.get(key) === value
        );

        res.status(200).json({ correct: isCorrect });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check answer' });
    }
};

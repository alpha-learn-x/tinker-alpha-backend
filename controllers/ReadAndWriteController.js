const ReadWriteQuiz = require('../schemas/ReadAndWriteSchema');

exports.getAllReadWriteQuizzes = async (req, res) => {
    try {
        const quizzes = await ReadWriteQuiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch quizzes'});
    }
};

exports.saveReadWriteQuiz = async (req, res) => {
    try {
        const {
            question,
            answer1,
            answer2,
            answer3,
            answer4,
            correctAnswerOrder
        } = req.body;

        if (!question || !correctAnswerOrder) {
            return res.status(400).json({error: 'Question and correctAnswerOrder are required'});
        }

        const newQuiz = new ReadWriteQuiz({
            question,
            answer1Id: 1,
            answer1,
            answer2Id: 2,
            answer2,
            answer3Id: 3,
            answer3,
            answer4Id: 4,
            answer4,
            correctAnswerOrder
        });
        await newQuiz.save();
        res.status(201).json({message: 'Quiz saved successfully', quiz: newQuiz});
    } catch (error) {
        res.status(500).json({error: 'Failed to save quiz'});
    }
};

exports.checkReadWriteAnswer = async (req, res) => {
    try {
        const { quizId, selectedOrder } = req.body;

        if (!quizId || !selectedOrder) {
            return res.status(400).json({ error: 'quizId and selectedOrder are required' });
        }

        const quiz = await ReadWriteQuiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const correctOrder = quiz.correctAnswerOrder?.trim();
        const submittedOrder = selectedOrder?.trim();

        const isCorrect = correctOrder === submittedOrder;

        res.status(200).json({ correct: isCorrect });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check answer' });
    }
};

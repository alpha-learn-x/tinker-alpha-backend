const KinestheticQuiz = require('../schemas/RecommendedKinestheticSchema');

exports.getAllKinestheticQuizzes = async (req, res) => {
    try {
        const quizzes = await KinestheticQuiz.find();
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ error: 'No quizzes found' });
        }
        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
};

exports.saveKinestheticQuiz = async (req, res) => {
    try {
        const { question, matchItems, correctPairs, quizName = 'KINESTHETIC' } = req.body;

        if (!question || !matchItems || !correctPairs) {
            return res.status(400).json({ error: 'question, matchItems, and correctPairs are required' });
        }

        const newQuiz = new KinestheticQuiz({
            quizName,
            question,
            matchItems,
            correctPairs: new Map(Object.entries(correctPairs)), // Convert object to Map
        });

        await newQuiz.save();
        res.status(201).json({ message: 'Quiz saved successfully', quiz: newQuiz });
    } catch (error) {
        console.error('Error saving quiz:', error);
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

        const correctPairs = quiz.correctPairs; // Mongoose Map
        let isCorrect = true;
        const correctPairsObj = Object.fromEntries(correctPairs); // Convert Map to object for comparison

        // Check if all required keys are present and match
        for (const [sound, correctItemId] of Object.entries(correctPairsObj)) {
            const userItemId = userPairs[sound];

            // Handle "No answer" cases
            if (correctItemId === 'No answer' || !correctItemId) {
                if (userItemId !== 'No answer' && userItemId) {
                    isCorrect = false;
                    break;
                }
            } else if (userItemId !== correctItemId) {
                // Check if user dropped an item whose text matches the sound (for flexibility)
                const item = quiz.matchItems.find(i => i.id === userItemId);
                if (!item || item.text.toLowerCase() !== sound.toLowerCase()) {
                    isCorrect = false;
                    break;
                }
            }
        }

        // Ensure all user answers correspond to valid sounds
        for (const sound of Object.keys(userPairs)) {
            if (!correctPairsObj.hasOwnProperty(sound)) {
                isCorrect = false;
                break;
            }
        }

        res.status(200).json({ correct: isCorrect });
    } catch (error) {
        console.error('Error checking answer:', error);
        res.status(500).json({ error: 'Failed to check answer' });
    }
};
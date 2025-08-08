const QuizResult = require('../schemas/RecommendedQuizResultsSchema');

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

// Get quiz results by userId and quizName
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
// Get question type percentages for all users
exports.getUserQuestionTypePercentages = async (req, res) => {
    try {
        const results = await QuizResult.aggregate([
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        username: "$username",
                        email: "$email",
                        quizName: "$quizName"
                    },
                    totalParticipated: { $sum: "$participatedQuestions" },
                    totalMarks: { $sum: "$totalMarks" }
                }
            },
            {
                $match: {
                    "_id.quizName": { $in: ["AUDITORY", "KINESTHETIC", "VISUAL", "READWRITE"] }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id.userId",
                    username: "$_id.username",
                    email: "$_id.email",
                    result: {
                        $cond: [
                            { $eq: ["$totalParticipated", 0] },
                            "0.0%",
                            {
                                $concat: [
                                    "$_id.quizName",
                                    " ",
                                    {
                                        $toString: {
                                            $round: [
                                                {
                                                    $multiply: [
                                                        { $divide: ["$totalMarks", "$totalParticipated"] },
                                                        100
                                                    ]
                                                },
                                                1
                                            ]
                                        }
                                    },
                                    "%"
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        username: "$username",
                        email: "$email"
                    },
                    results: { $push: "$result" }
                }
            },
            {
                $project: {
                    userId: "$_id.userId",
                    username: "$_id.username",
                    email: "$_id.email",
                    results: 1,
                    _id: 0
                }
            }
        ]);

        res.json(results);
    } catch (error) {
        console.error('Error calculating question type percentages:', error);
        res.status(500).json({ error: 'Failed to calculate question type percentages' });
    }
};
// Get question type percentages for the logged-in user
exports.getLoggedInUserQuestionTypePercentages = async (req, res) => {
    try {
        const userId = req.user.userId; // Assumes userId is available from auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const results = await QuizResult.aggregate([
            // Match results for the logged-in user
            {
                $match: {
                    userId: userId,
                    quizName: { $in: ["AUDITORY", "KINESTHETIC", "VISUAL", "READWRITE"] }
                }
            },
            // Group by quizName to sum participatedQuestions and totalMarks
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        username: "$username",
                        email: "$email",
                        quizName: "$quizName"
                    },
                    totalParticipated: { $sum: "$participatedQuestions" },
                    totalMarks: { $sum: "$totalMarks" }
                }
            },
            // Calculate percentage and format output
            {
                $project: {
                    _id: 0,
                    userId: "$_id.userId",
                    username: "$_id.username",
                    email: "$_id.email",
                    result: {
                        $cond: [
                            { $eq: ["$totalParticipated", 0] },
                            "0.0%",
                            {
                                $concat: [
                                    "$_id.quizName",
                                    " ",
                                    {
                                        $toString: {
                                            $round: [
                                                {
                                                    $multiply: [
                                                        { $divide: ["$totalMarks", "$totalParticipated"] },
                                                        100
                                                    ]
                                                },
                                                1
                                            ]
                                        }
                                    },
                                    "%"
                                ]
                            }
                        ]
                    }
                }
            },
            // Collect all formatted results
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        username: "$username",
                        email: "$email"
                    },
                    results: { $push: "$result" }
                }
            },
            // Project final output format
            {
                $project: {
                    userId: "$_id.userId",
                    username: "$_id.username",
                    email: "$_id.email",
                    results: 1,
                    _id: 0
                }
            }
        ]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'No quiz results found for this user' });
        }

        res.json(results[0]); // Return single user object
    } catch (error) {
        console.error('Error calculating logged-in user question type percentages:', error);
        res.status(500).json({ error: 'Failed to calculate question type percentages' });
    }
};
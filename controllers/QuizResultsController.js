const QuizResult = require('../schemas/QuizResultsSchema');
const User = require('../schemas/UserSchema');

exports.saveQuizResults = async (req, res) => {
    try {
        const { 
            user, 
            userId, 
            username, 
            email, 
            totalMarks, 
            totalTime, 
            taskResults, 
            date, 
            quizName 
        } = req.body;

        // Validate required fields
        if (!user || !userId || !username || !email || !quizName || totalMarks === undefined) {
            console.log('Missing required fields:', { 
                user: !!user, 
                userId: !!userId, 
                username: !!username, 
                email: !!email, 
                totalMarks: totalMarks !== undefined, 
                quizName: !!quizName 
            });
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Validate date
        const parsedDate = date ? new Date(date) : new Date();
        if (isNaN(parsedDate)) {
            console.log('Invalid date:', date);
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Check if the user exists in the User collection using the provided user (_id)
        const existingUser = await User.findById(user);
        if (!existingUser) {
            console.log('User not found:', user);
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate taskResults if provided (for kinesthetic quiz)
        if (taskResults && Array.isArray(taskResults)) {
            for (let i = 0; i < taskResults.length; i++) {
                const task = taskResults[i];
                if (typeof task.taskId !== 'number' || 
                    typeof task.timeTaken !== 'number' || 
                    typeof task.marks !== 'number') {
                    console.log('Invalid task result format at index:', i, task);
                    return res.status(400).json({ 
                        message: `Invalid task result format at index ${i}. Expected taskId, timeTaken, and marks as numbers.` 
                    });
                }
            }
        }

        // Create new quiz result
        const quizResultData = {
            quizName,
            user,
            userId,
            username,
            email,
            totalMarks,
            date: parsedDate
        };

        // Add optional fields if they exist
        if (totalTime !== undefined && typeof totalTime === 'number') {
            quizResultData.totalTime = totalTime;
        }

        if (taskResults && Array.isArray(taskResults) && taskResults.length > 0) {
            quizResultData.taskResults = taskResults;
        }

        const quizResult = new QuizResult(quizResultData);

        const savedResult = await quizResult.save();
        console.log('Quiz result saved successfully:', {
            id: savedResult._id,
            quizName: savedResult.quizName,
            username: savedResult.username,
            totalMarks: savedResult.totalMarks,
            totalTime: savedResult.totalTime,
            taskCount: savedResult.taskResults ? savedResult.taskResults.length : 0
        });

        res.status(201).json({ 
            message: 'Quiz results saved successfully', 
            data: savedResult 
        });
    } catch (error) {
        console.error('Error saving quiz results:', error);
        res.status(500).json({ 
            message: 'Server error while saving quiz results', 
            error: error.message 
        });
    }
};

exports.getAllQuizResults = async (req, res) => {
    try {
        const { searchText, quizName } = req.query;

        // Build query object
        const query = {};
        
        if (searchText) {
            query.username = { $regex: searchText, $options: 'i' }; // Case-insensitive search
        }

        if (quizName) {
            query.quizName = { $regex: quizName, $options: 'i' }; // Case-insensitive search for quiz name
        }

        // Fetch all quiz results, optionally filtered, sorted by date descending
        const quizResults = await QuizResult.find(query)
            .sort({ date: -1 })
            .lean();

        if (!quizResults || quizResults.length === 0) {
            console.log('No quiz results found for query:', query);
            return res.status(404).json({ message: 'No quiz results found' });
        }

        console.log(`Found ${quizResults.length} quiz results`);
        res.status(200).json({
            message: 'Quiz results retrieved successfully',
            data: quizResults,
            count: quizResults.length
        });
    } catch (error) {
        console.error('Error retrieving quiz results:', error);
        res.status(500).json({ 
            message: 'Server error while retrieving quiz results', 
            error: error.message 
        });
    }
};

exports.getQuizResultsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { quizName } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Build query object
        const query = { userId };
        
        if (quizName) {
            query.quizName = { $regex: quizName, $options: 'i' };
        }

        const quizResults = await QuizResult.find(query)
            .sort({ date: -1 })
            .lean();

        console.log(`Found ${quizResults.length} quiz results for user ${userId}`);
        res.status(200).json({
            message: 'User quiz results retrieved successfully',
            data: quizResults,
            count: quizResults.length
        });
    } catch (error) {
        console.error('Error retrieving user quiz results:', error);
        res.status(500).json({ 
            message: 'Server error while retrieving user quiz results', 
            error: error.message 
        });
    }
};

exports.getQuizStats = async (req, res) => {
    try {
        const { quizName } = req.query;
        
        const matchStage = quizName ? { quizName: { $regex: quizName, $options: 'i' } } : {};

        const stats = await QuizResult.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$quizName",
                    totalAttempts: { $sum: 1 },
                    averageMarks: { $avg: "$totalMarks" },
                    maxMarks: { $max: "$totalMarks" },
                    minMarks: { $min: "$totalMarks" },
                    averageTime: { $avg: "$totalTime" },
                    uniqueUsers: { $addToSet: "$userId" }
                }
            },
            {
                $project: {
                    quizName: "$_id",
                    totalAttempts: 1,
                    averageMarks: { $round: ["$averageMarks", 2] },
                    maxMarks: 1,
                    minMarks: 1,
                    averageTime: { $round: ["$averageTime", 0] },
                    uniqueUserCount: { $size: "$uniqueUsers" },
                    _id: 0
                }
            },
            { $sort: { quizName: 1 } }
        ]);

        res.status(200).json({
            message: 'Quiz statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        console.error('Error retrieving quiz statistics:', error);
        res.status(500).json({ 
            message: 'Server error while retrieving quiz statistics', 
            error: error.message 
        });
    }
};
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

exports.getStudentQuizTotals = async (req, res) => {
    try {
        // Define the quiz types to filter
        const quizTypes = ['KINESTHETIC', 'AUDITORY', 'READWRITE', 'VISUAL'];

        // Fetch all students (non-teachers) from the User collection
        const students = await User.find({ role: { $ne: 'TEACHER' } }, '_id userId username').lean();
        if (!students || students.length === 0) {
            console.log('No students found');
            return res.status(404).json({ message: 'No students found' });
        }

        // Aggregate quiz results for students and specified quiz types
        const quizTotals = await QuizResult.aggregate([
            {
                // Filter by quiz types
                $match: {
                    quizName: { $in: quizTypes },
                    user: { $in: students.map(student => student._id) }
                }
            },
            {
                // Group by userId, username, and quizName to sum totalMarks
                $group: {
                    _id: {
                        userId: '$userId',
                        username: '$username',
                        quizName: '$quizName'
                    },
                    totalMarks: { $sum: '$totalMarks' }
                }
            },
            {
                // Pivot the data to create fields for each quiz type
                $group: {
                    _id: {
                        userId: '$_id.userId',
                        username: '$_id.username'
                    },
                    marks: {
                        $push: {
                            k: '$_id.quizName',
                            v: '$totalMarks'
                        }
                    }
                }
            },
            {
                // Transform the marks array into an object with quiz type fields
                $project: {
                    userId: '$_id.userId',
                    username: '$_id.username',
                    KINESTHETIC: {
                        $cond: [
                            { $in: ['KINESTHETIC', '$marks.k'] },
                            { $arrayElemAt: ['$marks.v', { $indexOfArray: ['$marks.k', 'KINESTHETIC'] }] },
                            0
                        ]
                    },
                    AUDITORY: {
                        $cond: [
                            { $in: ['AUDITORY', '$marks.k'] },
                            { $arrayElemAt: ['$marks.v', { $indexOfArray: ['$marks.k', 'AUDITORY'] }] },
                            0
                        ]
                    },
                    READWRITE: {
                        $cond: [
                            { $in: ['READWRITE', '$marks.k'] },
                            { $arrayElemAt: ['$marks.v', { $indexOfArray: ['$marks.k', 'READWRITE'] }] },
                            0
                        ]
                    },
                    VISUAL: {
                        $cond: [
                            { $in: ['VISUAL', '$marks.k'] },
                            { $arrayElemAt: ['$marks.v', { $indexOfArray: ['$marks.k', 'VISUAL'] }] },
                            0
                        ]
                    },
                    _id: 0
                }
            },
            { $sort: { username: 1 } } // Sort by username for consistent output
        ]);

        console.log(`Found quiz totals for ${quizTotals.length} students`);
        res.status(200).json({
            message: 'Student quiz totals retrieved successfully',
            data: quizTotals,
            count: quizTotals.length
        });
    } catch (error) {
        console.error('Error retrieving student quiz totals:', error);
        res.status(500).json({
            message: 'Server error while retrieving student quiz totals',
            error: error.message
        });
    }
};

const TOTAL_POSSIBLE_MARKS = {
    KINESTHETIC: 100, // e.g., 10 questions * 10 marks each
    AUDITORY: 100,
    READWRITE: 100,
    VISUAL: 100
};

exports.getLoggedInUserQuizTotals = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            console.log('No authenticated user found');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const userId = req.user._id;

        const user = await User.findById(userId).lean(); // Get all fields to see what's available
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Debug: Check what fields are actually available
        console.log('Complete User object:', user);

        if (user.role === 'TEACHER') {
            console.log('User is a teacher:', userId);
            return res.status(403).json({ message: 'This endpoint is for students only' });
        }

        const quizTypes = ['KINESTHETIC', 'AUDITORY', 'READWRITE', 'VISUAL'];

        // Get aggregated results for each quiz type
        const quizResults = await QuizResult.aggregate([
            {
                $match: {
                    user: user._id,
                    quizName: { $in: quizTypes }
                }
            },
            {
                $group: {
                    _id: '$quizName',
                    totalMarks: { $sum: '$totalMarks' },
                    maxMarks: {
                        $sum: {
                            $ifNull: [
                                '$maxMarks',
                                { $ifNull: ['$totalQuestions', { $ifNull: ['$maxScore', 1] }] }
                            ]
                        }
                    },
                    questionCount: { $sum: 1 },
                    // Debug fields
                    sampleDoc: { $first: '$ROOT' }
                }
            }
        ]);

        // Initialize result with default values - fix user field names
        const result = {
            userId: user.userId || user._id,
            username: user.username || user.name || user.firstName || user.email?.split('@')[0] || 'Unknown',
            KINESTHETIC: { totalMarks: 0, maxMarks: 0, questionCount: 0, percentage: 0 },
            AUDITORY: { totalMarks: 0, maxMarks: 0, questionCount: 0, percentage: 0 },
            READWRITE: { totalMarks: 0, maxMarks: 0, questionCount: 0, percentage: 0 },
            VISUAL: { totalMarks: 0, maxMarks: 0, questionCount: 0, percentage: 0 }
        };

        console.log('Quiz aggregation results:', quizResults);

        // Process each quiz type result
        quizResults.forEach(quiz => {
            console.log(`Sample document for ${quiz._id}:`, quiz.sampleDoc);

            const quizType = quiz._id;

            // Calculate percentage with proper limits
            let percentage = 0;
            if (quiz.maxMarks > 0) {
                percentage = Math.min(100, Math.round((quiz.totalMarks / quiz.maxMarks) * 100 * 100) / 100);
            } else {
                // If no maxMarks, assume reasonable scoring (e.g., 10 points per question max)
                const assumedMaxPerQuestion = 10;
                const estimatedMaxMarks = quiz.questionCount * assumedMaxPerQuestion;
                percentage = Math.min(100, Math.round((quiz.totalMarks / estimatedMaxMarks) * 100 * 100) / 100);
                console.log(`${quizType}: No maxMarks found, using estimated max of ${estimatedMaxMarks} (${assumedMaxPerQuestion} per question)`);
            }

            result[quizType] = {
                totalMarks: quiz.totalMarks,
                maxMarks: quiz.maxMarks || quiz.questionCount * 10, // Show estimated maxMarks
                questionCount: quiz.questionCount,
                percentage: percentage
            };

            console.log(`${quizType}: totalMarks=${quiz.totalMarks}, maxMarks=${quiz.maxMarks}, questionCount=${quiz.questionCount}, percentage=${percentage}`);
        });

        console.log(`Quiz totals retrieved for user ${user.userId}:`, result);
        res.status(200).json({
            message: 'Logged-in user quiz totals retrieved successfully',
            data: result
        });
    } catch (error) {
        console.error('Error retrieving logged-in user quiz totals:', error);
        res.status(500).json({
            message: 'Server error while retrieving logged-in user quiz totals',
            error: error.message
        });
    }
};
const QuizResult = require('../schemas/QuizResultsSchema');
const User = require('../schemas/UserSchema');

exports.saveQuizResults = async (req, res) => {
    try {
        const { user, userId, username, email, totalMarks, date, quizName } = req.body;

        // Validate required fields
        if (!user || !userId || !username || !email || !quizName || totalMarks === undefined) {
            console.log('Missing fields:', { user, userId, username, email, totalMarks, quizName });
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate date
        const parsedDate = new Date(date);
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

        // Create new quiz result
        const quizResult = new QuizResult({
            quizName,
            user,
            userId,
            username,
            email,
            totalMarks,
            date: parsedDate
        });

        const savedResult = await quizResult.save();
        console.log('Quiz result saved:', savedResult);
        res.status(201).json({ message: 'Quiz results saved successfully', data: savedResult });
    } catch (error) {
        console.error('Error saving quiz results:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllQuizResults = async (req, res) => {
    try {
        const { searchText } = req.query;

        // Build query object
        const query = {};
        if (searchText) {
            query.username = { $regex: searchText, $options: 'i' }; // Case-insensitive search
        }

        // Fetch all quiz results, optionally filtered by username, sorted by date descending
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
            data: quizResults
        });
    } catch (error) {
        console.error('Error retrieving quiz results:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
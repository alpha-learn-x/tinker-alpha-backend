const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/UserSchema');
const { validationResult } = require('express-validator');
const ENUMS = require('../enums/UserRole');

const initializeTeacher = async () => {
    try {
        const teacherExists = await User.findOne({ role: 'TEACHER' });
        if (teacherExists) {
            return { success: false, message: 'Teacher already exists' };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('defaultTeacherPassword123', salt);
        const role = ENUMS.ROLES.TEACHER;

        const teacher = new User({
            email: 'teacher@example.com',
            userName: 'DefaultTeacher',
            password: hashedPassword,
            id: "TEACHER001",
            age: 30,
            role: role
        });

        await teacher.save();
        return { success: true, message: 'Default teacher created successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to initialize teacher', error: error.message };
    }
};

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, userName, password,id,age } = req.body;

        const role = ENUMS.ROLES.STUDENT;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            userName,
            password: hashedPassword,
            id,
            age,
            role
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                userName: user.userName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id, password } = req.body;

        const user = await User.findOne({ id });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                userId: user.id,
                email: user.email,
                userName: user.userName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { register, login, initializeTeacher };
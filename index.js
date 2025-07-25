const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.SERVER_PORT || 5000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

const UserRoute = require('./routes/UserRoute');
const ActivityRoute = require('./routes/ActivityRoute');
const QuizResultRoutes = require('./routes/QuizRoutes');
const VisualRoutes = require('./routes/VisualRoutes');
const AuditoryRoutes = require('./routes/AuditoryRoutes');
const DragAndDropRoutes = require('./routes/DragAndDropRoute');
const UserController = require('./controllers/UserController');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'Authorization');
    next();
});

mongoose.connect(DB_CONNECTION_STRING)
    .then(async () => {
        try {
            await UserController.initializeTeacher();
        } catch (error) {
            console.error("Failed to initialize admin, but continuing startup:", error);
        }
        app.listen(PORT, () => {
            console.log(`API started and running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("Failed to connect to MongoDB:", error);
    });

app.use('/api/v1/users', UserRoute);
app.use('/api/v1/activities', ActivityRoute);
app.use('/api/v1/quizzes', QuizResultRoutes);
app.use('/api/v1/quizzes/visual', VisualRoutes);
app.use('/api/v1/quizzes/auditory', AuditoryRoutes);
app.use('/api/v1/quizzes/draganddrop', DragAndDropRoutes);

module.exports = app;
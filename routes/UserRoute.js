const express = require('express');
const router = express.Router();
const {register, login, getAllStudents} = require('../controllers/UserController');

router.post('/register', register);
router.post('/login', login);
router.get('/get-all-students', getAllStudents);


module.exports = router;
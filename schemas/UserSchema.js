const mongoose = require('mongoose');
const ENUMS = require('../enums/UserRole');
const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    userName: {type: String},
    password: {type: String, required: true, minLength: 6},
    id: {type: String},
    age: {type: Number},
    role: {type: String, required: true, enum: ENUMS.ROLES},
}, {timestamps: true});

module.exports = mongoose.model('Users', UserSchema);
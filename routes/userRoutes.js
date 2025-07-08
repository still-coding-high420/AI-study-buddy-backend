const express = require('express');
const router = express.Router();
const {registerUser, loginUser,} = require('../controllers/userController');

// POST /api/users
router.post('/', registerUser);

// POST /api/users/login
router.post('/login', loginUser); // <-- This is our new route

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../../shared/middleware/auth');

// Render login page
router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;                                               
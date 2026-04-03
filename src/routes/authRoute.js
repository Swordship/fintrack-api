const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../schema/authSchema');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Logged out successfully. Please discard your token on the client side.',
  });
});

module.exports = router;
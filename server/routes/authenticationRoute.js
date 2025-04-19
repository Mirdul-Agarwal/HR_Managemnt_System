const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authenticationUser');

const { protect } = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  registerClient,
  registerAdmin,
  loginClient,
  loginAdmin,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Client routes
router.post('/client/register', registerClient);
router.post('/client/login', loginClient);

// Admin routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// Protected routes (for both CLIENT and ADMIN)
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des utilisateurs', 
      error: error.message 
    });
  }
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'utilisateur', 
      error: error.message 
    });
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await user.deleteOne();
      res.json({ message: 'Utilisateur supprimé' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'utilisateur', 
      error: error.message 
    });
  }
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put('/:id/role', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du rôle', 
      error: error.message 
    });
  }
});

module.exports = router;

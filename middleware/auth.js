const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and attach to request
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      return next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ message: 'Token invalide' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Pas de token, accès refusé' });
  }
};

// Middleware to check if user has specific role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès refusé. Rôle requis: ${roles.join(' ou ')}` 
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé. Administrateur requis.' });
  }

  next();
};

// Middleware to check if user is client
const isClient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  if (req.user.role !== 'CLIENT') {
    return res.status(403).json({ message: 'Accès refusé. Client requis.' });
  }

  next();
};

module.exports = { protect, authorize, isAdmin, isClient };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔒 Vérifie le token
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "Utilisateur introuvable" });

    next(); // ✔ ici ok

  } catch (e) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

// 🔓 Vérifie le rôle Admin
const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Non authentifié" });
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Accès refusé — Admin uniquement" });

  next(); // ✔ ok
};

// 🔓 Vérifie Client
const isClient = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Non authentifié" });
  if (req.user.role !== "CLIENT")
    return res.status(403).json({ message: "Accès refusé — Client uniquement" });

  next(); // ✔ ok
};

module.exports = { protect, isAdmin, isClient };

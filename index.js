require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require('./config/db');
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Une erreur est survenue', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

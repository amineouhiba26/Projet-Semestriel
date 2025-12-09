require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================== DB =====================
const connectDB = require('./config/db');
connectDB();

// ================== ROUTES ====================
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// 🆕 MAINTENANCE
const maintenanceRoutes = require('./routes/maintenanceRoutes');

// =============== USE ROUTES ===================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reservations', reservationRoutes);

// 🆕 MAINTENANCE ENDPOINT
app.use('/api/maintenance', maintenanceRoutes);

// ================= HEALTH CHECK ===============
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============= GLOBAL ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Une erreur est survenue', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// ================== RUN SERVER ================
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

// ============ MIDDLEWARE GLOBAL ============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ DATABASE ============
const connectDB = require('./config/db');
connectDB();

// ============ ROUTES IMPORTS ============
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const contractRoutes = require('./routes/contractRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // 🆕 PAIEMENT

// ============ ROUTES MOUNT ============
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes); // 🆕

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============ GLOBAL ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============ SERVER START ============
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

module.exports = app;

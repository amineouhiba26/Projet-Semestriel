const express = require("express");
const router = express.Router();
const { createPayment, getPayments, getPaymentByContract } = require("../controllers/paymentController");
const { protect, isAdmin } = require("../middleware/auth");

// ADMIN - enregistrer un paiement
router.post("/", protect, isAdmin, createPayment);

// ADMIN - tous les paiements
router.get("/", protect, isAdmin, getPayments);

// ADMIN - paiement d'un contrat
router.get("/contract/:contractId", protect, isAdmin, getPaymentByContract);

module.exports = router;

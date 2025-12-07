const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservationStatus,
} = require("../controllers/reservationController");

const { protect, isAdmin, isClient } = require("../middleware/auth");

// CLIENT : créer une réservation
router.post("/", protect, isClient, createReservation);

// CLIENT : voir MES réservations
router.get("/my", protect, isClient, getMyReservations);

// CLIENT : annuler une de MES réservations
router.delete("/:id", protect, isClient, cancelReservation);

// ADMIN : voir toutes les réservations
router.get("/", protect, isAdmin, getAllReservations);

// ADMIN : changer statut réservation (APPROVED / REJECTED)
router.patch("/:id/status", protect, isAdmin, updateReservationStatus);

module.exports = router;

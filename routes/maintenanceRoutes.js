const express = require("express");
const router = express.Router();
const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceByVehicle,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");

const { protect, isAdmin } = require("../middleware/auth");

// ADMIN - créer une opération de maintenance
router.post("/", protect, isAdmin, createMaintenance);

// ADMIN - lister toutes les maintenances
router.get("/", protect, isAdmin, getAllMaintenance);

// ADMIN - lister les maintenances d'un véhicule
router.get("/vehicle/:vehicleId", protect, isAdmin, getMaintenanceByVehicle);

// ADMIN - changer le statut d’une maintenance
router.patch("/:id/status", protect, isAdmin, updateMaintenanceStatus);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
} = require("../controllers/vehicleController");

const { protect, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload"); // ⬅️ NEW

// --- CATEGORIES --- //
// ADMIN : créer une catégorie
router.post("/categories", protect, isAdmin, createCategory);

// PUBLIC : liste des catégories
router.get("/categories", getCategories);

// --- VEHICLES --- //
// PUBLIC : liste + filtres
router.get("/", getVehicles);

// PUBLIC : détail d'un véhicule
router.get("/:id", getVehicleById);

// ADMIN : créer un véhicule + image (optionnelle)
router.post(
  "/",
  protect,
  isAdmin,
  upload.single("image"), // ⬅️ NEW (champ "image" dans form-data)
  createVehicle
);

// ADMIN : mettre à jour un véhicule (image possible aussi)
router.put(
  "/:id",
  protect,
  isAdmin,
  upload.single("image"), // ⬅️ NEW si tu veux permettre de changer l'image
  updateVehicle
);

// ADMIN : mise à jour du statut uniquement (dispo)
router.patch("/:id/status", protect, isAdmin, updateVehicleStatus);

// ADMIN : supprimer un véhicule
router.delete("/:id", protect, isAdmin, deleteVehicle);

module.exports = router;

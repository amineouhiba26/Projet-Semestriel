const express = require("express");
const router = express.Router();

const {
  createContractFromReservation,
  getContracts,
  getContractById,
  closeContract,
  downloadContractPdf,   // ⬅️ NEW
} = require("../controllers/contractController");

const { protect, isAdmin } = require("../middleware/auth");

// créer contrat
router.post(
  "/from-reservation/:reservationId",
  protect,
  isAdmin,
  createContractFromReservation
);

// liste
router.get("/", protect, isAdmin, getContracts);

// détail
router.get("/:id", protect, isAdmin, getContractById);

// PDF
router.get("/:id/pdf", protect, isAdmin, downloadContractPdf);

// clôture
router.patch("/:id/close", protect, isAdmin, closeContract);

module.exports = router;

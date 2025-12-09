const Contract = require("../models/Contract");
const Reservation = require("../models/Reservation");
const Vehicle = require("../models/Vehicle");
const { generateContractPdf } = require("../utils/contractPdf");

// Génère un numéro de contrat
const generateContractNumber = () => {
  return "CTR-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};

// ADMIN - créer un contrat à partir d'une réservation APPROVED
exports.createContractFromReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findById(reservationId)
      .populate("user")
      .populate("vehicle");

    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    if (reservation.status !== "APPROVED") {
      return res
        .status(400)
        .json({ message: "La réservation doit être APPROVED pour créer un contrat" });
    }

    const exists = await Contract.findOne({ reservation: reservationId });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Un contrat existe déjà pour cette réservation" });
    }

    // 1) Créer le contrat en DB
    let contract = await Contract.create({
      contractNumber: generateContractNumber(),
      reservation: reservation._id,
      user: reservation.user._id,
      vehicle: reservation.vehicle._id,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      totalPrice: reservation.totalPrice,
      status: "ACTIVE",
      isPaid: false,
    });

    // 2) Générer le PDF et mettre à jour pdfPath
    const pdfPath = await generateContractPdf(contract, reservation.user, reservation.vehicle, reservation);
    contract.pdfPath = pdfPath;
    await contract.save();

    // 3) Mettre le véhicule en RENTED
    if (reservation.vehicle.status !== "RENTED") {
      reservation.vehicle.status = "RENTED";
      await reservation.vehicle.save();
    }

    return res.status(201).json(contract);
  } catch (e) {
    console.error("createContractFromReservation:", e);
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

// Liste des contrats
exports.getContracts = async (req, res) => {
  try {
    const list = await Contract.find()
      .populate("user", "firstName lastName email")
      .populate("vehicle", "brand model plateNumber")
      .populate("reservation");

    return res.json(list);
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

// Détail contrat
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("vehicle", "brand model plateNumber")
      .populate("reservation");

    if (!contract) {
      return res.status(404).json({ message: "Contrat introuvable" });
    }

    return res.json(contract);
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

// Télécharger le PDF d’un contrat
exports.downloadContractPdf = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract || !contract.pdfPath) {
      return res.status(404).json({ message: "PDF de contrat non trouvé" });
    }

    return res.download(contract.pdfPath);
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

// Clôturer contrat
exports.closeContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate("vehicle");

    if (!contract) {
      return res.status(404).json({ message: "Contrat introuvable" });
    }

    if (contract.status !== "ACTIVE") {
      return res
        .status(400)
        .json({ message: "Seuls les contrats actifs peuvent être clôturés" });
    }

    contract.status = "CLOSED";
    await contract.save();

    if (contract.vehicle.status === "RENTED") {
      contract.vehicle.status = "AVAILABLE";
      await contract.vehicle.save();
    }

    return res.json({ message: "Contrat clôturé, véhicule disponible", contract });
  } catch (e) {
    return res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

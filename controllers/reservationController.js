const Reservation = require("../models/Reservation");
const Vehicle = require("../models/Vehicle");

// util pour calculer le nombre de jours entre deux dates
function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const days = diffMs / (1000 * 60 * 60 * 24);
  return days;
}

// CLIENT - créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: "vehicleId, startDate et endDate sont requis" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé" });

    if (vehicle.status !== "AVAILABLE") {
      return res.status(400).json({ message: "Ce véhicule n'est pas disponible" });
    }

    const days = calculateDays(startDate, endDate);
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ message: "Dates invalides (endDate doit être après startDate)" });
    }

    const dailyPrice = vehicle.dailyPriceOverrides ?? vehicle.basePricePerDay;
    const totalPrice = days * dailyPrice;

    const reservation = await Reservation.create({
      user: req.user._id,
      vehicle: vehicle._id,
      startDate,
      endDate,
      totalPrice,
      status: "PENDING",
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error("createReservation", error);
    res.status(500).json({ message: "Erreur lors de la création de la réservation", error: error.message });
  }
};

// CLIENT - voir MES réservations
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("vehicle", "brand model plateNumber status")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: error.message });
  }
};

// CLIENT - annuler une réservation (seulement si PENDING)
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ message: "Seules les réservations en attente peuvent être annulées" });
    }

    reservation.status = "CANCELLED";
    await reservation.save();

    res.json({ message: "Réservation annulée", reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'annulation", error: error.message });
  }
};

// ADMIN - voir TOUTES les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "firstName lastName email")
      .populate("vehicle", "brand model plateNumber")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: error.message });
  }
};

// ADMIN - changer le statut (APPROVED / REJECTED)
// si APPROVED → véhicule passe en RENTED
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Status invalide (APPROVED ou REJECTED)" });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

    const vehicle = await Vehicle.findById(reservation.vehicle);
    if (!vehicle) return res.status(404).json({ message: "Véhicule lié à la réservation non trouvé" });

    reservation.status = status;
    await reservation.save();

    if (status === "APPROVED") {
      vehicle.status = "RENTED";
      await vehicle.save();
    } else if (status === "REJECTED" && vehicle.status === "RENTED") {
      vehicle.status = "AVAILABLE";
      await vehicle.save();
    }

    res.json({ message: "Statut de la réservation mis à jour", reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message });
  }
};

const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

// ADMIN - créer une opération de maintenance
exports.createMaintenance = async (req, res) => {
  try {
    const { vehicleId, description, date, cost } = req.body;

    if (!vehicleId || !description || !date) {
      return res.status(400).json({ message: "vehicleId, description et date sont requis" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule non trouvé" });
    }

    const maintenance = await Maintenance.create({
      vehicle: vehicleId,
      description,
      date,
      cost,
      status: "SCHEDULED",
    });

    res.status(201).json(maintenance);
  } catch (error) {
    console.error("createMaintenance", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ADMIN - lister toutes les maintenances
exports.getAllMaintenance = async (req, res) => {
  try {
    const maints = await Maintenance.find()
      .populate("vehicle", "plateNumber brand model status")
      .sort({ date: -1 });

    res.json(maints);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ADMIN - maintenances pour un véhicule donné
exports.getMaintenanceByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const maints = await Maintenance.find({ vehicle: vehicleId })
      .sort({ date: -1 });

    res.json(maints);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ADMIN - mettre à jour le statut d’une maintenance
// SCHEDULED -> IN_PROGRESS -> DONE
// Quand IN_PROGRESS => véhicule en MAINTENANCE
// Quand DONE => on peut remettre le véhicule en AVAILABLE (si tu veux)
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["SCHEDULED", "IN_PROGRESS", "DONE"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const maint = await Maintenance.findById(id);
    if (!maint) {
      return res.status(404).json({ message: "Maintenance non trouvée" });
    }

    const vehicle = await Vehicle.findById(maint.vehicle);
    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule lié non trouvé" });
    }

    maint.status = status;
    await maint.save();

    // logique sur le statut du véhicule
    if (status === "IN_PROGRESS") {
      vehicle.status = "MAINTENANCE";
      await vehicle.save();
    } else if (status === "DONE") {
      // ici, on décide de remettre le véhicule disponible
      // (tu peux adapter selon ton besoin)
      if (vehicle.status === "MAINTENANCE") {
        vehicle.status = "AVAILABLE";
        await vehicle.save();
      }
    }

    res.json({ message: "Statut de maintenance mis à jour", maintenance: maint });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

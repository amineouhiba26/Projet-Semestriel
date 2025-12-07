const Vehicle = require("../models/Vehicle");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary"); // ⬅ pour suppression image si besoin



// ADMIN - créer une catégorie
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Le nom est requis" });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Cette catégorie existe déjà" });

    const category = await Category.create({ name, description });
    res.status(201).json(category);

  } catch (error) {
    console.error("createCategory", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// PUBLIC - lister les catégories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};




// ADMIN - créer un véhicule (Cloudinary)
exports.createVehicle = async (req, res) => {
  try {
    const {
      plateNumber,
      brand,
      model,
      year,
      fuelType,
      transmission,
      mileage,
      color,
      basePricePerDay,
      dailyPriceOverrides,
      categoryId,
    } = req.body;

    // Vérification champs obligatoires
    if (!plateNumber || !brand || !model || !year || !basePricePerDay || !categoryId) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    // Vérifier la catégorie
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Catégorie non trouvée" });

    // Vérifier immatriculation unique
    const exists = await Vehicle.findOne({ plateNumber });
    if (exists) return res.status(400).json({ message: "Ce numéro d'immatriculation existe déjà" });

    // Structure du véhicule
    const vehicleData = {
      plateNumber,
      brand,
      model,
      year,
      fuelType,
      transmission,
      mileage,
      color,
      basePricePerDay,
      dailyPriceOverrides,
      category: categoryId,
    };

    //  Ajout image Cloudinary si fournie
    if (req.file && req.file.path) {
      vehicleData.imageUrl = req.file.path;        // URL accessible
      vehicleData.imagePublicId = req.file.filename; // ID pour suppression
    }

    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json(vehicle);

  } catch (error) {
    console.error("createVehicle", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// PUBLIC - lister les véhicules (+ filtres optionnels)
exports.getVehicles = async (req, res) => {
  try {
    const { status, categoryId } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (categoryId) filter.category = categoryId;

    const vehicles = await Vehicle.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(vehicles);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// PUBLIC - détails véhicule
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("category", "name");

    if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé" });

    res.json(vehicle);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// ADMIN - mettre à jour véhicule + possibilité changer image
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé" });

    const updates = req.body;
    Object.assign(vehicle, updates); // met à jour automatiquement tous les champs envoyés

    //  si nouvelle image → remplacer dans DB
    if (req.file && req.file.path) {
      // suppression ancienne image si existante
      if (vehicle.imagePublicId) {
        await cloudinary.uploader.destroy(vehicle.imagePublicId);
      }
      vehicle.imageUrl = req.file.path;
      vehicle.imagePublicId = req.file.filename;
    }

    const updated = await vehicle.save();
    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// ADMIN - supprimer véhicule (+ suppression image Cloudinary)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé" });

    //  supprimer image Cloudinary si existante
    if (vehicle.imagePublicId) {
      await cloudinary.uploader.destroy(vehicle.imagePublicId);
    }

    await vehicle.deleteOne();
    res.json({ message: "Véhicule supprimé avec image (si existante)" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// ADMIN - changer uniquement le statut (disponibilité)
exports.updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Le statut est requis" });

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé" });

    vehicle.status = status;
    await vehicle.save();

    res.json(vehicle);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    plateNumber: {
      type: String,
      required: [true, "Le numéro d'immatriculation est requis"],
      unique: true,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "La marque est requise"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Le modèle est requis"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "L'année est requise"],
    },
    fuelType: {
      type: String,
      trim: true, 
    },
    transmission: {
      type: String,
      trim: true, 
    },
    mileage: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      trim: true,
    },

    // 📸 CLOUDINARY
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },

    // 🚗 DISPONIBILITÉ
    status: {
      type: String,
      enum: ["AVAILABLE", "RENTED", "MAINTENANCE"],
      default: "AVAILABLE",
    },

    // 💰 TARIFICATION
    basePricePerDay: {
      type: Number,
      required: [true, "Le prix de base par jour est requis"],
    },
    dailyPriceOverrides: {
      type: Number,
      default: null,
    },

    // 🔗 RELATION AVEC CATEGORY
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie est requise"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema(
  {
    reservation: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },

    contractNumber: {
      type: String,
      unique: true,
    },

    // 🔹 Paiement lié
    isPaid: {
      type: Boolean,
      default: false,
    },

    // 🔹 Chemin du PDF généré
    pdfPath: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", contractSchema);

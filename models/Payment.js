const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    contract: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
      unique: true // 1 paiement par contrat (simple pour ton projet)
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["CASH", "CARD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PAID", // on considère qu'on enregistre un paiement réalisé
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);

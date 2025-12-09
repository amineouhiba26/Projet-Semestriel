const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const maintenanceSchema = new Schema(
  {
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La date de maintenance est requise"],
    },
    cost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_PROGRESS", "DONE"],
      default: "SCHEDULED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);

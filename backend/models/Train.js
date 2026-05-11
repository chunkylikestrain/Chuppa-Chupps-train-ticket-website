// backend/models/Train.js
import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    trainCode: {
      type: String,
      required: true,
      unique: true, // VD: "SE1", "TN2"
    },
    trainName: {
      type: String,
      required: true,
    },
    carriages: [
      {
        carriageNumber: { type: Number, required: true },
        type: {
          type: String,
          enum: [
            "soft_seat",
            "hard_seat",
            "soft_sleeper",
            "hard_sleeper",
            "vip",
          ],
          required: true,
        },
        totalSeats: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["active", "maintenance", "retired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Train = mongoose.model("Train", trainSchema);
export default Train;

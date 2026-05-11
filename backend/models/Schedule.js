// backend/models/Schedule.js
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["on_time", "delayed", "cancelled"],
      default: "on_time",
    },
    delayMinutes: {
      type: Number,
      default: 0,
    },
    // Quản lý kho ghế trống của chuyến này
    seatInventory: [
      {
        carriageNumber: { type: Number, required: true },
        type: { type: String, required: true },
        totalSeats: { type: Number, required: true },
        bookedSeats: [{ type: String }], // Danh sách ghế đã bị đặt (VD: ["1A", "2B"])
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;

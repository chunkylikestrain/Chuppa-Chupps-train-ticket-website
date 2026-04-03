import mongoose from "mongoose";

// Khởi tạo Schema cho chuyến tàu
const trainSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    fromStation: {
      type: String,
      required: true,
    },
    toStation: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    travelDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Train = mongoose.model("Train", trainSchema);
export default Train;

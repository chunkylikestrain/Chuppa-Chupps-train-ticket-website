// backend/models/Route.js
import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeCode: {
      type: String,
      required: true,
      unique: true, // VD: "HAN-SGN"
    },
    departureStation: {
      type: String,
      required: true,
    },
    arrivalStation: {
      type: String,
      required: true,
    },
    stops: [
      {
        stationName: { type: String, required: true },
        order: { type: Number, required: true }, // Thứ tự ga dừng (1, 2, 3...)
        distanceFromStart: { type: Number, required: true }, // Khoảng cách từ ga đi (km)
      },
    ],
    totalDistance: {
      type: Number,
      required: true, // Tổng chiều dài tuyến (km)
    },
  },
  {
    timestamps: true,
  },
);

const Route = mongoose.model("Route", routeSchema);
export default Route;

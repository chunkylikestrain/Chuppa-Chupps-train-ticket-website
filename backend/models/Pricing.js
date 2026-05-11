// backend/models/Pricing.js
import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    seatType: {
      type: String,
      enum: ["soft_seat", "hard_seat", "soft_sleeper", "hard_sleeper", "vip"],
      required: true,
    },
    passengerType: {
      type: String,
      enum: ["adult", "child", "senior"],
      default: "adult",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Pricing = mongoose.model("Pricing", pricingSchema);
export default Pricing;

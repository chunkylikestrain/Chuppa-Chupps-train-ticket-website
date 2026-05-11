// backend/models/Discount.js
import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // VD: "SUMMER2026"
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"], // Phần trăm hoặc Trừ thẳng tiền
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    maxUsage: {
      type: Number,
      required: true, // Số lượng mã tối đa được dùng
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;

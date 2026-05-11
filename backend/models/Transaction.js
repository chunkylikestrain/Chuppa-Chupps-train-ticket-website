// Path: backend/models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Có thể null nếu giao dịch không liên quan đến vé cụ thể
    },
    type: {
      type: String,
      enum: ["payment", "refund", "loyalty_earn", "loyalty_redeem"],
      required: true,
    },
    amount: { type: Number, required: true }, // Số tiền (hoặc số điểm)
    paymentMethod: {
      type: String,
      enum: [
        "credit_card",
        "paypal",
        "blik",
        "momo",
        "zalopay",
        "banking",
        "wallet",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionCode: { type: String, required: true, unique: true }, // Mã giao dịch của Cổng thanh toán
    note: { type: String }, // Ghi chú (VD: "Hoàn tiền vé SE1", "Cộng điểm chuyến đi")
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

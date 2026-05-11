// Path: backend/models/Passenger.js
import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Liên kết với tài khoản người tạo
    },
    fullName: { type: String, required: true },
    nationalId: { type: String }, // CMND/CCCD
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    passengerType: {
      type: String,
      enum: ["adult", "child", "student", "senior"],
      default: "adult",
    },
    phone: { type: String },
    isDefault: { type: Boolean, default: false }, // Đánh dấu là hành khách mặc định
  },
  {
    timestamps: true,
  },
);

const Passenger = mongoose.model("Passenger", passengerSchema);
export default Passenger;

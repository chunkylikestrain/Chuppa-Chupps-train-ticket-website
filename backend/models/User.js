// Path: backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- Thông tin cơ bản (Cũ) ---
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "staff"], default: "user" },

    // --- Thông tin cá nhân (Mới) ---
    avatar: { type: String, default: "" }, // URL ảnh đại diện
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    phone: { type: String },
    nationalId: { type: String }, // CMND/CCCD
    passportNumber: { type: String }, // Hộ chiếu
    passengerType: {
      type: String,
      enum: ["adult", "child", "student", "senior"],
      default: "adult",
    },

    // --- Thẻ ưu đãi (Mới) ---
    studentCard: {
      studentId: String,
      university: String,
      major: String,
      expiresAt: Date,
      imageUrl: String,
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
    },
    seniorCard: {
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
    },
    disabilityCard: {
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      imageUrl: String,
    },

    // --- Tích lũy điểm (Mới) ---
    loyaltyPoints: { type: Number, default: 0 },

    // --- Bảo mật (Mới) ---
    twoFactorEnabled: { type: Boolean, default: false },
    loginHistory: [
      {
        ip: String,
        device: String,
        loginAt: { type: Date, default: Date.now },
      },
    ],

    // --- Cài đặt thông báo (Mới) ---
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      promotions: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;

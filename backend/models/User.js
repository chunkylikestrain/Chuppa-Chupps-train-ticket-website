import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Không cho phép 2 tài khoản trùng email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Tự động thêm ngày tạo (createdAt) và ngày cập nhật (updatedAt)
  },
);

const User = mongoose.model("User", userSchema);
export default User;

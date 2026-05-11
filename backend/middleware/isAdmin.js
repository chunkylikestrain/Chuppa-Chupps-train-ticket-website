// backend/middleware/isAdmin.js
import User from "../models/User.js";

// Middleware kiểm tra quyền Admin (Chạy sau middleware protect)
export const isAdmin = async (req, res, next) => {
  try {
    // req.user đã được gán từ middleware `protect` trước đó
    if (req.user && req.user.role === "admin") {
      next(); // Hợp lệ, cho đi tiếp vào API Controller
    } else {
      res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error("Lỗi xác thực Admin:", error);
    res
      .status(500)
      .json({ message: "Server error during admin verification." });
  }
};

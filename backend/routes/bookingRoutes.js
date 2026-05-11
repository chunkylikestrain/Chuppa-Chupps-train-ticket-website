// Path: backend/routes/bookingRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

// ==========================================
// 1. API: TẠO ĐƠN ĐẶT VÉ + THANH TOÁN + TÍCH ĐIỂM + KHÓA GHẾ
// Chuyển toàn bộ logic sang file bookingController.js để xử lý
// ==========================================
router.post("/", protect, createBooking);

// ==========================================
// 2. API: LẤY DANH SÁCH VÉ CỦA TÔI
// ==========================================
router.get("/my-bookings", protect, getMyBookings);

export default router;

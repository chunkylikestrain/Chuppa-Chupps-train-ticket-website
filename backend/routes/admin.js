// backend/routes/admin.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import * as adminController from "../controllers/adminController.js"; // Import toàn bộ

const router = express.Router();

// BẤT KỲ API NÀO TRONG ĐÂY CŨNG PHẢI ĐI QUA 2 CỬA:
// 1. protect (Đăng nhập chưa?) -> 2. isAdmin (Phải sếp không?)
router.use(protect, isAdmin);

// ==========================================
// ROUTES: QUẢN LÝ TÀU
router
  .route("/trains")
  .get(adminController.getTrains)
  .post(adminController.createTrain);
router
  .route("/trains/:id")
  .put(adminController.updateTrain)
  .delete(adminController.deleteTrain);

// ROUTES: QUẢN LÝ TUYẾN ĐƯỜNG
router
  .route("/routes")
  .get(adminController.getRoutes)
  .post(adminController.createRoute);
router
  .route("/routes/:id")
  .put(adminController.updateRoute)
  .delete(adminController.deleteRoute);

// ROUTES: LỊCH CHẠY
router
  .route("/schedules")
  .get(adminController.getSchedules)
  .post(adminController.createSchedule);
router
  .route("/schedules/:id")
  .put(adminController.updateSchedule)
  .delete(adminController.deleteSchedule);
router.patch("/schedules/:id/status", adminController.updateScheduleStatus);

// ROUTES: BẢNG GIÁ
router
  .route("/pricing")
  .get(adminController.getPricings)
  .post(adminController.createPricing);
router
  .route("/pricing/:id")
  .put(adminController.updatePricing)
  .delete(adminController.deletePricing);

// ROUTES: ĐƠN ĐẶT VÉ
router.get("/bookings", adminController.getBookings);
router.get("/bookings/:id", adminController.getBookingById);
router.patch("/bookings/:id/status", adminController.updateBookingStatus);

// ROUTES: NGƯỜI DÙNG
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.patch("/users/:id/status", adminController.updateUserStatus);
router.patch("/users/:id/role", adminController.updateUserRole);

// Quản lý phê duyệt thẻ
router.get("/verifications/cards", adminController.getPendingCards);
router.put("/verifications/cards/:userId", adminController.verifyCard);

// ROUTES: MÃ GIẢM GIÁ
router
  .route("/discounts")
  .get(adminController.getDiscounts)
  .post(adminController.createDiscount);
router
  .route("/discounts/:id")
  .put(adminController.updateDiscount)
  .delete(adminController.deleteDiscount);

// ROUTES: THỐNG KÊ DOANH THU (STATS)
router.get("/stats/overview", adminController.getOverviewStats);
router.get("/stats/revenue", adminController.getRevenueStats);
router.get("/stats/top-routes", adminController.getTopRoutes);

export default router;

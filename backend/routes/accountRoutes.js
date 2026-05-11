// Path: backend/routes/accountRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import * as accountController from "../controllers/accountController.js";

const router = express.Router();

// Cấu hình Multer để upload file lưu vào thư mục /uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Tạm thời lưu chung vào thư mục uploads
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png|webp/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Images only! (jpg, jpeg, png, webp)"));
  },
});

// BẮT BUỘC ĐĂNG NHẬP (Chạy qua middleware protect)
router.use(protect);

// --- THÔNG TIN CÁ NHÂN ---
router
  .route("/profile")
  .get(accountController.getProfile)
  .put(accountController.updateProfile);

router.post("/avatar", upload.single("avatar"), accountController.uploadAvatar);
router.put("/change-password", accountController.changePassword);

// --- THẺ ƯU ĐÃI ---
router.get("/cards", accountController.getCards);
router.post(
  "/student-card",
  upload.single("cardImage"),
  accountController.submitStudentCard,
);
router.delete("/student-card", accountController.deleteStudentCard);

// --- HÀNH KHÁCH THƯỜNG DÙNG ---
router
  .route("/passengers")
  .get(accountController.getPassengers)
  .post(accountController.addPassenger);

router
  .route("/passengers/:id")
  .put(accountController.updatePassenger)
  .delete(accountController.deletePassenger);

router.patch("/passengers/:id/default", accountController.setDefaultPassenger);

// --- CÁC TÍNH NĂNG KHÁC ---
router.get("/transactions", accountController.getTransactions);
router.put("/notifications", accountController.updateNotifications);
router.get("/login-history", accountController.getLoginHistory);
router.get("/loyalty", accountController.getLoyaltyInfo);

export default router;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import trainRoutes from "./routes/trainRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/admin.js";
import publicRoutes from "./routes/publicRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";

import path from "path";

// Đọc file .env
dotenv.config();

// 1. KHỞI TẠO EXPRESS TRƯỚC
const app = express();

// 2. CẤU HÌNH ĐƯỜNG DẪN TĨNH CHO THƯ MỤC UPLOADS (SAU KHI ĐÃ CÓ app)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Kết nối Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Nạp các Routes
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/account", accountRoutes);

// Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 The ChuppaChup server is running at full speed at the gateway. ${PORT}`,
  );
});

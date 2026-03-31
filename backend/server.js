import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// Đọc file .env
dotenv.config();

// Khởi tạo Express
const app = express();

// Kết nối Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Nạp các Routes
app.use("/api/auth", authRoutes);

// Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ChuppaChup đang chạy rầm rập tại cổng ${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import trainRoutes from "./routes/trainRoutes.js";

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
app.use("/api/stations", stationRoutes);
app.use("/api/trains", trainRoutes);

// Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 The ChuppaChup server is running at full speed at the gateway. ${PORT}`,
  );
});

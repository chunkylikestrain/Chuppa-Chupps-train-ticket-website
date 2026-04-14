import express from "express";
import Train from "../models/Train.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// 1. API DÀNH CHO KHÁCH & ADMIN: Lấy danh sách tàu (Không khóa)
// ==========================================
router.get("/search", async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let queryFilter = {};

    if (from) queryFilter.fromStation = { $regex: from, $options: "i" };
    if (to) queryFilter.toStation = { $regex: to, $options: "i" };
    if (date) queryFilter.travelDate = date;

    // Trả về toàn bộ nếu không có query, hoặc lọc theo from/to/date
    const trains = await Train.find(queryFilter).sort({ departureTime: 1 });
    res.status(200).json(trains);
  } catch (error) {
    console.error("Error searching for trains:", error);
    res
      .status(500)
      .json({ message: "Server error while searching for trains" });
  }
});

// ==========================================
// 2. API DÀNH CHO ADMIN: THÊM TÀU MỚI (POST /api/trains)
// ==========================================
router.post("/", protect, admin, async (req, res) => {
  try {
    const newTrain = new Train(req.body);
    const savedTrain = await newTrain.save();
    res.status(201).json(savedTrain);
  } catch (error) {
    res.status(400).json({ message: "Invalid train data" });
  }
});

// ==========================================
// 3. API DÀNH CHO ADMIN: SỬA THÔNG TIN TÀU (PUT /api/trains/:id)
// ==========================================
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const updatedTrain = await Train.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedTrain)
      return res.status(404).json({ message: "Train not found" });
    res.json(updatedTrain);
  } catch (error) {
    res.status(400).json({ message: "Error updating train" });
  }
});

// ==========================================
// 4. API DÀNH CHO ADMIN: XÓA CHUYẾN TÀU (DELETE /api/trains/:id)
// ==========================================
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const deletedTrain = await Train.findByIdAndDelete(req.params.id);
    if (!deletedTrain)
      return res.status(404).json({ message: "Train not found" });
    res.json({ message: "Train removed completely!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting train" });
  }
});

export default router;

import express from "express";
import Station from "../models/Station.js";

const router = express.Router();

// API GỢI Ý GA TÀU: GET /api/stations/search?q=từ_khóa

router.get("/search", async (req, res) => {
  try {
    // Lấy từ khóa người dùng gõ
    const keyword = req.query.q || "";

    // Nếu chưa gõ gì thì không cần trả về list dài thòng, trả về mảng rỗng
    if (keyword.trim() === "") {
      return res.json([]);
    }

    // Tìm kiếm bằng Regex của MongoDB:

    const stations = await Station.find({
      name: { $regex: keyword, $options: "i" },
    }).limit(10); // Giới hạn trả về 10 ga

    res.json(stations);
  } catch (error) {
    console.error("Train station search error:", error);
    res
      .status(500)
      .json({ message: "Server error when searching for train stations" });
  }
});

export default router;

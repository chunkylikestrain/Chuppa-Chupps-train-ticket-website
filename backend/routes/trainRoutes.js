import express from "express";
import Train from "../models/Train.js";

const router = express.Router();

// TÌM KIẾM CHUYẾN TÀU: GET /api/trains/search

router.get("/search", async (req, res) => {
  try {
    const { from, to, date } = req.query;

    let queryFilter = {};

    if (from) {
      queryFilter.fromStation = { $regex: from, $options: "i" };
    }

    if (to) {
      queryFilter.toStation = { $regex: to, $options: "i" };
    }

    if (date) {
      queryFilter.travelDate = date;
    }

    const trains = await Train.find(queryFilter).sort({ departureTime: 1 });

    // Trả về kết quả cho Frontend
    res.status(200).json(trains);
  } catch (error) {
    console.error("Error searching for trains:", error);
    res
      .status(500)
      .json({ message: "Server error while searching for trains" });
  }
});

export default router;

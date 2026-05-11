// Path: backend/controllers/bookingController.js
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Schedule from "../models/Schedule.js";

// ==========================================
// TẠO BOOKING + THANH TOÁN + TÍCH ĐIỂM + KHÓA GHẾ
// ==========================================
export const createBooking = async (req, res) => {
  try {
    const {
      train,
      seats,
      passengers,
      totalPrice,
      status,
      journeyDetails,
      usedPoints,
      scheduleId,
    } = req.body;

    if (!scheduleId || !seats || seats.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid schedule or seat data!" });
    }

    // 1. KHÓA GHẾ (MONGODB ARRAY-FILTERS)
    for (const seatStr of seats) {
      const parts = seatStr.split("-");
      const carriageNum = parseInt(parts[0].replace(/\D/g, "")) || 1;
      const seatNum = parts.length > 1 ? parts[1].trim() : seatStr;

      await Schedule.updateOne(
        { _id: scheduleId },
        {
          $addToSet: {
            "seatInventory.$[toa].bookedSeats": {
              $each: [seatStr, seatNum, `${carriageNum}-${seatNum}`],
            },
          },
        },
        { arrayFilters: [{ "toa.carriageNumber": carriageNum }] },
      );
    }

    // 2. CẬP NHẬT ĐIỂM LOYALTY (ATOMIC UPDATE)
    let pointsChange = 0;
    if (usedPoints && usedPoints > 0) pointsChange -= usedPoints;

    const earnedPoints = Math.floor(totalPrice);
    if (earnedPoints > 0) pointsChange += earnedPoints;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { loyaltyPoints: pointsChange } },
      { returnDocument: "after" },
    );

    // 3. TẠO VÉ
    const newBooking = new Booking({
      user: req.user._id,
      train,
      seats,
      passengers,
      totalPrice,
      status: status || "confirmed",
      journeyDetails,
    });
    await newBooking.save();

    // 4. LƯU LỊCH SỬ GIAO DỊCH (HÓA ĐƠN & ĐIỂM)
    const txBaseCode = Date.now().toString().slice(-6);

    await Transaction.create({
      user: req.user._id,
      booking: newBooking._id,
      type: "payment",
      amount: totalPrice,
      transactionCode: `TXN-${txBaseCode}`,
      note: `Ticket purchase ${journeyDetails?.fromStation} - ${journeyDetails?.toStation}`,
      status: "success",
    });

    if (usedPoints && usedPoints > 0) {
      await Transaction.create({
        user: req.user._id,
        booking: newBooking._id,
        type: "loyalty_redeem",
        amount: usedPoints,
        transactionCode: `RED-${txBaseCode}`,
        note: `Redeemed ${usedPoints} points`,
        status: "success",
      });
    }

    if (earnedPoints > 0) {
      await Transaction.create({
        user: req.user._id,
        booking: newBooking._id,
        type: "loyalty_earn",
        amount: earnedPoints,
        transactionCode: `PTS-${txBaseCode}`,
        note: "Points earned from booking",
        status: "success",
      });
    }

    res.status(201).json({ booking: newBooking, user: updatedUser });
  } catch (error) {
    console.error("Booking Error:", error);
    res
      .status(500)
      .json({ message: "Server error during booking", error: error.message });
  }
};

// ==========================================
// LẤY DANH SÁCH VÉ CỦA TÔI
// ==========================================
export const getMyBookings = async (req, res) => {
  try {
    const myBookings = await Booking.find({ user: req.user._id })
      .populate("train")
      .sort({ createdAt: -1 });

    res.status(200).json(myBookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ message: "Server error fetching bookings." });
  }
};

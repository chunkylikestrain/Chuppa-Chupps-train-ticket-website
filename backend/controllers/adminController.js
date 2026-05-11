// backend/controllers/adminController.js
import Train from "../models/Train.js";
import Route from "../models/Route.js";
import Schedule from "../models/Schedule.js";
import Pricing from "../models/Pricing.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Discount from "../models/Discount.js";

// ==========================================
// 1. QUẢN LÝ TÀU (TRAINS)
// ==========================================
export const getTrains = async (req, res) => {
  try {
    // Phân trang mặc định: trang 1, 10 item/trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const trains = await Train.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Train.countDocuments();

    res.json({ trains, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trains" });
  }
};

export const createTrain = async (req, res) => {
  try {
    const train = new Train(req.body);
    const savedTrain = await train.save();
    res.status(201).json(savedTrain);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating train", error: error.message });
  }
};

export const updateTrain = async (req, res) => {
  try {
    const updatedTrain = await Train.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedTrain);
  } catch (error) {
    res.status(400).json({ message: "Error updating train" });
  }
};

export const deleteTrain = async (req, res) => {
  try {
    await Train.findByIdAndDelete(req.params.id);
    res.json({ message: "Train deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting train" });
  }
};

// ==========================================
// 2. QUẢN LÝ TUYẾN ĐƯỜNG (ROUTES)
// ==========================================
// Các hàm CRUD tương tự như Train, tối ưu hóa code
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching routes" });
  }
};

export const createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ message: "Error creating route" });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(route);
  } catch (error) {
    res.status(400).json({ message: "Error updating route" });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting route" });
  }
};

// ==========================================
// 3. QUẢN LÝ LỊCH CHẠY (SCHEDULES)
// ==========================================
export const getSchedules = async (req, res) => {
  try {
    const { date, routeId, status } = req.query;
    let filter = {};

    // Lọc theo ngày (Từ 00:00 đến 23:59 của ngày đó)
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: startDate, $lte: endDate };
    }
    if (routeId) filter.route = routeId;
    if (status) filter.status = status;

    // Kéo thêm thông tin Tàu và Tuyến vào thay vì chỉ hiện ID
    const schedules = await Schedule.find(filter)
      .populate("train", "trainCode trainName")
      .populate("route", "routeCode departureStation arrivalStation")
      .sort({ departureTime: 1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules" });
  }
};

export const createSchedule = async (req, res) => {
  /* Code tương tự createRoute */
  try {
    res.status(201).json(await Schedule.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateSchedule = async (req, res) => {
  /* Code tương tự updateRoute */
  try {
    res.json(
      await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true }),
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateScheduleStatus = async (req, res) => {
  try {
    const { status, delayMinutes } = req.body;
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { status, delayMinutes: delayMinutes || 0 },
      { new: true },
    );
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: "Error updating status" });
  }
};

export const deleteSchedule = async (req, res) => {
  /* Code tương tự deleteRoute */
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// 4. QUẢN LÝ ĐƠN HÀNG (BOOKINGS)
// ==========================================
export const getBookings = async (req, res) => {
  try {
    const { status, userId, startDate, endDate } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const bookings = await Booking.find(filter)
      .populate("user", "fullName email")
      .populate("train") // Populate thêm detail chuyến tàu
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("train");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking details" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: "Error updating booking status" });
  }
};

// ==========================================
// 5. THỐNG KÊ DOANH THU (STATS) - TÍNH NĂNG "ĂN TIỀN"
// ==========================================
export const getOverviewStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Chạy song song 4 truy vấn cho nhanh
    const [totalRevenueData, totalBookings, totalUsers, totalSchedules] =
      await Promise.all([
        // Tính tổng tiền của các đơn hàng đã Confirm trong tháng
        Booking.aggregate([
          {
            $match: { status: "confirmed", createdAt: { $gte: startOfMonth } },
          },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Booking.countDocuments(),
        User.countDocuments(),
        Schedule.countDocuments({ departureTime: { $gte: startOfMonth } }),
      ]);

    res.json({
      revenueThisMonth: totalRevenueData[0]?.total || 0,
      totalBookings,
      totalUsers,
      schedulesThisMonth: totalSchedules,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating overview stats" });
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    const { period, from, to } = req.query;
    let dateFilter = {};
    if (from && to) {
      dateFilter = { $gte: new Date(from), $lte: new Date(to) };
    }

    // Định dạng nhóm theo ngày (YYYY-MM-DD) hoặc tháng (YYYY-MM)
    const formatStr = period === "monthly" ? "%Y-%m" : "%Y-%m-%d";

    const revenue = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          ...(from && to && { createdAt: dateFilter }),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: formatStr, date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" },
          ticketCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo ngày tháng tăng dần
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: "Error generating revenue stats" });
  }
};

// ==========================================
// CÁC HÀM CÒN LẠI (Pricing, Users, Discounts)
// Được viết tóm tắt vì logic tương tự CRUD ở trên
// ==========================================
export const getPricings = async (req, res) => {
  res.json(await Pricing.find().populate("route"));
};
export const createPricing = async (req, res) => {
  res.status(201).json(await Pricing.create(req.body));
};
export const updatePricing = async (req, res) => {
  res.json(
    await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  );
};
export const deletePricing = async (req, res) => {
  await Pricing.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};

export const getUsers = async (req, res) => {
  res.json(await User.find().select("-password"));
};
export const getUserById = async (req, res) => {
  res.json(await User.findById(req.params.id).select("-password"));
};
export const updateUserStatus = async (req, res) => {
  /* Cập nhật active/inactive */ res.json(
    await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    ),
  );
};
export const updateUserRole = async (req, res) => {
  res.json(
    await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true },
    ),
  );
};

export const getDiscounts = async (req, res) => {
  res.json(await Discount.find());
};
export const createDiscount = async (req, res) => {
  res.status(201).json(await Discount.create(req.body));
};
export const updateDiscount = async (req, res) => {
  res.json(
    await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  );
};
export const deleteDiscount = async (req, res) => {
  await Discount.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};

export const getTopRoutes = async (req, res) => {
  try {
    // Gom nhóm các đơn hàng đã thanh toán theo ID chuyến tàu
    const topTrains = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      {
        $group: {
          _id: "$train",
          totalRevenue: { $sum: "$totalPrice" },
          ticketsSold: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } }, // Sắp xếp doanh thu giảm dần
      { $limit: 5 }, // Lấy Top 5
      // Kéo thông tin Tàu từ collection 'trains' sang
      {
        $lookup: {
          from: "trains",
          localField: "_id",
          foreignField: "_id",
          as: "trainDetails",
        },
      },
      { $unwind: "$trainDetails" },
      // Chỉ trả về các trường cần thiết cho Frontend vẽ biểu đồ
      {
        $project: {
          _id: 0,
          name: "$trainDetails.trainCode",
          revenue: "$totalRevenue",
          tickets: "$ticketsSold",
        },
      },
    ]);

    res.json(topTrains);
  } catch (error) {
    console.error("Lỗi Top Routes:", error);
    res.status(500).json({ message: "Error generating top routes stats" });
  }
};

// ==========================================
// 8. QUẢN LÝ PHÊ DUYỆT THẺ (VERIFICATIONS)
// ==========================================

// Lấy danh sách các thẻ sinh viên đang chờ duyệt
export const getPendingCards = async (req, res) => {
  try {
    // Tìm user có nhập studentId nhưng verified đang là false
    const users = await User.find({
      "studentCard.studentId": { $exists: true, $ne: "" },
      "studentCard.verified": false,
    }).select("fullName email studentCard");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending cards" });
  }
};

// Admin bấm Duyệt (Approve) hoặc Từ chối (Reject)
export const verifyCard = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'approve' hoặc 'reject'

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "approve") {
      user.studentCard.verified = true;
      user.studentCard.verifiedAt = new Date();
    } else if (action === "reject") {
      // Nếu từ chối, xóa dữ liệu thẻ để user có thể gửi lại cái khác
      user.studentCard = undefined;
    }

    await user.save();
    res.json({ message: `Card ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error updating card status" });
  }
};

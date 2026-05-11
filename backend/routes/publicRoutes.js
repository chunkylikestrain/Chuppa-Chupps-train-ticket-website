// backend/routes/publicRoutes.js
import express from "express";
import Schedule from "../models/Schedule.js";
import Route from "../models/Route.js";
import Pricing from "../models/Pricing.js";
import Discount from "../models/Discount.js";

const router = express.Router();

// ==========================================
// API: KHÁCH HÀNG TÌM KIẾM CHUYẾN TÀU (Cập nhật logic trạm dừng)
// Phương thức: GET /api/public/search
// ==========================================
router.get("/search", async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to) {
      return res.json([]);
    }

    // 1. Lấy TẤT CẢ các tuyến đường để xử lý logic trạm trung gian
    const allRoutes = await Route.find();

    // Lọc các tuyến đường hợp lệ
    const matchedRoutes = allRoutes.filter((r) => {
      // Gộp tất cả các ga thành một mảng theo thứ tự thực tế: Ga Đi -> Các ga giữa -> Ga Đến
      const fullRouteStations = [
        r.departureStation.toLowerCase(),
        ...(r.intermediateStops || []).map((stop) =>
          stop.stationName.toLowerCase(),
        ),
        r.arrivalStation.toLowerCase(),
      ];

      // Chuyển từ khóa tìm kiếm về chữ thường
      const fromSearch = from.toLowerCase();
      const toSearch = to.toLowerCase();

      // Tìm vị trí của Ga Đi và Ga Đến trong mảng (dùng .includes để gõ "Hà" vẫn ra "Hà Nội")
      const searchFromIdx = fullRouteStations.findIndex((s) =>
        s.includes(fromSearch),
      );
      const searchToIdx = fullRouteStations.findIndex((s) =>
        s.includes(toSearch),
      );

      // Lộ trình này HỢP LỆ nếu:
      // - Chứa cả 2 ga khách hàng nhập
      // - Ga khách lên (from) nằm TRƯỚC ga khách xuống (to)
      return (
        searchFromIdx !== -1 &&
        searchToIdx !== -1 &&
        searchFromIdx < searchToIdx
      );
    });

    const routeIds = matchedRoutes.map((r) => r._id);

    if (routeIds.length === 0) {
      return res.json([]); // Không có lộ trình nào đi qua 2 ga này theo đúng thứ tự
    }

    // 2. Tìm Lịch chạy của các tuyến đó trong ngày khách chọn
    let scheduleFilter = {
      route: { $in: routeIds },
      status: { $ne: "cancelled" },
    };

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      // Lọc các lịch chạy khởi hành trong ngày đó (Từ 0h đến 24h)
      scheduleFilter.departureTime = { $gte: searchDate, $lt: nextDay };
    }

    const schedules = await Schedule.find(scheduleFilter)
      .populate("train", "trainCode trainName")
      .populate("route", "departureStation arrivalStation totalDistance")
      .sort({ departureTime: 1 })
      .lean();

    // 3. Lấy Bảng giá (Pricing) cho các tuyến này
    const pricings = await Pricing.find({ route: { $in: routeIds } });

    // 4. Nhào nặn dữ liệu trả về cho Frontend hiển thị đẹp nhất
    const formattedResults = schedules.map((sch) => {
      // Lấy giá cơ bản (Người lớn, Ghế mềm) làm giá hiển thị mặc định
      const defaultPricing = pricings.find(
        (p) =>
          p.route.toString() === sch.route._id.toString() &&
          p.passengerType === "adult" &&
          p.seatType === "soft_seat",
      );

      // Tính tổng số ghế còn trống
      let totalAvailable = 0;
      sch.seatInventory.forEach((inv) => {
        totalAvailable += inv.totalSeats - (inv.bookedSeats?.length || 0);
      });

      // Tính thời gian di chuyển (Duration)
      const dep = new Date(sch.departureTime);
      const arr = new Date(sch.arrivalTime);
      const diffMs = arr - dep;
      const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
      const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

      const routePricings = pricings.filter(
        (p) => p.route.toString() === sch.route._id.toString(),
      );

      return {
        scheduleId: sch._id,
        trainId: sch.train._id,
        trainCode: sch.train.trainCode,
        trainName: sch.train.trainName,
        fromStation: sch.route.departureStation, // Tạm thời vẫn hiển thị ga gốc của tuyến
        toStation: sch.route.arrivalStation, // Tạm thời vẫn hiển thị ga gốc của tuyến
        departureTime: dep.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        arrivalTime: arr.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        travelDate: dep.toLocaleDateString(),
        duration: `${diffHrs}h ${diffMins}m`,
        basePrice: defaultPricing ? defaultPricing.price : 0, // Giá hiển thị
        availableSeats: totalAvailable,
        status: sch.status,
        delayMinutes: sch.delayMinutes,
        seatInventory: sch.seatInventory,
        pricings: routePricings,
      };
    });

    res.json(formattedResults);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error during search." });
  }
});

// ==========================================
// API: KIỂM TRA MÃ GIẢM GIÁ (VOUCHER)
// ==========================================
router.post("/validate-voucher", async (req, res) => {
  try {
    const { code } = req.body;
    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (!discount)
      return res.status(404).json({ message: "Invalid promo code." });
    if (!discount.isActive)
      return res
        .status(400)
        .json({ message: "This code is no longer active." });
    if (new Date(discount.expiresAt) < new Date())
      return res.status(400).json({ message: "This code has expired." });
    if (discount.usedCount >= discount.maxUsage)
      return res
        .status(400)
        .json({ message: "This code has reached its usage limit." });

    res.json(discount);
  } catch (error) {
    res.status(500).json({ message: "Server error checking voucher." });
  }
});

// API: LẤY THÔNG TIN CHUYẾN TÀU & GHẾ MỚI NHẤT
// Phương thức: GET /api/public/schedules/:id
// ==========================================
router.get("/schedules/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("train", "trainCode trainName")
      .populate("route", "departureStation arrivalStation")
      .lean();

    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chuyến tàu này." });
    }

    res.json(schedule);
  } catch (error) {
    console.error("Lỗi khi fetch schedule chi tiết:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin ghế." });
  }
});

export default router;

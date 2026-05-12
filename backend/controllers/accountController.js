// Path: backend/controllers/accountController.js
import User from "../models/User.js";
import Passenger from "../models/Passenger.js";
import Transaction from "../models/Transaction.js";
import bcrypt from "bcryptjs";

// ==========================================
// 1. THÔNG TIN CÁ NHÂN (PROFILE)
// ==========================================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      phone,
      nationalId,
      passportNumber,
      passengerType,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        dateOfBirth,
        gender,
        phone,
        nationalId,
        passportNumber,
        passengerType,
      },
      { returnDocument: "after", runValidators: true }, // ĐÃ SỬA WARNING
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error updating profile" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image provided" });

    // ĐÃ SỬA: Bỏ chữ /avatars/ đi
    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { returnDocument: "after" }, // ĐÃ SỬA WARNING
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error uploading avatar" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    // Mã hóa mật khẩu mới và lưu
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};

// ==========================================
// 2. THẺ ƯU ĐÃI (CARDS)
// ==========================================
export const getCards = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "studentCard seniorCard disabilityCard",
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cards" });
  }
};

export const submitStudentCard = async (req, res) => {
  try {
    const { studentId, university, major, expiresAt } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const user = await User.findById(req.user._id);
    user.studentCard = {
      studentId,
      university,
      major,
      expiresAt,
      imageUrl,
      verified: false,
    };
    await user.save();

    res.json({
      message: "Student card submitted and pending verification.",
      studentCard: user.studentCard,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting student card" });
  }
};

export const deleteStudentCard = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { studentCard: 1 } });
    res.json({ message: "Student card removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing student card" });
  }
};

// ==========================================
// 3. HÀNH KHÁCH THƯỜNG DÙNG (PASSENGERS)
// ==========================================
export const getPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    res.json(passengers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching passengers" });
  }
};

export const addPassenger = async (req, res) => {
  try {
    const passenger = new Passenger({ ...req.body, user: req.user._id });
    await passenger.save();
    res.status(201).json(passenger);
  } catch (error) {
    res.status(400).json({ message: "Error adding passenger" });
  }
};

export const updatePassenger = async (req, res) => {
  try {
    const passenger = await Passenger.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { returnDocument: "after" }, // ĐÃ SỬA WARNING
    );
    res.json(passenger);
  } catch (error) {
    res.status(400).json({ message: "Error updating passenger" });
  }
};

export const deletePassenger = async (req, res) => {
  try {
    await Passenger.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: "Passenger removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing passenger" });
  }
};

export const setDefaultPassenger = async (req, res) => {
  try {
    // Hủy default cũ
    await Passenger.updateMany({ user: req.user._id }, { isDefault: false });
    // Set default mới
    const passenger = await Passenger.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { returnDocument: "after" }, // ĐÃ SỬA WARNING
    );
    res.json(passenger);
  } catch (error) {
    res.status(500).json({ message: "Error setting default passenger" });
  }
};

// ==========================================
// 4. GIAO DỊCH, CÀI ĐẶT & TÍCH LŨY
// ==========================================
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

export const updateNotifications = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notifications: req.body },
      { returnDocument: "after" }, // ĐÃ SỬA WARNING
    ).select("notifications");
    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: "Error updating notifications" });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("loginHistory");
    // Trả về 10 lần gần nhất
    res.json(user.loginHistory.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: "Error fetching login history" });
  }
};

export const getLoyaltyInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("loyaltyPoints");
    const history = await Transaction.find({
      user: req.user._id,
      type: { $in: ["loyalty_earn", "loyalty_redeem"] },
    }).sort({ createdAt: -1 });

    res.json({ points: user.loyaltyPoints, history });
  } catch (error) {
    res.status(500).json({ message: "Error fetching loyalty info" });
  }
};

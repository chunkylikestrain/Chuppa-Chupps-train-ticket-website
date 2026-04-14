import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ==========================================
// 1. API ĐĂNG KÝ TÀI KHOẢN (REGISTER)
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // B1: Kiểm tra xem email đã tồn tại trong DB chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được sử dụng!" });
    }

    // B2: Băm (Mã hóa) mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // B3: Tạo user mới với mật khẩu đã mã hóa
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword, // Lưu chuỗi đã băm, KHÔNG lưu mật khẩu gốc
    });

    // B4: Lưu vào MongoDB
    await newUser.save();

    res
      .status(201)
      .json({ message: "Account created successfully! You can login now." });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// ==========================================
// 2. API ĐĂNG NHẬP (LOGIN)

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // B1: Tìm user trong DB bằng email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or Password may incorrect!" });
    }

    // B2: So sánh mật khẩu gốc với mật khẩu đã băm trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password may incorrect!" });
    }

    // B3: Tạo thẻ thông hành JWT (JSON Web Token)
    const token = jwt.sign(
      { userId: user._id }, // Dữ liệu nhét vào token (Payload)
      process.env.JWT_SECRET, // Chìa khóa bí mật
      { expiresIn: "7d" }, // Token sống được 7 ngày
    );

    // B4: Trả về cho Frontend
    res.status(200).json({
      message: "Login successfully!",
      token: token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "error server!" });
  }
});

export default router;

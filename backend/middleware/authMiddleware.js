import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Khóa thứ nhất: Kiểm tra xem người dùng đã đăng nhập chưa (có Token không)
export const protect = async (req, res, next) => {
  let token;

  // Frontend sẽ gửi token lên qua Headers với cú pháp: "Bearer <chuỗi_token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Lấy token bỏ chữ Bearer

      // Giải mã token bằng chìa khóa bí mật
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB và gán vào req.user (không lấy mật khẩu)
      req.user = await User.findById(decoded.userId).select("-password");
      next(); // Cho phép đi tiếp
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Unauthorized, token failed!" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token!" });
  }
};

// 2. Khóa thứ hai: Kiểm tra xem user có phải là Admin không
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Là Admin -> Mời anh vào
  } else {
    res
      .status(403)
      .json({ message: "Access denied! Admin privileges required." }); // Là User -> Đuổi ra
  }
};

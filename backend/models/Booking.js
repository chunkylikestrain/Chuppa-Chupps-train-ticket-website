import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // 1. Người mua (Liên kết tới bảng User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Tham chiếu đến model User
    },
    // 2. Chuyến tàu (Liên kết tới bảng Train)
    train: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Train", // Tham chiếu đến model Train
    },
    // 3. Danh sách ghế
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    // 4. Thông tin chi tiết từng hành khách
    passengers: [
      {
        fullName: { type: String, required: true },
        idCard: { type: String },
        ticketType: {
          type: String,
          enum: ["adult", "student", "child", "senior"], // Đã bổ sung 'student'
          default: "adult",
        },
      },
    ],
    // 5. Tổng tiền thanh toán
    totalPrice: {
      type: Number,
      required: true,
    },
    // 6. Trạng thái đơn hàng
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending", // Mặc định khi vừa tạo là chờ thanh toán
    },
    // 7. Mã vé tự sinh (Ví dụ: VE-A8B9X2)
    bookingCode: {
      type: String,
      unique: true,
    },
    journeyDetails: {
      fromStation: String,
      toStation: String,
      travelDate: String,
      departureTime: String,
      arrivalTime: String,
      trainCode: String,
    },
  },
  {
    timestamps: true, // Tự động có createdAt và updatedAt
  },
);

// ==========================================
// Mongoose Pre-save Hook: Tự động sinh mã vé
// ==========================================
bookingSchema.pre("save", async function () {
  if (this.isNew && !this.bookingCode) {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingCode = `VE-${randomStr}`;
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

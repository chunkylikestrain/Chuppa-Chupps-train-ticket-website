import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Kết nối tới MongoDB thông qua biến môi trường
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🟢 MongoDB đã kết nối thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`🔴 Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Dừng server nếu không kết nối được DB
  }
};

export default connectDB;

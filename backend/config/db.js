import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Kết nối tới MongoDB thông qua biến môi trường
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `🟢 MongoDB has successfully connected: ${conn.connection.host}`,
    );
  } catch (error) {
    console.error(`🔴 MongoDB connection error: ${error.message}`);
    process.exit(1); // Dừng server nếu không kết nối được DB
  }
};

export default connectDB;

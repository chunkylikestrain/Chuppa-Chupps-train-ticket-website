import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Đảm bảo không có 2 ga trùng tên
  },
});

const Station = mongoose.model("Station", stationSchema);
export default Station;

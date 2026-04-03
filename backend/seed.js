import mongoose from "mongoose";
import dotenv from "dotenv";
import Station from "./models/Station.js";

// Nạp biến môi trường để lấy chuỗi kết nối Database
dotenv.config();

// Danh sách các ga tàu lớn và phổ biến thực tế ở Ba Lan
const polishStations = [
  { name: "Warszawa Centralna" },
  { name: "Warszawa Zachodnia" },
  { name: "Warszawa Wschodnia" },
  { name: "Kraków Główny" },
  { name: "Gdańsk Główny" },
  { name: "Wrocław Główny" },
  { name: "Poznań Główny" },
  { name: "Katowice" },
  { name: "Łódź Fabryczna" },
  { name: "Łódź Widzew" },
  { name: "Szczecin Główny" },
  { name: "Rzeszów Główny" },
  { name: "Lublin Główny" },
  { name: "Białystok" },
  { name: "Bydgoszcz Główna" },
  { name: "Toruń Główny" },
  { name: "Gdynia Główna" },
  { name: "Sopot" },
  { name: "Zakopane" },
  { name: "Olsztyn Główny" },
];

// Hàm kết nối và nạp dữ liệu
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "🟢 The database has been connected to allow data injection...",
    );

    // Xóa sạch dữ liệu cũ (nếu có) để tránh lỗi trùng lặp
    await Station.deleteMany();
    console.log("🧹 The old station list has been cleaned up.");

    // Bơm dữ liệu mới vào
    await Station.insertMany(polishStations);
    console.log(
      "✅ The list of Polish train stations has been successfully uploaded to the database!",
    );

    process.exit(); // Tự động thoát Terminal khi xong
  } catch (error) {
    console.error("🔴 Error during data pumping:", error);
    process.exit(1);
  }
};

seedData();

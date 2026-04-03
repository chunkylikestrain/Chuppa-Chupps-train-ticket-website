import mongoose from "mongoose";
import dotenv from "dotenv";
import Train from "./models/Train.js";

dotenv.config();

// Dữ liệu giả lập các chuyến tàu (Sử dụng ngày 2026-04-25 làm mốc test)
const dummyTrains = [
  // TUYẾN 1: Warszawa -> Kraków
  {
    trainNumber: "3104",
    type: "EIP",
    fromStation: "Warszawa Centralna",
    toStation: "Kraków Główny",
    departureTime: "08:15",
    arrivalTime: "10:45",
    duration: "2h 30m",
    price: 169.0,
    travelDate: "2026-04-25",
  },
  {
    trainNumber: "1312",
    type: "EIC",
    fromStation: "Warszawa Centralna",
    toStation: "Kraków Główny",
    departureTime: "10:30",
    arrivalTime: "13:10",
    duration: "2h 40m",
    price: 139.0,
    travelDate: "2026-04-25",
  },
  {
    trainNumber: "38100",
    type: "TLK",
    fromStation: "Warszawa Centralna",
    toStation: "Kraków Główny",
    departureTime: "12:05",
    arrivalTime: "15:20",
    duration: "3h 15m",
    price: 68.0,
    travelDate: "2026-04-25",
  },

  // TUYẾN 2: Gdańsk -> Warszawa
  {
    trainNumber: "5300",
    type: "EIP",
    fromStation: "Gdańsk Główny",
    toStation: "Warszawa Centralna",
    departureTime: "07:00",
    arrivalTime: "09:45",
    duration: "2h 45m",
    price: 180.0,
    travelDate: "2026-04-25",
  },
  {
    trainNumber: "5320",
    type: "IC",
    fromStation: "Gdańsk Główny",
    toStation: "Warszawa Centralna",
    departureTime: "11:15",
    arrivalTime: "14:30",
    duration: "3h 15m",
    price: 95.0,
    travelDate: "2026-04-25",
  },
];

const seedTrains = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Connected to DB for seeding trains...");

    // Xóa các chuyến tàu cũ để không bị nhân đôi dữ liệu khi chạy lại
    await Train.deleteMany();
    console.log("🧹 Cleared old train data.");

    // Bơm dữ liệu mới vào CSDL
    await Train.insertMany(dummyTrains);
    console.log("✅ Successfully seeded train data!");

    process.exit();
  } catch (error) {
    console.error("🔴 Error seeding trains:", error);
    process.exit(1);
  }
};

seedTrains();

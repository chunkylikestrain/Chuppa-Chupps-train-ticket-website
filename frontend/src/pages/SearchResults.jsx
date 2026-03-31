import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TrainCard from "../components/ui/TrainCard";
import Button from "../components/ui/Button";

// Dữ liệu giả lập (Sau này sẽ lấy từ Backend API)
const mockTrains = [
  {
    id: 1,
    from: "Warszawa Centralna",
    to: "Kraków Główny",
    departureTime: "08:15",
    arrivalTime: "10:45",
    duration: "2h 30m",
    type: "EIP", // Express InterCity Premium
    trainNumber: "3104",
    price: "169.00",
  },
  {
    id: 2,
    from: "Warszawa Centralna",
    to: "Kraków Główny",
    departureTime: "10:30",
    arrivalTime: "13:10",
    duration: "2h 40m",
    type: "EIC", // Express InterCity
    trainNumber: "1312",
    price: "139.00",
  },
  {
    id: 3,
    from: "Warszawa Centralna",
    to: "Kraków Główny",
    departureTime: "12:05",
    arrivalTime: "15:20",
    duration: "3h 15m",
    type: "TLK", // Twoje Linie Kolejowe (Tàu chậm/rẻ)
    trainNumber: "38100",
    price: "68.00",
  },
];

const SearchResults = () => {
  // 1. Dùng useLocation để lấy dữ liệu được truyền sang từ trang Home
  const location = useLocation();
  const searchData = location.state || {};
  const navigate = useNavigate();

  // 2. Gán giá trị, nếu người dùng vào thẳng link /results thì dùng giá trị mặc định
  const displayFrom = searchData.fromStation || "Warszawa Centralna";
  const displayTo = searchData.toStation || "Kraków Główny";
  const displayDate = searchData.travelDate || "2026-03-25";
  const handleChooseTrain = (train) => {
    // Chuyển sang trang Chọn Ghế và gửi kèm dữ liệu chuyến tàu
    navigate("/seat-selection", {
      state: {
        selectedTrain: train,
        displayFrom,
        displayTo,
        displayDate,
      },
    });
  };

  return (
    <div className="min-h-screen bg-chuppaGray font-sans flex flex-col">
      {/* HEADER ĐƠN GIẢN CỦA TRANG KẾT QUẢ */}
      <header className="bg-chuppaGreen-dark text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-white hover:text-yellow-300 transition-colors font-medium flex items-center gap-2"
          >
            ← Edit search
          </Link>
          <div className="text-2xl font-black italic tracking-tighter">
            ChuppaChup{" "}
            <span className="text-yellow-400 font-sans not-italic text-lg ml-1">
              Train
            </span>
          </div>
        </div>
      </header>

      {/* THANH TÓM TẮT HÀNH TRÌNH (Đã được làm động) */}
      <div className="bg-chuppaGreen py-6 shadow-inner">
        <div className="max-w-5xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-4 uppercase">
            {displayFrom} <span className="text-yellow-400 text-2xl">➔</span>{" "}
            {displayTo}
          </h1>
          <p className="mt-2 text-chuppaGreen-light font-medium">
            {displayDate} • 1 Passenger
          </p>
        </div>
      </div>

      {/* DANH SÁCH CHUYẾN TÀU */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        {/* Bộ lọc đơn giản */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Found <span className="text-chuppaGreen">{mockTrains.length}</span>{" "}
            connections
          </h2>
          <select className="border-gray-300 rounded-lg text-sm focus:ring-chuppaGreen focus:border-chuppaGreen p-2 shadow-sm outline-none">
            <option>Sort by: Departure time</option>
            <option>Sort by: Lowest price</option>
            <option>Sort by: Shortest duration</option>
          </select>
        </div>

        {/* Render danh sách TrainCard từ mảng mockTrains */}
        <div className="space-y-4">
          {mockTrains.map((train) => (
            <TrainCard
              key={train.id}
              train={train}
              // Truyền hàm callback khi nút được bấm
              onChoose={() => handleChooseTrain(train)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;

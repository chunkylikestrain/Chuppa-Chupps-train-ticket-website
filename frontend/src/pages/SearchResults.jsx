import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Đừng quên import axios
import TrainCard from "../components/ui/TrainCard";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};

  // 1. Lấy dữ liệu từ trang Home gửi sang
  const displayFrom = searchData.fromStation || "Warszawa Centralna";
  const displayTo = searchData.toStation || "Kraków Główny";
  const displayDate = searchData.travelDate || "2026-04-25";

  // 2. Tạo các State để quản lý dữ liệu từ Backend
  const [trains, setTrains] = useState([]); // Lưu danh sách chuyến tàu
  const [isLoading, setIsLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Trạng thái lỗi

  // 3. Gọi API khi trang vừa tải lên hoặc khi Ga đi/Ga đến thay đổi
  useEffect(() => {
    const fetchTrains = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Gọi API Backend, truyền param from, to, date vào URL
        const response = await axios.get(
          `http://localhost:5000/api/trains/search`,
          {
            params: {
              from: displayFrom,
              to: displayTo,
              date: displayDate,
            },
          },
        );

        // Cập nhật State bằng dữ liệu thật từ Database
        setTrains(response.data);
      } catch (err) {
        console.error("Lỗi khi tải chuyến tàu:", err);
        setError("Failed to fetch trains. Please try again later.");
      } finally {
        setIsLoading(false); // Tắt hiệu ứng loading dù thành công hay thất bại
      }
    };

    fetchTrains();
  }, [displayFrom, displayTo, displayDate]);

  // 4. Hàm xử lý khi chọn chuyến tàu
  const handleChooseTrain = (train) => {
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
      {/* HEADER */}
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

      {/* THANH TÓM TẮT HÀNH TRÌNH */}
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
        {/* Bộ lọc */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isLoading ? (
              <span>Searching connections...</span>
            ) : (
              <span>
                Found <span className="text-chuppaGreen">{trains.length}</span>{" "}
                connections
              </span>
            )}
          </h2>
          <select className="border-gray-300 rounded-lg text-sm focus:ring-chuppaGreen focus:border-chuppaGreen p-2 shadow-sm outline-none bg-white">
            <option>Sort by: Departure time</option>
            <option>Sort by: Lowest price</option>
            <option>Sort by: Shortest duration</option>
          </select>
        </div>

        {/* HIỂN THỊ TRẠNG THÁI (Loading / Lỗi / Dữ liệu / Trống) */}
        <div className="space-y-4">
          {/* Đang tải */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-chuppaGreen border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500 font-medium">
                Loading trains from database...
              </p>
            </div>
          )}

          {/* Báo lỗi mạng */}
          {!isLoading && error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
              <span className="text-2xl block mb-2">⚠️</span>
              {error}
            </div>
          )}

          {/* Không có dữ liệu */}
          {!isLoading && !error && trains.length === 0 && (
            <div className="bg-white p-8 rounded-xl text-center border border-gray-200 shadow-sm">
              <span className="text-4xl block mb-4">🛤️</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No trains found
              </h3>
              <p className="text-gray-500">
                We couldn't find any trains matching your search. Please try
                changing the date or stations.
              </p>
              <Link to="/">
                <button className="mt-4 bg-chuppaGreen text-white px-6 py-2 rounded-lg font-bold hover:bg-chuppaGreen-dark transition-colors">
                  Search again
                </button>
              </Link>
            </div>
          )}

          {/* Render danh sách chuyến tàu từ Database */}
          {!isLoading &&
            !error &&
            trains.map((train) => (
              <TrainCard
                key={train._id}
                // Map lại 2 trường fromStation/toStation từ Backend để Component TrainCard hiểu được
                train={{
                  ...train,
                  from: train.fromStation,
                  to: train.toStation,
                }}
                onChoose={() => handleChooseTrain(train)}
              />
            ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;

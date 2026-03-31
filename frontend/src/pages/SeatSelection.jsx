import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";

// 1. Dữ liệu giả lập sơ đồ ghế cho một toa tàu (20 ghế)
const initialSeatsData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  number: (i + 1).toString().padStart(2, "0"),
  status: Math.random() < 0.3 ? "occupied" : "available",
}));

const SeatSelection = () => {
  // 2. Setup Routing & State
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};
  const train = bookingData.selectedTrain || {};

  const [selectedSeats, setSelectedSeats] = useState([]);

  // 3. Hàm xử lý click
  const handleSeatClick = (seat) => {
    if (seat.status === "occupied") return;

    setSelectedSeats((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      } else {
        return [...prev, seat.id];
      }
    });
  };

  const totalPrice = (
    selectedSeats.length * parseFloat(train.price || 0)
  ).toFixed(2);

  // 4. Lấy màu ghế
  const getSeatColor = (seat) => {
    if (seat.status === "occupied") return "bg-gray-300 cursor-not-allowed";
    if (selectedSeats.includes(seat.id))
      return "bg-chuppaGreen text-white shadow-md scale-105";
    return "bg-white border-2 border-chuppaGreen hover:bg-chuppaGreen/10";
  };

  // Chia ghế thành 2 hàng (Top và Bottom)
  const topRowSeats = initialSeatsData.slice(0, 10);
  const bottomRowSeats = initialSeatsData.slice(10, 20);

  return (
    <div className="min-h-screen bg-chuppaGray font-sans flex flex-col">
      {/* HEADER */}
      <header className="bg-chuppaGreen-dark text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/results"
            className="text-white hover:text-yellow-300 transition-colors font-medium flex items-center gap-2"
          >
            ← Back to results
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wide">
              {bookingData.displayFrom} ➔ {bookingData.displayTo}
            </h1>
            <p className="text-xs text-chuppaGreen-light uppercase font-bold tracking-widest mt-0.5">
              {bookingData.displayDate} • {train.type} {train.trainNumber} •{" "}
              {train.price} PLN/Seat
            </p>
          </div>
          <div className="text-2xl font-black italic tracking-tighter invisible">
            ChuppaChup Train
          </div>
        </div>
      </header>

      {/* CHÍNH */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 flex flex-col xl:flex-row gap-8">
        {/* NỬA TRÁI: Sơ đồ ghế (Coach layout - Chiều ngang) */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 relative overflow-x-auto">
          <div className="text-center mb-8 border-b pb-4 min-w-[600px]">
            <span className="bg-chuppaGray text-chuppaGreen-dark font-bold px-5 py-2 rounded-full shadow-inner border border-chuppaGreen/20">
              COACH 5 (2ND CLASS) - 20 SEATS
            </span>
          </div>

          {/* Hình dáng toa tàu xoay ngang */}
          <div className="relative border-4 border-chuppaGreen-light rounded-l-3xl rounded-r-3xl py-12 px-16 bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)_inset] min-w-[700px] mx-auto">
            {/* Cửa trái */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-32 bg-chuppaGreen-dark rounded-r-lg flex items-center justify-center">
              <span className="text-xs text-white font-black -rotate-90 whitespace-nowrap">
                ENTRANCE
              </span>
            </div>

            {/* Cửa phải (WC/Exit) */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-32 bg-chuppaGreen-dark rounded-l-lg flex items-center justify-center">
              <span className="text-xs text-white font-black -rotate-90 whitespace-nowrap">
                WC / EXIT
              </span>
            </div>

            {/* SƠ ĐỒ GHẾ CHIỀU NGANG */}
            <div className="flex flex-col gap-12">
              {/* Hàng trên (Top Row) */}
              <div className="flex justify-between gap-4">
                {topRowSeats.map((seat) => (
                  <div
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    className={`relative flex items-center justify-center h-12 w-12 rounded-lg font-bold text-gray-700 transition-all cursor-pointer ${getSeatColor(
                      seat,
                    )}`}
                  >
                    {seat.number}
                    <span className="absolute bottom-0.5 right-1 text-[8px] opacity-70">
                      W
                    </span>
                  </div>
                ))}
              </div>

              {/* Lối đi ở giữa ngầm hiểu (Khoảng cách gap-12 ở trên tạo ra lối đi này) */}
              {/* Thêm một đường đứt nét mờ để chỉ thị lối đi */}
              <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-200"></div>

              {/* Hàng dưới (Bottom Row) */}
              <div className="flex justify-between gap-4">
                {bottomRowSeats.map((seat) => (
                  <div
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    className={`relative flex items-center justify-center h-12 w-12 rounded-lg font-bold text-gray-700 transition-all cursor-pointer ${getSeatColor(
                      seat,
                    )}`}
                  >
                    {seat.number}
                    <span className="absolute top-0.5 right-1 text-[8px] opacity-70">
                      A
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NỬA PHẢI: Tóm tắt (Giữ nguyên) */}
        <aside className="w-full xl:w-96 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28 z-40">
            <div className="mb-6 flex items-center gap-3 text-chuppaGreen-dark">
              🎫{" "}
              <h2 className="text-xl font-bold text-gray-800">
                Booking Summary
              </h2>
            </div>

            <div className="flex gap-4 text-xs font-medium text-gray-600 mb-6 bg-chuppaGray p-3 rounded-lg border">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded border-2 border-chuppaGreen bg-white"></div>{" "}
                Available
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-chuppaGreen"></div>{" "}
                Selected
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-gray-300"></div> Occupied
              </div>
            </div>

            <div className="space-y-4 border-t pt-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">
                  Selected Seats:
                </span>
                <span className="text-chuppaGreen font-bold text-base">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Passengers:</span>
                <span className="text-gray-800 font-bold">
                  {selectedSeats.length}
                </span>
              </div>

              <div className="border-t pt-4 mt-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    Total Price:
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-chuppaGreen">
                      {totalPrice} PLN
                    </span>
                    <p className="text-xs text-gray-400">Including VAT</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  variant="primary"
                  fullWidth
                  className={
                    selectedSeats.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  onClick={() => {
                    if (selectedSeats.length > 0) {
                      navigate("/checkout", {
                        state: {
                          ...bookingData,
                          selectedSeats: selectedSeats,
                          totalPrice: totalPrice,
                        },
                      });
                    }
                  }}
                >
                  Continue to Payment →
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default SeatSelection;

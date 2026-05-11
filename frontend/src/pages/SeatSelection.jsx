// Path: src/pages/SeatSelection.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Info, Loader2 } from "lucide-react";
import Button from "../components/ui/Button";

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedSchedule, searchParams } = location.state || {};
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeCarriageIdx, setActiveCarriageIdx] = useState(0);

  // --- THÊM STATE ĐỂ GIẢI QUYẾT BUG 1 ---
  const [freshInventory, setFreshInventory] = useState(null);
  const [isFetchingSeats, setIsFetchingSeats] = useState(true);

  useEffect(() => {
    if (!selectedSchedule) {
      navigate("/");
      return;
    }

    // FETCH REALTIME SEAT INVENTORY
    const fetchFreshSeats = async () => {
      setIsFetchingSeats(true);
      try {
        const scheduleId = selectedSchedule.scheduleId || selectedSchedule._id;
        const res = await axios.get(
          `http://localhost:5000/api/public/schedules/${scheduleId}`,
        );
        setFreshInventory(res.data.seatInventory);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ghế mới nhất:", error);
        // Fallback dùng dữ liệu cũ nếu lỗi mạng
        setFreshInventory(selectedSchedule.seatInventory);
      } finally {
        setIsFetchingSeats(false);
      }
    };

    fetchFreshSeats();
  }, [selectedSchedule, navigate]);

  if (!selectedSchedule) return null;

  const inventory = freshInventory || selectedSchedule.seatInventory;
  const currentCarriage = inventory ? inventory[activeCarriageIdx] : null;

  const formatType = (type) => {
    const types = {
      soft_seat: "Soft Seat",
      hard_seat: "Hard Seat",
      soft_sleeper: "Soft Sleeper",
      hard_sleeper: "Hard Sleeper",
      vip: "VIP Cabin",
    };
    return types[type] || type;
  };

  const getPriceForCarriage = (seatType) => {
    const pricing = selectedSchedule.pricings?.find(
      (p) => p.seatType === seatType && p.passengerType === "adult",
    );
    return pricing ? pricing.price : selectedSchedule.basePrice;
  };

  const currentPrice = currentCarriage
    ? getPriceForCarriage(currentCarriage.type)
    : 0;

  const cols = ["A", "B", "C", "D"];
  const numRows = currentCarriage
    ? Math.ceil(currentCarriage.totalSeats / 4)
    : 0;
  const rows = Array.from({ length: numRows }, (_, i) => i + 1);

  const handleSeatClick = (seatId) => {
    if (!currentCarriage) return;
    const globalSeatId = `${currentCarriage.carriageNumber}-${seatId}`;
    const displayId = `Carriage ${currentCarriage.carriageNumber} - ${seatId}`;

    if (selectedSeats.find((s) => s.id === globalSeatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== globalSeatId));
    } else {
      const maxPassengers = parseInt(searchParams?.passengers || 1);
      if (selectedSeats.length < maxPassengers) {
        setSelectedSeats([
          ...selectedSeats,
          { id: globalSeatId, display: displayId, price: currentPrice },
        ]);
      } else {
        alert(`You can only select up to ${maxPassengers} seats.`);
      }
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleContinue = () => {
    navigate("/checkout", {
      state: {
        selectedSchedule,
        searchParams,
        selectedSeats: selectedSeats.map((s) => s.display),
        totalPrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <div className="bg-slate-900 text-white py-6 px-4 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Select Your Seats</h1>
            <p className="text-sm text-slate-400">
              {selectedSchedule.fromStation} ➔ {selectedSchedule.toStation} |{" "}
              {selectedSchedule.travelDate}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* TRẠNG THÁI LOADING */}
          {isFetchingSeats ? (
            <div className="bg-white rounded-xl border border-slate-200 p-20 flex flex-col items-center justify-center">
              <Loader2
                size={48}
                className="text-chuppaGreen animate-spin mb-4"
              />
              <p className="text-slate-500 font-medium">
                Checking live seat availability...
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-4">
                {inventory.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCarriageIdx(idx)}
                    className={`shrink-0 px-4 py-3 rounded-xl border-2 font-bold text-sm text-left transition-all ${
                      activeCarriageIdx === idx
                        ? "border-chuppaGreen bg-chuppaGreen/5 text-chuppaGreen"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-medium text-slate-400">
                      Carriage {c.carriageNumber}
                    </div>
                    <div>{formatType(c.type)}</div>
                    <div className="text-xs mt-1 text-slate-800">
                      {getPriceForCarriage(c.type)} PLN
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-slate-800 text-lg">
                    Carriage {currentCarriage.carriageNumber} Map
                  </h2>
                  <div className="flex gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-slate-100 border border-slate-300"></div>{" "}
                      Available
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-chuppaGreen"></div>{" "}
                      Selected
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-slate-300"></div>{" "}
                      Booked
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center overflow-x-auto">
                  {rows.map((row) => (
                    <div key={row} className="flex gap-2 sm:gap-6 mb-3">
                      {cols.map((col, idx) => {
                        const seatNumber = (row - 1) * 4 + idx + 1;
                        if (seatNumber > currentCarriage.totalSeats)
                          return <div key={col} className="w-10 sm:w-12"></div>;

                        const seatId = `${row}${col}`;
                        const globalSeatId = `${currentCarriage.carriageNumber}-${seatId}`;
                        const displayId = `Carriage ${currentCarriage.carriageNumber} - ${seatId}`;

                        const safeBookedList =
                          currentCarriage.bookedSeats || [];
                        const isBooked =
                          safeBookedList.includes(seatId) ||
                          safeBookedList.includes(globalSeatId) ||
                          safeBookedList.includes(displayId);
                        const isSelected = selectedSeats.find(
                          (s) => s.id === globalSeatId,
                        );
                        const isAisle = idx === 1;

                        return (
                          <React.Fragment key={seatId}>
                            <button
                              disabled={isBooked}
                              onClick={() => handleSeatClick(seatId)}
                              title={`${formatType(currentCarriage.type)} - ${currentPrice} PLN`}
                              className={`w-10 h-12 sm:w-12 sm:h-14 rounded-t-lg rounded-b-sm border-2 flex items-center justify-center text-xs font-bold transition-all ${
                                isBooked
                                  ? "bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed"
                                  : isSelected
                                    ? "bg-chuppaGreen border-chuppaGreen text-white shadow-md transform -translate-y-1"
                                    : "bg-white border-slate-300 text-slate-600 hover:border-chuppaGreen hover:text-chuppaGreen"
                              }`}
                            >
                              {seatId}
                            </button>
                            {isAisle && (
                              <div className="w-6 sm:w-10 flex items-center justify-center text-[10px] text-slate-300 font-bold">
                                {row}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-slate-800 text-lg mb-4">
              Journey Summary
            </h2>
            <div className="space-y-3 border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Train</span>
                <span className="font-bold text-slate-800">
                  {selectedSchedule.trainCode}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Seats Selected</span>
                <div className="text-right">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((s) => (
                      <div
                        key={s.id}
                        className="font-bold text-slate-800 text-xs mb-1"
                      >
                        {s.display}{" "}
                        <span className="text-chuppaGreen">
                          ({s.price} PLN)
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="font-bold text-slate-800">None</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Total Price
              </span>
              <span className="text-3xl font-black text-chuppaGreen">
                {totalPrice} PLN
              </span>
            </div>

            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg flex items-start gap-2 text-xs font-medium mb-6 border border-blue-100">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>
                You need to select exactly {searchParams?.passengers || 1}{" "}
                seat(s) to proceed to checkout.
              </p>
            </div>

            <Button
              fullWidth
              disabled={
                isFetchingSeats ||
                selectedSeats.length !== parseInt(searchParams?.passengers || 1)
              }
              onClick={handleContinue}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;

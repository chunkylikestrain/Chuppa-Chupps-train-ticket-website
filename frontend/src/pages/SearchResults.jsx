// src/pages/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Clock,
  Armchair,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {}; // Dữ liệu từ trang Home truyền sang

  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        // Gọi API Public mới tạo, truyền parameters tìm kiếm
        const response = await axios.get(
          "http://localhost:5000/api/public/search",
          {
            params: {
              from: searchParams.from,
              to: searchParams.to,
              date: searchParams.date,
            },
          },
        );
        setSchedules(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (searchParams.from && searchParams.to) {
      fetchSchedules();
    } else {
      // Nếu không có thông tin tìm kiếm, đá về trang chủ
      navigate("/");
    }
  }, [searchParams, navigate]);

  const handleSelectSchedule = (schedule) => {
    // Chuyển dữ liệu lịch chạy sang trang Chọn ghế
    navigate("/seat-selection", {
      state: { selectedSchedule: schedule, searchParams },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* HEADER TÌM KIẾM (Thu gọn) */}
      <div className="bg-slate-900 text-white py-8 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-lg font-bold">
            <span className="flex items-center gap-1">
              <MapPin size={20} className="text-chuppaGreen" />{" "}
              {searchParams.from}
            </span>
            <span className="text-slate-500">➔</span>
            <span className="flex items-center gap-1">
              <MapPin size={20} className="text-chuppaGreen" />{" "}
              {searchParams.to}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {searchParams.date}
            </span>
            <span className="flex items-center gap-1">
              <Armchair size={16} /> {searchParams.passengers} Passengers
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-bold text-chuppaGreen hover:underline"
          >
            Modify Search
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Available Journeys
        </h2>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-xl border border-slate-200">
            <Loader2 size={40} className="animate-spin mb-4 text-chuppaGreen" />
            <p>Searching for the best schedules...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3 border border-red-200">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!isLoading && !error && schedules.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No trains found
            </h3>
            <p className="text-slate-500">
              We couldn't find any trains matching your search criteria for this
              date.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-chuppaGreen text-white font-bold py-2 px-6 rounded-lg"
            >
              Try Another Date
            </button>
          </div>
        )}

        {!isLoading && !error && schedules.length > 0 && (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.scheduleId}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row"
              >
                {/* Cột Trái: Thời gian & Ga */}
                <div className="p-6 flex-1 flex items-center gap-6 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">
                      {schedule.departureTime}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {schedule.fromStation}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col items-center relative px-4">
                    <span className="text-xs font-bold text-slate-400 mb-1">
                      {schedule.duration}
                    </span>
                    <div className="w-full h-px bg-slate-300 relative">
                      <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-slate-300 -translate-y-1/2"></div>
                      <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-slate-300 -translate-y-1/2"></div>
                    </div>
                    {schedule.delayMinutes > 0 && (
                      <span className="text-[10px] font-bold text-red-500 mt-1 uppercase">
                        Delayed {schedule.delayMinutes} min
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">
                      {schedule.arrivalTime}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {schedule.toStation}
                    </p>
                  </div>
                </div>

                {/* Cột Phải: Giá & Đặt vé */}
                <div className="p-6 sm:w-64 flex flex-col justify-center items-center bg-slate-50 relative">
                  <div className="absolute top-4 right-4">
                    <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-slate-300">
                      {schedule.trainCode}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 mt-4">
                    From
                  </p>
                  <p className="text-3xl font-black text-chuppaGreen mb-1">
                    {schedule.basePrice === 0
                      ? "TBA"
                      : `${schedule.basePrice} PLN`}
                  </p>

                  <p
                    className={`text-xs font-medium mb-4 ${schedule.availableSeats > 10 ? "text-green-600" : "text-red-500"}`}
                  >
                    {schedule.availableSeats > 0
                      ? `${schedule.availableSeats} seats available`
                      : "Sold Out"}
                  </p>

                  <button
                    onClick={() => handleSelectSchedule(schedule)}
                    disabled={schedule.availableSeats === 0}
                    className="w-full bg-chuppaGreen hover:bg-chuppaGreen-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Select Seats <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;

/* eslint-disable no-unused-vars */
// Path: src/pages/account/MyTicketsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Printer,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import axios from "axios";

const MyTicketsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming', 'past', 'cancelled'

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setIsLoading(true);
    try {
      // 1. Lấy token từ bộ nhớ
      const token = localStorage.getItem("token");

      // 2. Gắn token vào header
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 3. Gọi API với config đã gắn token
      const res = await axios.get(
        "http://localhost:5000/api/bookings/my-bookings",
        config,
      );

      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== LOGIC HỦY VÉ ==================
  const handleCancelTicket = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this ticket? Refund policies will apply.",
      )
    ) {
      try {
        await axiosInstance.patch(`/api/bookings/${id}/status`, {
          status: "cancelled",
        });
        alert("Ticket cancelled successfully.");
        fetchMyBookings(); // Tải lại danh sách
      } catch (error) {
        alert("Failed to cancel ticket. Please contact support.");
      }
    }
  };

  // ================== LOGIC LỌC TAB ==================
  const filterBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      if (booking.status === "cancelled" || booking.status === "pending") {
        return activeTab === "cancelled";
      }

      // Ưu tiên dùng journeyDetails (vé mới), nếu không có thì dùng train (vé cũ)
      const journey = booking.journeyDetails || booking.train;

      if (journey && journey.travelDate) {
        const travelDate = new Date(journey.travelDate);
        if (activeTab === "upcoming") {
          return travelDate >= today;
        } else if (activeTab === "past") {
          return travelDate < today;
        }
      }
      return false;
    });
  };

  const displayedBookings = filterBookings();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Ticket className="text-indigo-600" /> My Tickets
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your upcoming journeys and view past trips.
        </p>
      </div>

      {/* TABS NATIVE ĐIỀU HƯỚNG */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "upcoming" ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          Upcoming Journeys
          {activeTab === "upcoming" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "past" ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          Past Trips
          {activeTab === "past" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "cancelled" ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          Cancelled / Pending
          {activeTab === "cancelled" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* HIỂN THỊ DANH SÁCH VÉ */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400">
          <Loader2
            className="animate-spin mx-auto mb-4 text-indigo-600"
            size={32}
          />
          <p>Loading your tickets...</p>
        </div>
      ) : displayedBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500">
          <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            No tickets found
          </h3>
          <p className="text-sm mb-4">
            You don't have any {activeTab} journeys at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((booking) => {
            // Xác định nguồn dữ liệu để hiển thị (tương thích ngược)
            const journey = booking.journeyDetails || booking.train;

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
              >
                {/* PHẦN TRÁI: INFO CHUYẾN ĐI */}
                <div className="p-6 flex-1 relative border-b md:border-b-0 md:border-r border-slate-100 border-dashed">
                  {/* Badge trạng thái */}
                  <div className="absolute top-4 right-6">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                    Booking #{booking.bookingCode}
                  </p>

                  {journey ? (
                    <>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <p className="text-lg font-black text-slate-800">
                            {journey.fromStation}
                          </p>
                        </div>
                        <div className="px-4 text-slate-300">➔</div>
                        <div className="flex-1 text-right">
                          <p className="text-lg font-black text-slate-800">
                            {journey.toStation}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={16} className="text-indigo-500" />
                          <span className="font-medium">
                            {journey.travelDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={16} className="text-indigo-500" />
                          <span className="font-medium">
                            {journey.departureTime} - {journey.arrivalTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                          <MapPin size={16} className="text-indigo-500" />
                          <span className="font-medium">
                            Train {journey.trainCode || journey.trainNumber}{" "}
                            {journey.type ? `(${journey.type})` : ""} • Seats:{" "}
                            <span className="font-bold text-indigo-700">
                              {booking.seats.join(", ")}
                            </span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-4 text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle size={16} /> Train details are no longer
                      available.
                    </div>
                  )}
                </div>

                {/* PHẦN PHẢI: HÀNH ĐỘNG & GIÁ TIỀN */}
                <div className="p-6 bg-slate-50 md:w-56 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Total Paid
                  </span>
                  <span className="text-2xl font-black text-slate-800 mb-4">
                    {booking.totalPrice} PLN
                  </span>

                  <div className="w-full space-y-2">
                    <button
                      onClick={() => window.print()} // Giả lập chức năng in PDF
                      className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Printer size={16} /> Print Ticket
                    </button>

                    {activeTab === "upcoming" &&
                      booking.status === "confirmed" && (
                        <button
                          onClick={() => handleCancelTicket(booking._id)}
                          className="w-full text-red-500 hover:bg-red-50 font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} /> Cancel Ticket
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;

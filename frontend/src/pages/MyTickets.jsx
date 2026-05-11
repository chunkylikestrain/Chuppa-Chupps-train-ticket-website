import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Ticket,
  MapPin,
  CalendarClock,
  Armchair,
  AlertCircle,
} from "lucide-react";

const MyTickets = () => {
  const navigate = useNavigate();
  // State quản lý danh sách vé, trạng thái loading và lỗi
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API lấy vé ngay khi trang vừa load
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const token = localStorage.getItem("token");

        // Nếu chưa đăng nhập, đá văng về trang Login
        if (!token) {
          navigate("/login");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(
          "http://localhost:5000/api/bookings/my-bookings",
          config,
        );
        setTickets(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your tickets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTickets();
  }, [navigate]);

  // Hàm render màu sắc và icon cho Badge Trạng thái
  const renderStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>{" "}
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-chuppaGray font-sans flex flex-col">
      {/* HEADER TỐI GIẢN */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-gray-600 hover:text-chuppaGreen font-medium transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="text-2xl font-black italic tracking-tighter text-chuppaGreen">
            ChuppaChup{" "}
            <span className="text-gray-700 font-sans not-italic text-lg ml-1">
              Train
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Ticket size={32} className="text-chuppaGreen" />
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            My Tickets
          </h1>
        </div>

        {/* TRẠNG THÁI LOADING */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin inline-block w-10 h-10 border-4 border-chuppaGreen border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 font-medium">
              Loading your journey details...
            </p>
          </div>
        )}

        {/* TRẠNG THÁI LỖI */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center flex flex-col items-center">
            <AlertCircle size={40} className="text-red-500 mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* TRẠNG THÁI TRỐNG (EMPTY STATE) */}
        {!isLoading && !error && tickets.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No tickets found
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't booked any train tickets yet. Let's start a new green
              journey!
            </p>
            <Link to="/">
              <button className="bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Search for Trains
              </button>
            </Link>
          </div>
        )}

        {/* DANH SÁCH VÉ (TICKET CARDS) */}
        {!isLoading && !error && tickets.length > 0 && (
          <div className="space-y-6">
            {tickets.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* PHẦN THÔNG TIN CHÍNH (BÊN TRÁI) */}
                <div className="p-6 flex-1 relative">
                  {/* Dấu chấm đứt giả lập rãnh xé vé */}
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 border-r-2 border-dashed border-gray-200"></div>

                  <div className="flex justify-between items-start mb-4">
                    {renderStatusBadge(booking.status)}
                    <span className="text-sm font-bold text-gray-400">
                      #{booking.bookingCode}
                    </span>
                  </div>

                  {booking.train ? (
                    <>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-chuppaGreen" />
                        {booking.train.fromStation}{" "}
                        <span className="text-gray-400 font-normal">➔</span>{" "}
                        {booking.train.toStation}
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarClock size={16} className="text-gray-400" />
                          <span>
                            <strong className="text-gray-800">
                              {booking.train.travelDate}
                            </strong>
                            <br />
                            {booking.train.departureTime} -{" "}
                            {booking.train.arrivalTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Armchair size={16} className="text-gray-400" />
                          <span>
                            <strong className="text-gray-800">Seats:</strong>{" "}
                            {booking.seats.join(", ")}
                            <br />
                            <span className="text-xs border border-gray-300 px-1 rounded bg-gray-50">
                              {booking.train.type} {booking.train.trainNumber}
                            </span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-red-500 italic">
                      Train details are no longer available.
                    </div>
                  )}
                </div>

                {/* PHẦN CUỐNG VÉ TÓM TẮT (BÊN PHẢI) */}
                <div className="bg-chuppaGreen/5 p-6 md:w-64 flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-gray-100 relative">
                  {/* Hai nửa hình tròn cắt khoét giả lập vé */}
                  <div className="hidden md:block absolute -left-3 top-[-10px] w-6 h-6 bg-chuppaGray rounded-full"></div>
                  <div className="hidden md:block absolute -left-3 bottom-[-10px] w-6 h-6 bg-chuppaGray rounded-full"></div>

                  <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">
                    Total Paid
                  </span>
                  <span className="text-3xl font-black text-chuppaGreen mb-4">
                    {booking.totalPrice} PLN
                  </span>

                  {booking.status === "pending" ? (
                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg transition-colors text-sm">
                      Pay Now
                    </button>
                  ) : (
                    <button className="w-full border-2 border-chuppaGreen text-chuppaGreen hover:bg-chuppaGreen hover:text-white font-bold py-2 rounded-lg transition-colors text-sm">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTickets;

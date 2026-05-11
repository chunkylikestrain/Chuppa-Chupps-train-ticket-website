// src/pages/admin/ManageBookings.jsx
import React, { useState, useEffect } from "react";
import {
  Ticket,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import adminService from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    bookingCode: "",
  });

  // State cho Modal chi tiết (nếu cần xem sâu hơn)
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters.status, filters.from, filters.to]); // Load lại khi đổi bộ lọc chính

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getBookings(filters);
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== LOGIC CẬP NHẬT TRẠNG THÁI ==================
  const handleUpdateStatus = async (id, newStatus) => {
    const confirmMsg =
      newStatus === "confirmed"
        ? "Confirm this booking?"
        : "Are you sure you want to cancel this booking?";

    if (window.confirm(confirmMsg)) {
      try {
        await adminService.updateBookingStatus(id, newStatus);
        // Cập nhật state cục bộ để giao diện đổi ngay
        setBookings(
          bookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
        );
        if (selectedBooking?._id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      } catch (error) {
        console.error("Failed to update booking status", error);
        alert("Action failed. Please try again.");
      }
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Cấu hình các cột cho DataTable
  const columns = [
    {
      key: "bookingCode",
      label: "Code",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.bookingCode}</span>
      ),
    },
    {
      key: "user",
      label: "Customer",
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">
            {row.user?.fullName || "Guest"}
          </div>
          <div className="text-xs text-slate-400">{row.user?.email}</div>
        </div>
      ),
    },
    {
      key: "journey",
      label: "Journey / Train",
      render: (row) => (
        <div className="text-xs">
          <div className="font-bold text-slate-700">
            {row.train?.fromStation} ➔ {row.train?.toStation}
          </div>
          <div className="text-slate-500">
            {row.train?.type} {row.train?.trainNumber} | Seats:{" "}
            {row.seats?.join(", ")}
          </div>
        </div>
      ),
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (row) => (
        <span className="font-black text-chuppaGreen">
          {row.totalPrice} PLN
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const statusMap = {
          confirmed: "bg-green-100 text-green-700 border-green-200",
          pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
          cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${statusMap[row.status]}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Ticket className="text-chuppaGreen" /> Manage Bookings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor and manage all customer ticket purchases.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Booking Code..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-chuppaGreen"
            onChange={(e) =>
              setFilters({ ...filters, bookingCode: e.target.value })
            }
          />
        </div>

        <select
          className="border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-chuppaGreen"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            From:
          </span>
          <input
            type="date"
            className="border border-slate-300 rounded-lg p-2 text-sm outline-none"
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={bookings.filter((b) =>
          b.bookingCode
            .toLowerCase()
            .includes(filters.bookingCode.toLowerCase()),
        )}
        isLoading={isLoading}
        onEdit={handleViewDetail} // Chúng ta dùng nút Edit làm nút "Xem chi tiết"
        emptyMessage="No bookings found matching your criteria."
      />

      {/* MODAL: BOOKING DETAILS */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Booking Details
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Booking Code
                  </p>
                  <p className="font-black text-lg text-chuppaGreen">
                    {selectedBooking.bookingCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </p>
                  <p className="font-bold uppercase text-sm">
                    {selectedBooking.status}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Customer
                  </p>
                  <p className="font-bold text-slate-800">
                    {selectedBooking.user?.fullName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedBooking.user?.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Total Price
                  </p>
                  <p className="font-black text-xl text-slate-900">
                    {selectedBooking.totalPrice} PLN
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">
                  Journey Information
                </p>
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>{selectedBooking.train?.fromStation}</span>
                  <span className="text-chuppaGreen">➔</span>
                  <span>{selectedBooking.train?.toStation}</span>
                </div>
                <p className="text-center text-xs text-slate-500 mt-1">
                  {selectedBooking.train?.travelDate} |{" "}
                  {selectedBooking.train?.departureTime}
                </p>
              </div>

              {/* Passenger List */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Passengers & Seats
                </p>
                <div className="space-y-2">
                  {selectedBooking.passengers?.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b border-slate-50 pb-2"
                    >
                      <span className="font-medium text-slate-700">
                        {p.fullName}
                      </span>
                      <span className="font-bold text-slate-400">
                        Seat: {selectedBooking.seats[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              {selectedBooking.status === "pending" && (
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedBooking._id, "confirmed")
                  }
                  className="flex-1 bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Confirm Order
                </button>
              )}
              {selectedBooking.status !== "cancelled" && (
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedBooking._id, "cancelled")
                  }
                  className="flex-1 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;

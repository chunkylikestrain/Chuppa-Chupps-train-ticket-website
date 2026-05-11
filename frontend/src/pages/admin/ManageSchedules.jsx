// src/pages/admin/ManageSchedules.jsx
import React, { useState, useEffect } from "react";
import { Plus, X, CalendarClock, Filter } from "lucide-react";
import adminService from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dữ liệu Trains và Routes dùng cho Dropdown chọn lúc tạo mới
  const [trainOptions, setTrainOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);

  // State cho Bộ lọc (Filters)
  const [filters, setFilters] = useState({ date: "", routeId: "", status: "" });

  // State cho Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    train: "",
    route: "",
    departureTime: "",
    arrivalTime: "",
    status: "on_time",
    delayMinutes: 0,
    seatInventory: [], // Sẽ tự động tạo dựa vào cấu trúc toa của Tàu được chọn
  };
  const [formData, setFormData] = useState(initialFormState);

  // Load danh sách Lịch chạy, Tàu và Tuyến khi vào trang hoặc khi đổi Filter
  useEffect(() => {
    fetchSchedules();
  }, [filters]);

  useEffect(() => {
    fetchOptionsData();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      // Gọi API kèm theo các tham số filter (nếu có)
      const res = await adminService.getSchedules(filters);
      setSchedules(res.data);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOptionsData = async () => {
    try {
      const [trainsRes, routesRes] = await Promise.all([
        adminService.getTrains(1, 100),
        adminService.getRoutes(1, 100),
      ]);
      setTrainOptions(trainsRes.data.trains || trainsRes.data);
      setRouteOptions(routesRes.data);
    } catch (error) {
      console.error("Failed to load options", error);
    }
  };

  // ================== LOGIC ĐỔI TRẠNG THÁI NHANH ==================
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateScheduleStatus(id, newStatus);
      // Cập nhật lại state cục bộ để UI giật đổi màu ngay lập tức
      setSchedules(
        schedules.map((sch) =>
          sch._id === id ? { ...sch, status: newStatus } : sch,
        ),
      );
    } catch (error) {
      console.error("Failed to update schedule status", error);
      alert("Failed to update status.");
    }
  };

  // ================== LOGIC CHỌN TÀU TỰ ĐỘNG TẠO GHẾ ==================
  const handleTrainSelect = (e) => {
    const selectedTrainId = e.target.value;
    const selectedTrain = trainOptions.find((t) => t._id === selectedTrainId);

    // Khi chọn tàu, tự động copy cấu trúc toa xe sang kho ghế (seatInventory)
    const inventory = selectedTrain
      ? selectedTrain.carriages.map((c) => ({
          carriageNumber: c.carriageNumber,
          type: c.type,
          totalSeats: c.totalSeats,
          bookedSeats: [],
        }))
      : [];

    setFormData({
      ...formData,
      train: selectedTrainId,
      seatInventory: inventory,
    });
  };

  // ================== LOGIC CRUD MODAL ==================
  // Helper: Convert chuỗi ngày ISO sang format "YYYY-MM-DDThh:mm" cho thẻ <input type="datetime-local">
  const formatDateTimeForInput = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    // Chỉnh lại timezone offset để không bị lệch giờ khi hiển thị lên Form
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setFormData({
        ...schedule,
        train: schedule.train?._id || schedule.train,
        route: schedule.route?._id || schedule.route,
        departureTime: formatDateTimeForInput(schedule.departureTime),
        arrivalTime: formatDateTimeForInput(schedule.arrivalTime),
      });
      setEditingId(schedule._id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Delete this schedule? Bookings associated with it might be affected.",
      )
    ) {
      try {
        await adminService.deleteSchedule(id);
        fetchSchedules();
      } catch (error) {
        console.error("Failed to delete schedule", error);
        alert("Failed to delete schedule.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateSchedule(editingId, formData);
      } else {
        await adminService.createSchedule(formData);
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save schedule.");
    }
  };

  // Cấu hình các cột cho DataTable
  const columns = [
    {
      key: "train",
      label: "Train",
      render: (row) => (
        <span className="font-bold text-slate-800">
          {row.train?.trainCode || "N/A"}
        </span>
      ),
    },
    {
      key: "route",
      label: "Route",
      render: (row) => (
        <span className="text-slate-600 font-medium">
          {row.route?.departureStation} ➔ {row.route?.arrivalStation}
        </span>
      ),
    },
    {
      key: "time",
      label: "Schedule Timings",
      render: (row) => (
        <div className="text-xs">
          <div className="text-slate-800 font-bold mb-1">
            Dep: {new Date(row.departureTime).toLocaleString()}
          </div>
          <div className="text-slate-500">
            Arr: {new Date(row.arrivalTime).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status (Quick Edit)",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleQuickStatusChange(row._id, e.target.value)}
          className={`text-xs font-bold uppercase p-1.5 rounded outline-none border focus:ring-2 focus:ring-chuppaGreen ${
            row.status === "on_time"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "delayed"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <option value="on_time">ON TIME</option>
          <option value="delayed">DELAYED</option>
          <option value="cancelled">CANCELLED</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarClock className="text-chuppaGreen" /> Manage Schedules
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Assign trains to routes for specific dates and times.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-chuppaGreen hover:bg-chuppaGreen-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
        >
          <Plus size={18} /> Add Schedule
        </button>
      </div>

      {/* THANH BỘ LỌC (FILTER BAR) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
          <Filter size={18} /> Filters:
        </div>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-chuppaGreen"
        />
        <select
          value={filters.routeId}
          onChange={(e) => setFilters({ ...filters, routeId: e.target.value })}
          className="border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-chuppaGreen min-w-[150px]"
        >
          <option value="">All Routes</option>
          {routeOptions.map((r) => (
            <option key={r._id} value={r._id}>
              {r.routeCode}: {r.departureStation} ➔ {r.arrivalStation}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-chuppaGreen"
        >
          <option value="">All Statuses</option>
          <option value="on_time">On Time</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {(filters.date || filters.routeId || filters.status) && (
          <button
            onClick={() => setFilters({ date: "", routeId: "", status: "" })}
            className="text-sm text-red-500 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Tái sử dụng DataTable */}
      <DataTable
        columns={columns}
        data={schedules}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="No schedules match the selected filters."
      />

      {/* MODAL FORM (Thêm/Sửa Lịch Chạy) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Schedule" : "Create New Schedule"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form
                id="scheduleForm"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chọn Tuyến Đường */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Select Route *
                    </label>
                    <select
                      required
                      value={formData.route}
                      onChange={(e) =>
                        setFormData({ ...formData, route: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    >
                      <option value="" disabled>
                        -- Choose a Route --
                      </option>
                      {routeOptions.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.routeCode} | {r.departureStation} ➔{" "}
                          {r.arrivalStation}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chọn Tàu */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Assign Train *
                    </label>
                    <select
                      required
                      value={formData.train}
                      onChange={handleTrainSelect} // Gọi hàm chuyên biệt để tạo ghế
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    >
                      <option value="" disabled>
                        -- Choose a Train --
                      </option>
                      {trainOptions
                        .filter((t) => t.status === "active")
                        .map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.trainCode} - {t.trainName}
                          </option>
                        ))}
                    </select>
                    {!editingId && formData.train && (
                      <p className="text-xs text-chuppaGreen mt-1 font-medium">
                        ✓ Seat inventory will be automatically generated based
                        on this train's carriages.
                      </p>
                    )}
                  </div>

                  {/* Giờ khởi hành / Giờ đến */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Departure Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.departureTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departureTime: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Arrival Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.arrivalTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          arrivalTime: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    />
                  </div>

                  {/* Trạng thái & Delay */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    >
                      <option value="on_time">On Time</option>
                      <option value="delayed">Delayed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Delay (Minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      disabled={formData.status !== "delayed"}
                      value={formData.delayMinutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          delayMinutes: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 font-bold rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="scheduleForm"
                className="px-5 py-2.5 bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                {editingId ? "Save Changes" : "Create Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSchedules;

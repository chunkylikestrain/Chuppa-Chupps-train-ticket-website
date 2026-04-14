import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";

const TrainManagement = () => {
  const [trains, setTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE CHO MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    trainNumber: "",
    type: "EIP",
    fromStation: "",
    toStation: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: "",
    travelDate: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- STATE CHO AUTOCOMPLETE GA TÀU ---
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/trains/search",
      );
      setTrains(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch trains data.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // LOGIC AUTOCOMPLETE GA TÀU
  // ==========================================
  const fetchStations = async (keyword, type) => {
    if (keyword.trim().length > 0) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stations/search?q=${keyword}`,
        );
        if (type === "from") {
          setFromSuggestions(response.data);
          setShowFromDropdown(true);
        } else {
          setToSuggestions(response.data);
          setShowToDropdown(true);
        }
      } catch (error) {
        console.error("Lỗi tải ga:", error);
      }
    } else {
      type === "from" ? setShowFromDropdown(false) : setShowToDropdown(false);
    }
  };

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, fromStation: value });
    fetchStations(value, "from");
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, toStation: value });
    fetchStations(value, "to");
  };

  const selectStation = (stationName, type) => {
    if (type === "from") {
      setFormData({ ...formData, fromStation: stationName });
      setShowFromDropdown(false);
    } else {
      setFormData({ ...formData, toStation: stationName });
      setShowToDropdown(false);
    }
  };

  // ==========================================
  // LOGIC TÍNH TOÁN THỜI GIAN TỰ ĐỘNG
  // ==========================================
  const handleTimeCalculation = (field) => {
    // Nếu chưa nhập giờ đi thì không làm gì cả
    if (!formData.departureTime) return;

    const dep = formData.departureTime.split(":");

    if (field === "arrival" && formData.arrivalTime) {
      // 1. Nhập Giờ đến -> Tính Duration
      const arr = formData.arrivalTime.split(":");
      let diffMins = arr[0] * 60 + arr[1] * 1 - (dep[0] * 60 + dep[1] * 1);

      // Nếu đến vào ngày hôm sau
      if (diffMins < 0) diffMins += 24 * 60;

      const h = Math.floor(diffMins / 60);
      const m = diffMins % 60;
      setFormData((prev) => ({ ...prev, duration: `${h}h ${m}m` }));
    } else if (field === "duration" && formData.duration) {
      // 2. Nhập Duration (VD: 2h 30m, 2h, 45m) -> Tính Giờ đến
      const hMatch = formData.duration.match(/(\d+)\s*h/i);
      const mMatch = formData.duration.match(/(\d+)\s*m/i);

      const addH = hMatch ? parseInt(hMatch[1]) : 0;
      const addM = mMatch ? parseInt(mMatch[1]) : 0;

      let totalMins = dep[0] * 60 + dep[1] * 1 + addH * 60 + addM;
      let arrH = Math.floor(totalMins / 60) % 24;
      let arrM = totalMins % 60;

      setFormData((prev) => ({
        ...prev,
        arrivalTime: `${String(arrH).padStart(2, "0")}:${String(arrM).padStart(2, "0")}`,
      }));
    }
  };

  // ==========================================
  // CÁC HÀM CRUD (THÊM, SỬA, XÓA)
  // ==========================================
  const openModalForAdd = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (train) => {
    setFormData(train);
    setEditingId(train._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/trains/${editingId}`,
          formData,
          config,
        );
        alert("Train updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/trains", formData, config);
        alert("New train added successfully!");
      }
      setIsModalOpen(false);
      fetchTrains();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving train data!");
    }
  };

  const handleDelete = async (id, trainNumber) => {
    if (
      window.confirm(`Are you sure you want to delete train ${trainNumber}?`)
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/trains/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrains(trains.filter((t) => t._id !== id));
      } catch (err) {
        console.log(err);
        alert("Error deleting train.");
      }
    }
  };

  // LOGIC TÌM KIẾM: Lọc mảng trains dựa trên searchTerm
  const filteredTrains = trains.filter((train) => {
    const term = searchTerm.toLowerCase();
    return (
      train.trainNumber.toLowerCase().includes(term) ||
      train.fromStation.toLowerCase().includes(term) ||
      train.toStation.toLowerCase().includes(term) ||
      train.type.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Train Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage all active train routes and schedules.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by route, train number..."
              value={searchTerm} // GẮN GIÁ TRỊ VÀO ĐÂY
              onChange={(e) => setSearchTerm(e.target.value)} // BẮT SỰ KIỆN GÕ PHÍM
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
            />
          </div>
          <button
            onClick={openModalForAdd}
            className="bg-chuppaGreen hover:bg-chuppaGreen-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Train</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-10 text-gray-500">
          Loading trains data...
        </div>
      )}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}

      {!isLoading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Train</th>
                  <th className="p-4 font-bold">Route</th>
                  <th className="p-4 font-bold">Date & Time</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {filteredTrains.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      {searchTerm
                        ? "No trains match your search."
                        : "No trains found in database."}
                    </td>
                  </tr>
                ) : (
                  /* Đổi trains.map thành filteredTrains.map */
                  filteredTrains.map((train) => (
                    <tr
                      key={train._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold border ${train.type === "EIP" ? "bg-blue-50 text-blue-700 border-blue-200" : train.type === "EIC" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}
                          >
                            {train.type}
                          </span>
                          <span className="font-bold text-slate-800">
                            {train.trainNumber}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">
                          {train.fromStation}
                        </div>
                        <div className="text-xs text-slate-400">
                          to {train.toStation}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          {train.departureTime} - {train.arrivalTime}
                        </div>
                        <div className="text-xs text-slate-400">
                          {train.travelDate} ({train.duration})
                        </div>
                      </td>
                      <td className="p-4 font-bold text-chuppaGreen">
                        {train.price} PLN
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModalForEdit(train)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(train._id, train.trainNumber)
                            }
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-slate-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Train Schedule" : "Add New Train"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Train Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trainNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, trainNumber: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-chuppaGreen outline-none text-sm"
                    placeholder="e.g. 3104"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-chuppaGreen outline-none text-sm"
                  >
                    <option value="EIP">EIP (Pendolino)</option>
                    <option value="EIC">EIC (InterCity)</option>
                    <option value="TLK">TLK</option>
                  </select>
                </div>

                {/* Ô TỪ GA CÓ AUTOCOMPLETE */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    From Station
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fromStation}
                    onChange={handleFromChange}
                    onBlur={() =>
                      setTimeout(() => setShowFromDropdown(false), 200)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    placeholder="Type station name..."
                  />
                  {showFromDropdown && fromSuggestions.length > 0 && (
                    <ul className="absolute z-50 top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl max-h-40 overflow-y-auto border border-gray-200">
                      {fromSuggestions.map((station) => (
                        <li
                          key={station._id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectStation(station.name, "from")}
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-chuppaGreen hover:text-white cursor-pointer border-b border-gray-100 font-medium"
                        >
                          {station.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Ô ĐẾN GA CÓ AUTOCOMPLETE */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    To Station
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.toStation}
                    onChange={handleToChange}
                    onBlur={() =>
                      setTimeout(() => setShowToDropdown(false), 200)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    placeholder="Type station name..."
                  />
                  {showToDropdown && toSuggestions.length > 0 && (
                    <ul className="absolute z-50 top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl max-h-40 overflow-y-auto border border-gray-200">
                      {toSuggestions.map((station) => (
                        <li
                          key={station._id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectStation(station.name, "to")}
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-chuppaGreen hover:text-white cursor-pointer border-b border-gray-100 font-medium"
                        >
                          {station.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.travelDate}
                    onChange={(e) =>
                      setFormData({ ...formData, travelDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Price (PLN)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    placeholder="169"
                  />
                </div>

                {/* NHÓM LOGIC THỜI GIAN */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Departure Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.departureTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departureTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-bold mb-1 ${!formData.departureTime ? "text-gray-400" : "text-gray-700"}`}
                  >
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    required
                    disabled={!formData.departureTime}
                    value={formData.arrivalTime}
                    onChange={(e) =>
                      setFormData({ ...formData, arrivalTime: e.target.value })
                    }
                    onBlur={() => handleTimeCalculation("arrival")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-bold mb-1 ${!formData.departureTime ? "text-gray-400" : "text-gray-700"}`}
                  >
                    Duration (Auto-calc / Manual)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!formData.departureTime}
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    onBlur={() => handleTimeCalculation("duration")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g. 2h 30m"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Requires Departure Time. Type duration (e.g. "2h 30m") then
                    click outside to auto-calculate Arrival Time.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold rounded-lg transition-colors text-sm shadow-md"
                >
                  {editingId ? "Save Changes" : "Create Train"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainManagement;

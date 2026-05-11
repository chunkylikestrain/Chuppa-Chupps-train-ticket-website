// Path: src/pages/admin/ManageRoutes.jsx
import React, { useState, useEffect } from "react";
import { Plus, X, Route as RouteIcon, Trash2 } from "lucide-react";
import adminService from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";

// ==========================================
// 1. MOCK DATABASE & HÀM TÍNH TOÁN
// ==========================================
const STATIONS_DB = [
  { name: "Warszawa Centralna", lat: 52.2286, lng: 21.0033 },
  { name: "Warszawa Zachodnia", lat: 52.2209, lng: 20.9665 },
  { name: "Warszawa Wschodnia", lat: 52.2518, lng: 21.0524 },
  { name: "Warszawa Gdańska", lat: 52.2685, lng: 20.9947 },
  { name: "Gdańsk Główny", lat: 54.356, lng: 18.6461 },
  { name: "Gdynia Główna", lat: 54.5189, lng: 18.5305 },
  { name: "Sopot", lat: 54.4418, lng: 18.5601 },
  { name: "Kraków Główny", lat: 50.0685, lng: 19.9474 },
  { name: "Kraków Płaszów", lat: 50.0466, lng: 19.9605 },
  { name: "Wrocław Główny", lat: 51.0989, lng: 17.0366 },
  { name: "Poznań Główny", lat: 52.4023, lng: 16.9116 },
  { name: "Katowice", lat: 50.2649, lng: 19.0238 },
  { name: "Gliwice", lat: 50.3015, lng: 18.6766 },
  { name: "Łódź Fabryczna", lat: 51.7592, lng: 19.4666 },
  { name: "Łódź Kaliska", lat: 51.7472, lng: 19.4382 },
  { name: "Rzeszów Główny", lat: 50.0413, lng: 22.0048 },
  { name: "Przemyśl Główny", lat: 49.7838, lng: 22.7679 },
  { name: "Lublin", lat: 51.2352, lng: 22.5684 },
  { name: "Białystok", lat: 53.1325, lng: 23.1688 },
  { name: "Olsztyn Główny", lat: 53.7799, lng: 20.4942 },
  { name: "Szczecin Główny", lat: 53.4285, lng: 14.5528 },
  { name: "Bydgoszcz Główna", lat: 53.1291, lng: 18.0044 },
  { name: "Toruń Główny", lat: 53.0056, lng: 18.6047 },
  { name: "Opole Główne", lat: 50.6656, lng: 17.9272 },
  { name: "Kielce", lat: 50.8703, lng: 20.6286 },
  { name: "Radom", lat: 51.4027, lng: 21.1471 },
  { name: "Częstochowa", lat: 50.8117, lng: 19.1203 },
  { name: "Zakopane", lat: 49.2992, lng: 19.9496 },
  { name: "Kołobrzeg", lat: 54.1757, lng: 15.5833 },
  { name: "Słupsk", lat: 54.4641, lng: 17.0287 },
  { name: "Włoszczowa Północ", lat: 50.8533, lng: 19.9575 },
];

const calculateRailwayDistance = (station1Name, station2Name) => {
  const s1 = STATIONS_DB.find((s) => s.name === station1Name);
  const s2 = STATIONS_DB.find((s) => s.name === station2Name);

  if (!s1 || !s2) return "";

  const R = 6371;
  const dLat = ((s2.lat - s1.lat) * Math.PI) / 180;
  const dLon = ((s2.lng - s1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((s1.lat * Math.PI) / 180) *
      Math.cos((s2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;

  return Math.round(straightDistance * 1.2);
};

// ==========================================
// 2. COMPONENT AUTOCOMPLETE TÁCH RỜI
// ==========================================
const StationAutocomplete = ({ label, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filteredStations = STATIONS_DB.filter((s) =>
    s.name.toLowerCase().includes((value || "").toLowerCase()),
  );

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-1">
          {label} *
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        placeholder={placeholder}
        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-chuppaGreen"
      />

      {isOpen && filteredStations.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {filteredStations.map((station, idx) => (
            <li
              key={idx}
              // Dùng onMouseDown để tránh mất focus
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(station.name);
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-green-50 hover:text-chuppaGreen cursor-pointer text-sm font-medium text-slate-700 border-b border-slate-50 last:border-0"
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ==========================================
// 3. COMPONENT QUẢN LÝ CHÍNH
// ==========================================
const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    routeCode: "",
    departureStation: "",
    arrivalStation: "",
    totalDistance: "",
    stops: [],
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Tự động tính khoảng cách tuyến đường chính khi thay đổi ga đi/đến
  useEffect(() => {
    if (formData.departureStation && formData.arrivalStation) {
      const dist = calculateRailwayDistance(
        formData.departureStation,
        formData.arrivalStation,
      );
      if (dist) setFormData((prev) => ({ ...prev, totalDistance: dist }));
    }
  }, [formData.departureStation, formData.arrivalStation]);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getRoutes();
      setRoutes(res.data);
    } catch (error) {
      console.error("Failed to fetch routes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStop = () => {
    const nextOrder = formData.stops.length + 1;
    setFormData({
      ...formData,
      stops: [
        ...formData.stops,
        { stationName: "", order: nextOrder, distanceFromStart: "" },
      ],
    });
  };

  const removeStop = (index) => {
    const newStops = [...formData.stops];
    newStops.splice(index, 1);
    const reorderedStops = newStops.map((stop, i) => ({
      ...stop,
      order: i + 1,
    }));
    setFormData({ ...formData, stops: reorderedStops });
  };

  // Hàm handleStopChange được cập nhật để TỰ ĐỘNG ĐIỀN SỐ KM
  const handleStopChange = (index, field, value) => {
    const newStops = [...formData.stops];
    newStops[index][field] = value;

    // Nếu thay đổi Tên Trạm, tính luôn khoảng cách từ Ga Đi (Departure) tới Trạm này
    if (field === "stationName" && value && formData.departureStation) {
      const dist = calculateRailwayDistance(formData.departureStation, value);
      if (dist) {
        newStops[index].distanceFromStart = dist;
      }
    }

    setFormData({ ...formData, stops: newStops });
  };

  const handleOpenModal = (route = null) => {
    if (route) {
      setFormData(route);
      setEditingId(route._id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this route? This may affect existing schedules.",
      )
    ) {
      try {
        await adminService.deleteRoute(id);
        fetchRoutes();
      } catch (error) {
        console.error("Failed to delete route", error);
        alert("Failed to delete route.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateRoute(editingId, formData);
      } else {
        await adminService.createRoute(formData);
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save route data.");
    }
  };

  const columns = [
    {
      key: "routeCode",
      label: "Route Code",
      render: (row) => (
        <span className="font-bold text-slate-800 uppercase">
          {row.routeCode}
        </span>
      ),
    },
    {
      key: "stations",
      label: "Journey",
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800">
            {row.departureStation}
          </span>
          <span className="text-slate-400 mx-2">➔</span>
          <span className="font-medium text-slate-800">
            {row.arrivalStation}
          </span>
        </div>
      ),
    },
    {
      key: "stops",
      label: "Intermediate Stops",
      render: (row) => (
        <span className="text-slate-600">{row.stops?.length || 0} stops</span>
      ),
    },
    {
      key: "totalDistance",
      label: "Distance (km)",
      render: (row) => (
        <span className="font-medium text-chuppaGreen">
          {row.totalDistance} km
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <RouteIcon className="text-chuppaGreen" /> Manage Routes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Define train routes and intermediate station stops.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-chuppaGreen hover:bg-chuppaGreen-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
        >
          <Plus size={18} /> Add New Route
        </button>
      </div>

      <DataTable
        columns={columns}
        data={routes}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="No routes found. Click 'Add New Route' to create one."
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Route Details" : "Create New Route"}
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
                id="routeForm"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Route Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WAW-KRK"
                      value={formData.routeCode}
                      onChange={(e) =>
                        setFormData({ ...formData, routeCode: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm uppercase"
                    />
                  </div>

                  {/* AUTOCOMPLETE GA ĐI */}
                  <div>
                    <StationAutocomplete
                      label="Departure Station"
                      required={true}
                      value={formData.departureStation}
                      onChange={(val) =>
                        setFormData({ ...formData, departureStation: val })
                      }
                      placeholder="e.g. Warszawa Centralna"
                    />
                  </div>

                  {/* AUTOCOMPLETE GA ĐẾN */}
                  <div>
                    <StationAutocomplete
                      label="Arrival Station"
                      required={true}
                      value={formData.arrivalStation}
                      onChange={(val) =>
                        setFormData({ ...formData, arrivalStation: val })
                      }
                      placeholder="e.g. Kraków Główny"
                    />
                  </div>

                  {/* KHOẢNG CÁCH TỔNG TỰ TÍNH */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Total Distance (km) *
                    </label>
                    <input
                      type="number"
                      required
                      readOnly
                      placeholder="Auto calculated"
                      value={formData.totalDistance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalDistance: e.target.value,
                        })
                      }
                      className="w-full border border-chuppaGreen bg-green-50 text-green-800 font-bold rounded-lg p-2.5 outline-none cursor-not-allowed text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Distance is auto-calculated based on station coordinates.
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800 text-lg">
                      Intermediate Stops
                    </h4>
                    <button
                      type="button"
                      onClick={addStop}
                      className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors border border-blue-200"
                    >
                      + Add Stop
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.stops.map((stop, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-end gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 relative"
                      >
                        <div className="absolute -left-2 -top-2 bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                          {stop.order}
                        </div>

                        <div className="flex-1 min-w-[200px] pl-2">
                          {/* AUTOCOMPLETE GA TRUNG GIAN */}
                          <StationAutocomplete
                            label="Station Name"
                            required={true}
                            value={stop.stationName}
                            onChange={(val) =>
                              handleStopChange(index, "stationName", val)
                            }
                            placeholder="e.g. Włoszczowa Północ"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-bold text-slate-500 mb-1">
                            Dist. from Start (km) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="From start"
                            value={stop.distanceFromStart}
                            onChange={(e) =>
                              handleStopChange(
                                index,
                                "distanceFromStart",
                                e.target.value,
                              )
                            }
                            // Thêm bg để báo hiệu ô này có thể sửa tay hoặc auto
                            className="w-full border border-slate-300 bg-white rounded p-2.5 text-sm outline-none focus:border-chuppaGreen"
                            title="Distance from departure station"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStop(index)}
                          className="p-2.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                          title="Remove Stop"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}

                    {formData.stops.length === 0 && (
                      <div className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                        No intermediate stops. This is a direct route.
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

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
                form="routeForm"
                className="px-5 py-2.5 bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                {editingId ? "Save Changes" : "Create Route"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoutes;

/* eslint-disable no-unused-vars */
// Path: src/pages/admin/ManagePricing.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  CircleDollarSign,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
} from "lucide-react";
import adminService from "../../services/adminService";

const ManagePricing = () => {
  const [pricings, setPricings] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialFormState = {
    route: "",
    seatType: "soft_seat",
    passengerType: "adult",
    price: "",
    isActive: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [seatFilter, setSeatFilter] = useState("all");
  const [passFilter, setPassFilter] = useState("all");
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  // Grouped Table State
  const [expandedRoutes, setExpandedRoutes] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);

  // Bulk Edit Modal State
  const [bulkAction, setBulkAction] = useState(null); // 'increase' | 'decrease'
  const [bulkPercent, setBulkPercent] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pricingRes, routesRes] = await Promise.all([
        adminService.getPricing(),
        adminService.getRoutes(1, 100),
      ]);
      setPricings(pricingRes.data);
      setRouteOptions(routesRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== DATA PROCESSING ==================
  const { groupedData, missingRoutes, stats } = useMemo(() => {
    // Lọc Pricings
    const filteredPricings = pricings.filter((p) => {
      if (seatFilter !== "all" && p.seatType !== seatFilter) return false;
      if (passFilter !== "all" && p.passengerType !== passFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          p.route?.departureStation?.toLowerCase().includes(term) ||
          p.route?.arrivalStation?.toLowerCase().includes(term) ||
          p.route?.routeCode?.toLowerCase().includes(term)
        );
      }
      return true;
    });

    // Gom nhóm theo Tuyến đường (Route)
    const groupsMap = {};
    filteredPricings.forEach((p) => {
      const rId = p.route?._id;
      if (!rId) return;
      if (!groupsMap[rId]) {
        groupsMap[rId] = { route: p.route, rules: [] };
      }
      groupsMap[rId].rules.push(p);
    });

    // Thống kê
    const routesWithPricing = new Set(pricings.map((p) => p.route?._id));
    const missing = routeOptions.filter((r) => !routesWithPricing.has(r._id));

    return {
      groupedData: Object.values(groupsMap),
      missingRoutes: missing,
      stats: {
        totalRules: pricings.length,
        completeRoutes: routesWithPricing.size,
        missingRoutes: missing.length,
      },
    };
  }, [pricings, routeOptions, searchTerm, seatFilter, passFilter]);

  // Danh sách hiển thị cuối cùng
  const displayGroups = showMissingOnly ? [] : groupedData;

  // ================== UI HANDLERS ==================
  const toggleExpand = (routeId) => {
    setExpandedRoutes((prev) =>
      prev.includes(routeId)
        ? prev.filter((id) => id !== routeId)
        : [...prev, routeId],
    );
  };

  const toggleSelectRule = (ruleId) => {
    setSelectedRules((prev) =>
      prev.includes(ruleId)
        ? prev.filter((id) => id !== ruleId)
        : [...prev, ruleId],
    );
  };

  // eslint-disable-next-line no-unused-vars
  const toggleSelectAllRoute = (routeId, rules) => {
    const ruleIds = rules.map((r) => r._id);
    const allSelected = ruleIds.every((id) => selectedRules.includes(id));

    if (allSelected) {
      setSelectedRules((prev) => prev.filter((id) => !ruleIds.includes(id)));
    } else {
      setSelectedRules((prev) => [...new Set([...prev, ...ruleIds])]);
    }
  };

  // ================== CRUD HANDLERS ==================
  const handleOpenModal = (pricing = null, prefillRouteId = "") => {
    if (pricing) {
      setFormData({
        route: pricing.route?._id || pricing.route,
        seatType: pricing.seatType,
        passengerType: pricing.passengerType,
        price: pricing.price,
        isActive: pricing.isActive !== false, // Default true nếu DB không có trường này
      });
      setEditingId(pricing._id);
    } else {
      setFormData({ ...initialFormState, route: prefillRouteId });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updatePricing(editingId, formData);
      } else {
        await adminService.createPricing(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save pricing data.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pricing rule?")) {
      try {
        await adminService.deletePricing(id);
        setSelectedRules((prev) => prev.filter((rId) => rId !== id));
        fetchData();
      } catch (error) {
        alert("Failed to delete.");
      }
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      const updatedData = {
        ...rule,
        isActive: rule.isActive === false ? true : false,
      };
      // Gọi API update
      await adminService.updatePricing(rule._id, updatedData);

      // Update UI cục bộ để phản hồi nhanh
      setPricings((prev) =>
        prev.map((p) =>
          p._id === rule._id ? { ...p, isActive: updatedData.isActive } : p,
        ),
      );
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  // ================== BULK ACTIONS ==================
  const executeBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedRules.length} selected rules?`)) {
      try {
        // Promise.all để xóa nhiều
        await Promise.all(
          selectedRules.map((id) => adminService.deletePricing(id)),
        );
        setSelectedRules([]);
        fetchData();
      } catch (error) {
        alert("Some rules could not be deleted.");
      }
    }
  };

  const executeBulkUpdatePrice = async () => {
    if (!bulkPercent || isNaN(bulkPercent))
      return alert("Please enter a valid percentage.");
    const percent = parseFloat(bulkPercent);
    const multiplier =
      bulkAction === "increase" ? 1 + percent / 100 : 1 - percent / 100;

    try {
      const updatePromises = selectedRules.map((id) => {
        const rule = pricings.find((p) => p._id === id);
        const newPrice = Math.round(rule.price * multiplier);
        return adminService.updatePricing(id, { ...rule, price: newPrice });
      });

      await Promise.all(updatePromises);
      setBulkAction(null);
      setBulkPercent("");
      setSelectedRules([]);
      fetchData();
    } catch (error) {
      alert("Error updating bulk prices.");
    }
  };

  // ================== FORMATTERS ==================
  const formatSeatType = (t) =>
    ({
      soft_seat: "Soft Seat",
      hard_seat: "Hard Seat",
      soft_sleeper: "Soft Sleeper",
      hard_sleeper: "Hard Sleeper",
      vip: "VIP Cabin",
    })[t] || t;
  const formatPassType = (t) =>
    ({ adult: "Adult", child: "Child", senior: "Senior" })[t] || t;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 relative min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CircleDollarSign className="text-chuppaGreen" /> Manage Pricing
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Grouped pricing rules, bulk edits, and status management.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-chuppaGreen hover:bg-chuppaGreen-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm shadow-sm"
        >
          <Plus size={18} /> Add Pricing Rule
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">
              Total Rules
            </p>
            <p className="text-2xl font-black text-slate-800">
              {stats.totalRules}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">
              Configured Routes
            </p>
            <p className="text-2xl font-black text-slate-800">
              {stats.completeRoutes}
            </p>
          </div>
        </div>
        <div
          onClick={() => setShowMissingOnly(!showMissingOnly)}
          className={`p-5 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all ${showMissingOnly ? "bg-orange-50 border-orange-300" : "bg-white border-slate-200 hover:border-orange-300"}`}
        >
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">
              Missing Pricing
            </p>
            <p className="text-2xl font-black text-orange-600">
              {stats.missingRoutes} Routes
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by station name or route code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-chuppaGreen text-sm"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50">
            <Filter size={16} className="text-slate-500" />
            <select
              value={seatFilter}
              onChange={(e) => setSeatFilter(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-slate-700"
            >
              <option value="all">All Seats</option>
              <option value="soft_seat">Soft Seat</option>
              <option value="hard_seat">Hard Seat</option>
              <option value="soft_sleeper">Soft Sleeper</option>
              <option value="vip">VIP Cabin</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50">
            <Users size={16} className="text-slate-500" />
            <select
              value={passFilter}
              onChange={(e) => setPassFilter(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-slate-700"
            >
              <option value="all">All Passengers</option>
              <option value="adult">Adult</option>
              <option value="child">Child</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>
      </div>

      {/* MISSING ROUTES LIST (Conditional) */}
      {showMissingOnly && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} /> Routes Missing Pricing Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missingRoutes.map((r) => (
              <div
                key={r._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    {r.routeCode}
                  </p>
                  <p className="text-xs text-slate-500">
                    {r.departureStation} ➔ {r.arrivalStation}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenModal(null, r._id)}
                  className="text-chuppaGreen hover:bg-green-50 p-2 rounded transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}
            {missingRoutes.length === 0 && (
              <p className="text-sm text-slate-500 col-span-full">
                All current routes have at least one pricing rule!
              </p>
            )}
          </div>
        </div>
      )}

      {/* GROUPED TABLE */}
      {!showMissingOnly && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">Route Details</th>
                <th className="px-6 py-4 text-center">Seat Type</th>
                <th className="px-6 py-4 text-center">Passenger</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayGroups.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No pricing rules match your filters.
                  </td>
                </tr>
              ) : (
                displayGroups.map((group) => {
                  const isExpanded = expandedRoutes.includes(group.route._id);

                  return (
                    <React.Fragment key={group.route._id}>
                      {/* MASTER ROW (ROUTE) */}
                      <tr className="bg-slate-50/50 hover:bg-slate-100 transition-colors border-t border-slate-200">
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleExpand(group.route._id)}
                            className="p-1 text-slate-400 hover:text-slate-700 bg-white rounded-md shadow-sm border border-slate-200"
                          >
                            {isExpanded ? (
                              <ChevronDown size={18} />
                            ) : (
                              <ChevronRight size={18} />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-3" colSpan="5">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                              {group.route.routeCode}
                            </span>
                            <span className="font-medium text-slate-600">
                              {group.route.departureStation} ➔{" "}
                              {group.route.arrivalStation}
                            </span>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold ml-2">
                              {group.rules.length} rules
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(null, group.route._id);
                            }}
                            className="text-xs font-bold text-chuppaGreen hover:bg-green-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-green-200 transition-all flex items-center gap-1 ml-auto"
                          >
                            <Plus size={14} /> Add Rule
                          </button>
                        </td>
                      </tr>

                      {/* SUB ROWS (RULES) */}
                      {isExpanded &&
                        group.rules.map((rule) => {
                          const isSelected = selectedRules.includes(rule._id);
                          const isInactive = rule.isActive === false;

                          return (
                            <tr
                              key={rule._id}
                              className={`hover:bg-slate-50 transition-colors ${isInactive ? "opacity-50 grayscale-[0.5]" : ""}`}
                            >
                              <td className="px-6 py-3 text-center border-r border-slate-100">
                                <button
                                  onClick={() => toggleSelectRule(rule._id)}
                                  className={`${isSelected ? "text-chuppaGreen" : "text-slate-300 hover:text-slate-400"}`}
                                >
                                  {isSelected ? (
                                    <CheckSquare size={18} />
                                  ) : (
                                    <Square size={18} />
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-3 border-r border-slate-100 bg-slate-50/30"></td>
                              <td className="px-6 py-3 text-center">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[11px] font-bold border border-slate-200 uppercase tracking-wide">
                                  {formatSeatType(rule.seatType)}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold border uppercase tracking-wide ${
                                    rule.passengerType === "adult"
                                      ? "text-blue-700 bg-blue-50 border-blue-200"
                                      : rule.passengerType === "child"
                                        ? "text-green-700 bg-green-50 border-green-200"
                                        : "text-purple-700 bg-purple-50 border-purple-200"
                                  }`}
                                >
                                  {formatPassType(rule.passengerType)}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-right font-black text-slate-800 text-base">
                                {rule.price.toLocaleString()}{" "}
                                <span className="text-xs text-slate-400">
                                  PLN
                                </span>
                              </td>
                              <td className="px-6 py-3 text-center">
                                <button
                                  onClick={() => handleToggleActive(rule)}
                                  className={`p-1 rounded transition-colors ${isInactive ? "text-slate-400 hover:text-slate-600" : "text-green-500 hover:text-green-700"}`}
                                  title={
                                    isInactive
                                      ? "Activate Rule"
                                      : "Deactivate Rule"
                                  }
                                >
                                  {isInactive ? (
                                    <ToggleLeft size={24} />
                                  ) : (
                                    <ToggleRight size={24} />
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenModal(rule)}
                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(rule._id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* FLOATING BULK ACTION BAR */}
      {selectedRules.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10">
          <div className="font-bold text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {selectedRules.length} Selected
          </div>

          <div className="flex items-center gap-1 border-r border-slate-700 pr-6">
            <input
              type="number"
              placeholder="%"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center outline-none focus:border-chuppaGreen"
            />
            <button
              onClick={() => {
                setBulkAction("increase");
                executeBulkUpdatePrice();
              }}
              className="p-1.5 bg-slate-800 hover:bg-chuppaGreen rounded transition-colors text-white"
              title="Increase Price"
            >
              <TrendingUp size={16} />
            </button>
            <button
              onClick={() => {
                setBulkAction("decrease");
                executeBulkUpdatePrice();
              }}
              className="p-1.5 bg-slate-800 hover:bg-orange-500 rounded transition-colors text-white"
              title="Decrease Price"
            >
              <TrendingDown size={16} />
            </button>
          </div>

          <button
            onClick={executeBulkDelete}
            className="text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <Trash2 size={16} /> Delete All
          </button>
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Pricing Rule" : "Add New Pricing"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form
              id="pricingForm"
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Select Route *
                </label>
                <select
                  required
                  value={formData.route}
                  onChange={(e) =>
                    setFormData({ ...formData, route: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm bg-slate-50"
                >
                  <option value="" disabled>
                    -- Choose a Route --
                  </option>
                  {routeOptions.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.routeCode} | {r.departureStation} ➔ {r.arrivalStation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Seat Type *
                  </label>
                  <select
                    required
                    value={formData.seatType}
                    onChange={(e) =>
                      setFormData({ ...formData, seatType: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                  >
                    <option value="soft_seat">Soft Seat</option>
                    <option value="hard_seat">Hard Seat</option>
                    <option value="soft_sleeper">Soft Sleeper</option>
                    <option value="hard_sleeper">Hard Sleeper</option>
                    <option value="vip">VIP Cabin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Passenger *
                  </label>
                  <select
                    required
                    value={formData.passengerType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passengerType: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                  >
                    <option value="adult">Adult</option>
                    <option value="child">Child</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Price (PLN) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    zł
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-chuppaGreen text-sm font-bold"
                  />
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 font-bold rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="pricingForm"
                className="px-5 py-2.5 bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                {editingId ? "Save Changes" : "Create Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePricing;

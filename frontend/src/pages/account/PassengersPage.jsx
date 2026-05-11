/* eslint-disable no-unused-vars */
// Path: src/pages/account/PassengersPage.jsx
import React, { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Star, X } from "lucide-react";
import accountService from "../../services/accountService";

const PassengersPage = () => {
  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State cho Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    fullName: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "male",
    passengerType: "adult",
    phone: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    setIsLoading(true);
    try {
      const res = await accountService.getPassengers();
      setPassengers(res.data);
    } catch (error) {
      console.error("Failed to fetch passengers", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== LOGIC CRUD ==================
  const handleOpenModal = (passenger = null) => {
    if (passenger) {
      setFormData({
        fullName: passenger.fullName,
        nationalId: passenger.nationalId || "",
        dateOfBirth: passenger.dateOfBirth
          ? passenger.dateOfBirth.split("T")[0]
          : "",
        gender: passenger.gender || "male",
        passengerType: passenger.passengerType || "adult",
        phone: passenger.phone || "",
      });
      setEditingId(passenger._id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await accountService.updatePassenger(editingId, formData);
      } else {
        await accountService.addPassenger(formData);
      }
      setIsModalOpen(false);
      fetchPassengers();
    } catch (error) {
      alert("Failed to save passenger.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this passenger?")) {
      try {
        await accountService.deletePassenger(id);
        fetchPassengers();
      } catch (error) {
        alert("Failed to delete passenger.");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await accountService.setDefaultPassenger(id);
      fetchPassengers();
    } catch (error) {
      alert("Failed to set default.");
    }
  };

  const formatPassengerType = (type) => {
    const types = {
      adult: "Adult",
      child: "Child",
      student: "Student",
      senior: "Senior",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" /> Saved Passengers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Save details of your family or friends for faster booking.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-sm shadow-sm"
        >
          <Plus size={16} /> Add Passenger
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-400">
          Loading passengers...
        </div>
      ) : passengers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500">
          <p>No saved passengers yet. Click the button above to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passengers.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative group hover:border-indigo-300 transition-colors"
            >
              {p.isDefault && (
                <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg rounded-tr-xl">
                  Default
                </div>
              )}

              <h3 className="font-bold text-lg text-slate-800 mb-2">
                {p.fullName}
              </h3>
              <div className="space-y-1 text-sm text-slate-600 mb-4">
                <p>
                  <span className="text-slate-400">ID/Passport:</span>{" "}
                  {p.nationalId || "N/A"}
                </p>
                <p>
                  <span className="text-slate-400">Type:</span>{" "}
                  <span className="font-medium text-slate-800">
                    {formatPassengerType(p.passengerType)}
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">Gender:</span>{" "}
                  <span className="capitalize">{p.gender}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenModal(p)}
                  className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
                {!p.isDefault && (
                  <button
                    onClick={() => handleSetDefault(p._id)}
                    className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Set as default"
                  >
                    <Star size={14} /> Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL THÊM/SỬA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Passenger" : "Add New Passenger"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    National ID
                  </label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) =>
                      setFormData({ ...formData, nationalId: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Passenger Type
                  </label>
                  <select
                    value={formData.passengerType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passengerType: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  >
                    <option value="adult">Adult</option>
                    <option value="child">Child</option>
                    <option value="student">Student</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengersPage;

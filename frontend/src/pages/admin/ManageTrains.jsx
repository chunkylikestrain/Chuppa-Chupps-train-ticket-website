// src/pages/admin/ManageTrains.jsx
import React, { useState, useEffect } from "react";
import { Plus, X, Train as TrainIcon, Trash2 } from "lucide-react";
import adminService from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";

const ManageTrains = () => {
  const [trains, setTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    trainCode: "",
    trainName: "",
    status: "active",
    carriages: [{ carriageNumber: 1, type: "soft_seat", totalSeats: 60 }],
  };
  const [formData, setFormData] = useState(initialFormState);

  // Fetch data ban đầu
  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getTrains(1, 100);
      setTrains(res.data.trains || res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tàu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== LOGIC THÊM/BỚT TOA TÀU DYNAMIC ==================
  const addCarriage = () => {
    const nextNumber =
      formData.carriages.length > 0
        ? Math.max(...formData.carriages.map((c) => c.carriageNumber)) + 1
        : 1;

    setFormData({
      ...formData,
      carriages: [
        ...formData.carriages,
        { carriageNumber: nextNumber, type: "soft_seat", totalSeats: 60 },
      ],
    });
  };

  const removeCarriage = (index) => {
    const newCarriages = [...formData.carriages];
    newCarriages.splice(index, 1);
    setFormData({ ...formData, carriages: newCarriages });
  };

  const handleCarriageChange = (index, field, value) => {
    const newCarriages = [...formData.carriages];
    newCarriages[index][field] = value;
    setFormData({ ...formData, carriages: newCarriages });
  };

  // ================== LOGIC BẬT TẮT MODAL (ADD / EDIT) ==================
  const handleOpenModal = (train = null) => {
    // Nếu có truyền train vào -> Chế độ Edit
    if (train && train._id) {
      setFormData({
        trainCode: train.trainCode || "",
        trainName: train.trainName || "",
        status: train.status || "active",
        carriages:
          train.carriages && train.carriages.length > 0
            ? train.carriages
            : initialFormState.carriages,
      });
      setEditingId(train._id);
    } else {
      // Chế độ Add New
      setFormData(initialFormState);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  // ================== LOGIC LƯU (SUBMIT FORM) ==================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn load lại trang

    if (formData.carriages.length === 0) {
      return alert("A train must have at least one carriage!");
    }

    try {
      if (editingId) {
        // Cập nhật
        await adminService.updateTrain(editingId, formData);
        alert("Train updated successfully!");
      } else {
        // Tạo mới
        await adminService.createTrain(formData);
        alert("New train created successfully!");
      }
      setIsModalOpen(false); // Đóng modal
      fetchTrains(); // Tải lại bảng dữ liệu
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert(error.response?.data?.message || "Failed to save train data.");
    }
  };

  // ================== LOGIC XÓA (DELETE) ==================
  const handleDelete = async (id) => {
    // Đảm bảo id tồn tại trước khi xóa
    if (!id) return alert("Không tìm thấy ID của tàu này!");

    if (window.confirm("Are you sure you want to delete this train?")) {
      try {
        await adminService.deleteTrain(id);
        alert("Train deleted successfully!");
        fetchTrains(); // Cập nhật lại UI ngay lập tức
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Failed to delete train.");
      }
    }
  };

  // ================== CẤU HÌNH CỘT CHO BẢNG ==================
  const columns = [
    {
      key: "trainCode",
      label: "Train Code",
      render: (row) => (
        <span className="font-bold text-slate-800">{row.trainCode}</span>
      ),
    },
    { key: "trainName", label: "Name" },
    {
      key: "carriages",
      label: "Capacity",
      render: (row) => {
        const totalSeats =
          row.carriages?.reduce((sum, c) => sum + Number(c.totalSeats), 0) || 0;
        return (
          <span>
            {row.carriages?.length || 0} carriages ({totalSeats} seats)
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const statusColors = {
          active: "bg-green-100 text-green-700",
          maintenance: "bg-yellow-100 text-yellow-700",
          retired: "bg-red-100 text-red-700",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${statusColors[row.status] || "bg-slate-100"}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrainIcon className="text-chuppaGreen" /> Manage Trains
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure physical trains and their carriages.
          </p>
        </div>
        {/* NÚT BẬT MODAL ADD NEW */}
        <button
          onClick={() => handleOpenModal()}
          className="bg-chuppaGreen hover:bg-chuppaGreen-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
        >
          <Plus size={18} /> Add New Train
        </button>
      </div>

      {/* Bảng Dữ Liệu (Truyền các hàm sửa/xóa vào đây) */}
      <DataTable
        columns={columns}
        data={trains}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="No trains found. Click 'Add New Train' to create one."
      />

      {/* MODAL FORM (Thêm/Sửa Tàu) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Train Details" : "Register New Train"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* BỌC TOÀN BỘ BODY & FOOTER VÀO TRONG THẺ FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Train Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EIP-3104"
                      value={formData.trainCode}
                      onChange={(e) =>
                        setFormData({ ...formData, trainCode: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Train Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Pendolino Express"
                      value={formData.trainName}
                      onChange={(e) =>
                        setFormData({ ...formData, trainName: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                    />
                  </div>
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
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Quản lý Toa tàu */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800 text-lg">
                      Carriages Configuration
                    </h4>
                    <button
                      type="button" // QUAN TRỌNG: Nút này không được là type submit
                      onClick={addCarriage}
                      className="text-sm font-medium text-chuppaGreen hover:bg-chuppaGreen/10 px-3 py-1.5 rounded-md transition-colors"
                    >
                      + Add Carriage
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.carriages.map((carriage, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-end gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200"
                      >
                        <div className="w-20">
                          <label className="block text-xs font-bold text-slate-500 mb-1">
                            Car. No
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={carriage.carriageNumber}
                            onChange={(e) =>
                              handleCarriageChange(
                                index,
                                "carriageNumber",
                                e.target.value,
                              )
                            }
                            className="w-full border border-slate-300 rounded p-2 text-sm outline-none focus:border-chuppaGreen"
                          />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <label className="block text-xs font-bold text-slate-500 mb-1">
                            Class / Type
                          </label>
                          <select
                            value={carriage.type}
                            onChange={(e) =>
                              handleCarriageChange(
                                index,
                                "type",
                                e.target.value,
                              )
                            }
                            className="w-full border border-slate-300 rounded p-2 text-sm outline-none focus:border-chuppaGreen"
                          >
                            <option value="soft_seat">
                              Soft Seat (Ghế mềm)
                            </option>
                            <option value="hard_seat">
                              Hard Seat (Ghế cứng)
                            </option>
                            <option value="soft_sleeper">
                              Soft Sleeper (Giường mềm)
                            </option>
                            <option value="hard_sleeper">
                              Hard Sleeper (Giường cứng)
                            </option>
                            <option value="vip">VIP Cabin</option>
                          </select>
                        </div>
                        <div className="w-28">
                          <label className="block text-xs font-bold text-slate-500 mb-1">
                            Total Seats
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={carriage.totalSeats}
                            onChange={(e) =>
                              handleCarriageChange(
                                index,
                                "totalSeats",
                                e.target.value,
                              )
                            }
                            className="w-full border border-slate-300 rounded p-2 text-sm outline-none focus:border-chuppaGreen"
                          />
                        </div>
                        <button
                          type="button" // QUAN TRỌNG: Không để form tự submit
                          onClick={() => removeCarriage(index)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors mb-px"
                          title="Remove Carriage"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Modal với Nút Submit nằm gọn trong Form */}
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
                  className="px-5 py-2.5 bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
                >
                  {editingId ? "Save Changes" : "Save New Train"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrains;

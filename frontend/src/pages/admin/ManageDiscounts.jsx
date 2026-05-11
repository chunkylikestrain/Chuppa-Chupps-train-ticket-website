// src/pages/admin/ManageDiscounts.jsx
import React, { useState, useEffect } from "react";
import { Tag, Plus, X } from "lucide-react";
import adminService from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";

const ManageDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrderValue: 0,
    maxUsage: 100,
    expiresAt: "",
    isActive: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getDiscounts();
      setDiscounts(res.data);
    } catch (error) {
      console.error("Failed to fetch discounts", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== LOGIC CRUD ==================
  const handleOpenModal = (discount = null) => {
    if (discount) {
      setFormData({
        ...discount,
        expiresAt: discount.expiresAt
          ? new Date(discount.expiresAt).toISOString().split("T")[0]
          : "",
      });
      setEditingId(discount._id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this discount code?")) {
      try {
        await adminService.deleteDiscount(id);
        fetchDiscounts();
      } catch (error) {
        console.error("Failed to delete discount", error);
        alert("Failed to delete discount.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đảm bảo code luôn viết hoa
      const payload = { ...formData, code: formData.code.toUpperCase() };

      if (editingId) {
        await adminService.updateDiscount(editingId, payload);
      } else {
        await adminService.createDiscount(payload);
      }
      setIsModalOpen(false);
      fetchDiscounts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save discount.");
    }
  };

  const columns = [
    {
      key: "code",
      label: "Promo Code",
      render: (row) => (
        <span className="font-black text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200 border-dashed">
          {row.code}
        </span>
      ),
    },
    {
      key: "value",
      label: "Discount Value",
      render: (row) => (
        <span className="font-bold text-chuppaGreen">
          {row.discountType === "percent"
            ? `${row.discountValue}% OFF`
            : `-${row.discountValue} PLN`}
        </span>
      ),
    },
    {
      key: "usage",
      label: "Usage",
      render: (row) => (
        <div className="text-xs text-slate-600">
          Used: <span className="font-bold">{row.usedCount || 0}</span> /{" "}
          {row.maxUsage}
        </div>
      ),
    },
    {
      key: "expiresAt",
      label: "Expires On",
      render: (row) => {
        const isExpired = new Date(row.expiresAt) < new Date();
        return (
          <span
            className={`text-sm ${isExpired ? "text-red-500 font-bold" : "text-slate-600"}`}
          >
            {new Date(row.expiresAt).toLocaleDateString()}{" "}
            {isExpired && "(Expired)"}
          </span>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-bold uppercase ${row.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
        >
          {row.isActive ? "Active" : "Disabled"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tag className="text-chuppaGreen" /> Manage Discounts
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create promo codes to boost ticket sales.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-chuppaGreen hover:bg-chuppaGreen-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={18} /> New Promo Code
        </button>
      </div>

      <DataTable
        columns={columns}
        data={discounts}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        emptyMessage="No discount codes found."
      />

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Promo Code" : "Create Promo Code"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form
              id="discountForm"
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Code Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER26"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-chuppaGreen uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-chuppaGreen"
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={
                      formData.discountType === "percent"
                        ? "e.g. 15"
                        : "e.g. 50"
                    }
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-chuppaGreen"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Max Usages *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxUsage}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUsage: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-chuppaGreen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-chuppaGreen"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-chuppaGreen rounded focus:ring-chuppaGreen"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-slate-700 cursor-pointer"
                >
                  Set as Active
                </label>
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 font-bold rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="discountForm"
                className="px-5 py-2.5 bg-chuppaGreen hover:bg-chuppaGreen-dark text-white font-bold rounded-lg text-sm shadow-sm"
              >
                {editingId ? "Save Changes" : "Create Promo Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDiscounts;

// src/pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import { Users, Shield, ShieldAlert, Lock, Unlock } from "lucide-react";
import adminService from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers(1, 100);
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ================== LOGIC ĐỔI ROLE & TRẠNG THÁI ==================
  const handleRoleChange = async (id, newRole) => {
    if (
      window.confirm(`Change this user's role to ${newRole.toUpperCase()}?`)
    ) {
      try {
        await adminService.updateUserRole(id, newRole);
        setUsers(
          users.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
        );
      } catch (error) {
        console.error("Failed to update user role", error);
        alert("Failed to update user role.");
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    // Giả sử backend dùng isActive (boolean) hoặc status (active/banned)
    // Ở đây ta dùng status: 'active' | 'banned'
    const newStatus = currentStatus === "active" ? "banned" : "active";
    const msg = newStatus === "banned" ? "Ban this user?" : "Unban this user?";

    if (window.confirm(msg)) {
      try {
        await adminService.toggleUserStatus(id, newStatus);
        setUsers(
          users.map((u) => (u._id === id ? { ...u, status: newStatus } : u)),
        );
      } catch (error) {
        console.error("Failed to update user status", error);
        alert("Failed to update user status.");
      }
    }
  };

  const columns = [
    {
      key: "user",
      label: "User Info",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase">
            {row.fullName?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-800">{row.fullName}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.role === "admin" ? (
            <Shield size={16} className="text-purple-500" />
          ) : (
            <ShieldAlert size={16} className="text-slate-400" />
          )}
          <select
            value={row.role}
            onChange={(e) => handleRoleChange(row._id, e.target.value)}
            className={`text-xs font-bold uppercase p-1 rounded outline-none border focus:ring-2 focus:ring-chuppaGreen ${
              row.role === "admin"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <option value="user">USER</option>
            <option value="admin">ADMIN</option>
          </select>
        </div>
      ),
    },
    {
      key: "status",
      label: "Account Status",
      render: (row) => {
        const isActive = row.status !== "banned"; // Mặc định là active
        return (
          <button
            onClick={() => handleStatusToggle(row._id, row.status || "active")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
              isActive
                ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"
            }`}
            title={isActive ? "Click to Ban" : "Click to Unban"}
          >
            {isActive ? <Unlock size={14} /> : <Lock size={14} />}
            {isActive ? "Active" : "Banned"}
          </button>
        );
      },
    },
    {
      key: "createdAt",
      label: "Joined Date",
      render: (row) => (
        <span className="text-slate-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-chuppaGreen" /> Manage Users
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Control user access, roles, and account statuses.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No users found."
      />
    </div>
  );
};

export default ManageUsers;

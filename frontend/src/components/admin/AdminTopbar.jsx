// src/components/admin/AdminTopbar.jsx
import React from "react";
import { Menu, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminTopbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 hidden sm:block">
          Control Panel
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium text-chuppaGreen hover:underline hidden sm:block"
        >
          Main Site ↗
        </button>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <UserCircle size={32} className="text-slate-400" />
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-500 leading-tight">
              Administrator
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

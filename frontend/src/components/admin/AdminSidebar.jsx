// src/components/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Train,
  Route,
  CalendarClock,
  CircleDollarSign,
  Ticket,
  Users,
  Tag,
  BarChart3,
  X,
  ShieldAlert, // 1. IMPORT THÊM ICON NÀY
} from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      exact: true,
    },
    { path: "/admin/trains", label: "Trains", icon: <Train size={20} /> },
    {
      path: "/admin/routes",
      label: "Routes",
      icon: <Route size={20} />,
    },
    {
      path: "/admin/schedules",
      label: "Schedules",
      icon: <CalendarClock size={20} />,
    },
    {
      path: "/admin/pricing",
      label: "Pricing",
      icon: <CircleDollarSign size={20} />,
    },
    {
      path: "/admin/bookings",
      label: "Bookings",
      icon: <Ticket size={20} />,
    },
    { path: "/admin/users", label: "Users", icon: <Users size={20} /> },

    // 2. THÊM NÚT VERIFICATIONS VÀO ĐÂY
    {
      path: "/admin/verifications",
      label: "Verifications",
      icon: <ShieldAlert size={20} />,
    },

    { path: "/admin/discounts", label: "Discounts", icon: <Tag size={20} /> },
    {
      path: "/admin/revenue",
      label: "Revenue",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <span className="text-xl font-black italic tracking-tighter text-chuppaGreen">
            Chuppa<span className="text-white font-sans not-italic">Admin</span>
          </span>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact} // Để `/admin` không bị active khi ở `/admin/trains`
              onClick={() => setIsOpen(false)} // Tự đóng sidebar trên mobile khi click
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium
                ${
                  isActive
                    ? "bg-chuppaGreen text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;

// Path: src/components/account/AccountSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Ticket,
  Users,
  Tag,
  CreditCard,
  Star,
  Settings,
  ShieldCheck,
} from "lucide-react";

const AccountSidebar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    { icon: <User size={18} />, label: "My Profile", path: "/account/profile" },
    {
      icon: <Ticket size={18} />,
      label: "My Tickets",
      path: "/account/tickets",
    },
    {
      icon: <Users size={18} />,
      label: "Passengers",
      path: "/account/passengers",
    },
    {
      icon: <Tag size={18} />,
      label: "Cards & Offers",
      path: "/account/cards",
    },
    {
      icon: <CreditCard size={18} />,
      label: "Transactions",
      path: "/account/transactions",
    },
    {
      icon: <Star size={18} />,
      label: "Loyalty Points",
      path: "/account/loyalty",
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      path: "/account/settings",
    },
    {
      icon: <ShieldCheck size={18} />,
      label: "Security",
      path: "/account/security",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header Info (Ẩn trên Mobile nhỏ) */}
      <div className="p-6 border-b border-slate-100 hidden md:flex flex-col items-center text-center bg-slate-50">
        <div className="w-20 h-20 rounded-full bg-chuppaGreen/10 border-2 border-white shadow-md flex items-center justify-center text-chuppaGreen text-2xl font-black mb-3 overflow-hidden">
          {user.avatar ? (
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user.fullName?.charAt(0).toUpperCase()
          )}
        </div>
        <h2 className="font-bold text-slate-800 text-lg">{user.fullName}</h2>
        <p className="text-xs text-slate-500 mb-3">{user.email}</p>
        <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 flex items-center gap-1">
          <Star size={12} className="fill-indigo-700" />
          {user.loyaltyPoints || 0} pts
        </div>
      </div>

      {/* Navigation (Cuộn ngang trên mobile, Dọc trên Desktop) */}
      <nav className="flex flex-row md:flex-col overflow-x-auto custom-scrollbar md:p-3 gap-1 md:gap-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 md:rounded-xl font-medium text-sm transition-colors whitespace-nowrap border-b-2 md:border-b-0
              ${
                isActive
                  ? "text-indigo-700 bg-indigo-50 border-indigo-600 md:border-transparent"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border-transparent"
              }
            `}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AccountSidebar;

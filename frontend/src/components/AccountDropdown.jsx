// Path: src/components/AccountDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Ticket,
  Users,
  Tag,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const AccountDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logic đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: <User size={16} />, label: "My Profile", path: "/account/profile" },
    {
      icon: <Ticket size={16} />,
      label: "My Tickets",
      path: "/account/tickets",
    },
    {
      icon: <Users size={16} />,
      label: "Passengers",
      path: "/account/passengers",
    },
    {
      icon: <Tag size={16} />,
      label: "Cards & Offers",
      path: "/account/cards",
    },
    {
      icon: <CreditCard size={16} />,
      label: "Transactions",
      path: "/account/transactions",
    },
    {
      icon: <Settings size={16} />,
      label: "Settings",
      path: "/account/settings",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Trigger Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Welcome back
          </span>
          <span className="text-sm font-black text-chuppaGreen">
            {user.fullName}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-chuppaGreen/10 border border-chuppaGreen/20 flex items-center justify-center text-chuppaGreen font-bold overflow-hidden shadow-sm">
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
      </button>

      {/* Dropdown Menu (Animation Fade-in & Slide-down) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-slate-50 mb-2">
            <p className="font-bold text-slate-800 truncate">{user.fullName}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <div className="flex flex-col">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-chuppaGreen hover:bg-slate-50 transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-50 mt-2 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;

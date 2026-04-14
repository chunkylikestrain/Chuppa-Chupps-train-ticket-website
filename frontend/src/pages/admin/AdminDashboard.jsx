import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Train,
  MapPin,
  Ticket,
  BarChart3,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import TrainManagement from "../../components/admin/TrainManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUser, setAdminUser] = useState(null);

  // 1. BẢO VỆ ROUTE: Kiểm tra xem có phải Admin không
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      alert("Access Denied! You do not have admin privileges.");
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Cấu hình Menu
  const menuItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "trains", label: "Trains", icon: <Train size={20} /> },
    { id: "stations", label: "Stations", icon: <MapPin size={20} /> },
    { id: "bookings", label: "Bookings", icon: <Ticket size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
  ];

  // Render Nội dung chính tùy theo Tab đang chọn
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Thẻ Thống kê giả lập */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
                  <Train size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Active Trains
                  </p>
                  <p className="text-2xl font-black text-gray-800">24</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-lg">
                  <Ticket size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Tickets Sold Today
                  </p>
                  <p className="text-2xl font-black text-gray-800">1,204</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-4 bg-yellow-50 text-yellow-600 rounded-lg">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Revenue (PLN)
                  </p>
                  <p className="text-2xl font-black text-gray-800">45,890</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "trains":
        return <TrainManagement />;
      case "stations":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Station Management
            </h2>
            <p className="text-gray-500 mt-2">
              Tính năng Quản lý ga tàu sẽ nằm ở đây...
            </p>
          </div>
        );
      case "bookings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Booking Management
            </h2>
            <p className="text-gray-500 mt-2">
              Danh sách đơn đặt vé sẽ nằm ở đây...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!adminUser) return null; // Tránh render nháy khi chưa check xong quyền

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* NỬA TRÁI: SIDEBAR */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl`}
      >
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {isSidebarOpen && (
            <span className="text-xl font-black italic tracking-tighter text-chuppaGreen">
              Chuppa<span className="text-white">Admin</span>
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        <div
          className={`p-4 border-b border-slate-800 flex items-center gap-3 ${!isSidebarOpen && "justify-center"}`}
        >
          <UserCircle size={32} className="text-gray-400" />
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{adminUser.fullName}</p>
              <p className="text-xs text-slate-400 truncate">
                {adminUser.email}
              </p>
            </div>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                activeTab === item.id
                  ? "bg-chuppaGreen text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${!isSidebarOpen && "justify-center"}`}
              title={!isSidebarOpen ? item.label : ""}
            >
              <div
                className={`${activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-chuppaGreen"}`}
              >
                {item.icon}
              </div>
              {isSidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-slate-800 w-full px-3 py-3 rounded-lg transition-colors ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* NỬA PHẢI: MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <h1 className="text-lg font-bold text-gray-800 capitalize">
            {menuItems.find((m) => m.id === activeTab)?.label || "Dashboard"}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-chuppaGreen font-medium hover:underline"
          >
            Go to Main Site ↗
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;

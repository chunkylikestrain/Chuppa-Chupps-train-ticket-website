// src/components/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Nửa trái: Sidebar */}
      <AdminSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Nửa phải: Nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <AdminTopbar
          toggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Khu vực render nội dung các trang (Dashboard, Quản lý tàu...) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

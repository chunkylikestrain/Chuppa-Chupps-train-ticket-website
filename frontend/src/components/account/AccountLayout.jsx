// Path: src/components/account/AccountLayout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";
import { ArrowLeft } from "lucide-react";

const AccountLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header tối giản (nếu chưa tích hợp chung Navbar) */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-black italic tracking-tighter text-indigo-600">
            Chuppa
            <span className="text-slate-800 font-sans not-italic text-lg ml-1">
              Account
            </span>
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Cột trái: Sidebar (Rộng 25%) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <AccountSidebar />
          </div>
        </aside>

        {/* Cột phải: Nội dung động (Rộng 75%) */}
        <main className="flex-1 min-w-0">
          <Outlet /> {/* Các trang Profile, Security... sẽ render ở đây */}
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;

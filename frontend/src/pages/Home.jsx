import React, { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  // 1. Khai báo công cụ chuyển trang
  const navigate = useNavigate();

  // 2. Tạo State để lưu trữ dữ liệu người dùng nhập
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");

  // 3. Hàm đảo chiều Ga đi và Ga đến
  const handleSwap = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  // 4. Hàm xử lý khi bấm nút Search
  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang

    // Kiểm tra xem đã nhập đủ ga đi và đến chưa
    if (!fromStation || !toStation) {
      alert("Please enter both Departure and Arrival stations! 🚂");
      return;
    }

    // Chuyển sang trang Results và GỬI KÈM DỮ LIỆU đi theo
    navigate("/results", {
      state: { fromStation, toStation, travelDate, travelTime },
    });
  };
  return (
    <div className="min-h-screen bg-chuppaGray flex flex-col font-sans text-gray-800">
      {/* 1. HEADER (Navbar) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-chuppaGreen italic tracking-tighter">
              ChuppaChup
            </span>
            <span className="text-xl font-bold text-gray-700">Train</span>
          </div>

          {/* Menu Links */}
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-chuppaGreen transition-colors">
              For Passengers
            </a>
            <a href="#" className="hover:text-chuppaGreen transition-colors">
              For Business
            </a>
            <a href="#" className="hover:text-chuppaGreen transition-colors">
              About Us
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 border-r pr-4">
              <span className="cursor-pointer hover:text-chuppaGreen">
                EN ▾
              </span>
              <span className="cursor-pointer">A A A</span>
            </div>
            <Link to="/login">
              <Button variant="ghost">Log in / Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Form tìm kiếm) */}
      {/* 2. HERO SECTION (Form tìm kiếm) */}
      <main className="flex-grow">
        <section className="bg-chuppaGreen-dark py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-12 bg-chuppaGreen-light opacity-20 rounded-b-[50%]"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-6">
              <span className="bg-white text-chuppaGreen-dark font-bold px-6 py-2 rounded-full shadow-lg">
                Your Green Journey Starts Here
              </span>
            </div>

            {/* THAY ĐỔI LỚN: Biến thẻ div thành thẻ form và thêm sự kiện onSubmit */}
            <form
              onSubmit={handleSearch}
              className="bg-chuppaGreen p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 items-end border border-chuppaGreen-light"
            >
              <div className="flex-1 w-full text-white">
                <Input
                  label="FROM"
                  placeholder="e.g. Warszawa Centralna"
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                />
              </div>

              {/* Nút mũi tên gọi hàm handleSwap */}
              <div
                onClick={handleSwap}
                className="pb-6 text-white cursor-pointer hover:scale-125 transition-transform flex items-center justify-center w-10 h-10"
                title="Swap stations"
              >
                ⇄
              </div>

              <div className="flex-1 w-full text-white">
                <Input
                  label="TO"
                  placeholder="e.g. Kraków Główny"
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                />
              </div>

              <div className="w-full md:w-40 text-white">
                <Input
                  label="WHEN"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>

              <div className="w-full md:w-32 text-white">
                <Input
                  label="TIME"
                  type="time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                />
              </div>

              <div className="w-full md:w-auto pb-4">
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-8 rounded-lg shadow-md transition-colors w-full h-[42px]"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* 3. QUICK LINKS SECTION */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-4xl font-black text-gray-800 text-center mb-8 italic tracking-wide">
            NIEŚPIESZNY <span className="text-chuppaGreen">(UNHURRIED)</span>
          </h2>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {[
              "Season ticket",
              "Reservations for season tickets",
              "Buy Interrail ticket",
              "Interrail/Eurail/NRT/EWT/FIP/OSŻD",
              "Intercity Card",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Icon giả lập */}
                  <span className="text-chuppaGreen text-xl">🎫</span>
                  <span className="font-medium text-gray-700">{item}</span>
                </div>
                <span className="text-gray-400">ⓘ</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. IMPORTANT INFORMATION SECTION */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Important information for passengers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Customer Service Centres",
              "Mobile Application",
              "Intercity Cards",
            ].map((info, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:border-chuppaGreen hover:shadow-md transition-all group"
              >
                <span className="text-gray-700 font-medium group-hover:text-chuppaGreen">
                  {info}
                </span>
                <span className="text-chuppaGreen">→</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FREQUENTLY SEARCHED - FOR PASSENGERS */}
        <section className="max-w-5xl mx-auto px-4 py-12 mt-4">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
              Frequently searched
            </p>
            <h2 className="text-3xl font-black text-gray-800">
              For Passengers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thẻ 1: Complaints */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-6 hover:shadow-lg hover:border-chuppaGreen transition-all cursor-pointer group">
              <div className="text-chuppaGreen w-14 h-14 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-700 group-hover:text-chuppaGreen">
                Complaints
              </span>
            </div>

            {/* Thẻ 2: Contact */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-6 hover:shadow-lg hover:border-chuppaGreen transition-all cursor-pointer group">
              <div className="text-chuppaGreen w-14 h-14 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                  ></path>
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-700 group-hover:text-chuppaGreen">
                Contact
              </span>
            </div>

            {/* Thẻ 3: Special Assistance */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-6 hover:shadow-lg hover:border-chuppaGreen transition-all cursor-pointer group">
              <div className="text-chuppaGreen w-14 h-14 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 19.5a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 16.5v-1.5a3 3 0 00-3-3h-4.5a3 3 0 00-3 3v1.5M12 9a3 3 0 100-6 3 3 0 000 6z"
                  ></path>
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-700 group-hover:text-chuppaGreen">
                Online form - special assistance
              </span>
            </div>

            {/* Thẻ 4: FAQ */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-6 hover:shadow-lg hover:border-chuppaGreen transition-all cursor-pointer group">
              <div className="text-chuppaGreen w-14 h-14 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.34 15.84c-.688-.06-1.386-.054-2.066.01-2.1.2-4.111.905-5.998 1.984v-1.073c0-1.593 1.12-2.956 2.67-3.238 1.054-.19 2.146-.286 3.25-.286s2.196.096 3.25.286c1.55.282 2.67 1.645 2.67 3.238v1.073c-1.887-1.08-3.898-1.785-5.998-1.984zM15 15.75a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-700 group-hover:text-chuppaGreen">
                Frequently Asked Questions
              </span>
            </div>
          </div>
        </section>

        {/* 6. SOCIAL & APP ICONS ROW */}
        <section className="max-w-5xl mx-auto px-4 py-6 border-t border-gray-200 flex justify-end items-center gap-4 text-gray-600">
          <span className="font-bold text-sm tracking-widest mr-2">
            ChuppaChup{" "}
            <span className="text-chuppaGreen border border-chuppaGreen px-1 rounded">
              PKP
            </span>
          </span>
        </section>
      </main>

      {/* 5. FOOTER (Thu gọn) */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 ChuppaChup Green Train. Built for a greener journey.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

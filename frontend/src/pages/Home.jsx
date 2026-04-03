import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Home = () => {
  const navigate = useNavigate();

  // --- LOGIC NHẬN DIỆN NGƯỜI DÙNG ---
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  // ----------------------------------

  // --- STATE CHO FORM TÌM KIẾM ---
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");

  // State cho danh sách gợi ý và trạng thái ẩn/hiện dropdown
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // --- HÀM GỌI API TÌM GA TÀU (Autocomplete) ---
  const handleFromChange = async (e) => {
    const value = e.target.value;
    setFromStation(value);

    if (value.trim().length > 0) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stations/search?q=${value}`,
        );
        setFromSuggestions(response.data);
        setShowFromDropdown(true);
      } catch (error) {
        console.error("Lỗi tải ga đi:", error);
      }
    } else {
      setShowFromDropdown(false);
    }
  };

  const handleToChange = async (e) => {
    const value = e.target.value;
    setToStation(value);

    if (value.trim().length > 0) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stations/search?q=${value}`,
        );
        setToSuggestions(response.data);
        setShowToDropdown(true);
      } catch (error) {
        console.error("Lỗi tải ga đến:", error);
      }
    } else {
      setShowToDropdown(false);
    }
  };

  // Hàm khi người dùng click chọn 1 ga từ Dropdown
  const selectFromStation = (stationName) => {
    setFromStation(stationName);
    setShowFromDropdown(false);
  };

  const selectToStation = (stationName) => {
    setToStation(stationName);
    setShowToDropdown(false);
  };
  // ---------------------------------------------

  const handleSwap = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!fromStation || !toStation) {
      alert("Please enter both Departure and Arrival stations! 🚂");
      return;
    }
    navigate("/results", {
      state: { fromStation, toStation, travelDate, travelTime },
    });
  };

  return (
    <div className="min-h-screen bg-chuppaGray flex flex-col font-sans text-gray-800">
      {/* 1. HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className="text-3xl font-black text-chuppaGreen italic tracking-tighter cursor-pointer"
              onClick={() => navigate("/")}
            >
              ChuppaChup
            </span>
            <span className="text-xl font-bold text-gray-700">Train</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-chuppaGreen transition-colors">
              For Passengers
            </a>
            <a href="#" className="hover:text-chuppaGreen transition-colors">
              For Business
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Welcome back
                  </span>
                  <span className="text-sm font-black text-chuppaGreen">
                    {user.fullName}
                  </span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost">Log in / Register</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION & FORM */}
      <main className="flex-grow">
        <section className="bg-chuppaGreen-dark py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-12 bg-chuppaGreen-light opacity-20 rounded-b-[50%]"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-6">
              <span className="bg-white text-chuppaGreen-dark font-bold px-6 py-2 rounded-full shadow-lg">
                Your Green Journey Starts Here
              </span>
            </div>

            <form
              onSubmit={handleSearch}
              className="bg-chuppaGreen p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 items-end border border-chuppaGreen-light"
            >
              {/* Ô NHẬP GA ĐI (CÓ DROPDOWN) */}
              <div className="flex-1 w-full text-white relative">
                <Input
                  label="FROM"
                  placeholder="e.g. Warszawa Centralna"
                  value={fromStation}
                  onChange={handleFromChange}
                  // Đóng dropdown khi click ra ngoài (dùng setTimeout để click vào dropdown vẫn nhận)
                  onBlur={() =>
                    setTimeout(() => setShowFromDropdown(false), 200)
                  }
                />

                {/* HIỂU ỨNG DROPDOWN TỰ XỔ XUỐNG */}
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <ul className="absolute z-50 top-[105%] left-0 w-full bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto border border-gray-200">
                    {fromSuggestions.map((station) => (
                      <li
                        key={station._id}
                        onClick={() => selectFromStation(station.name)}
                        className="px-4 py-3 text-gray-800 hover:bg-chuppaGreen hover:text-white cursor-pointer border-b border-gray-100 last:border-none transition-colors font-medium flex items-center gap-2"
                      >
                        <span className="text-xl">📍</span> {station.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* NÚT ĐẢO CHIỀU */}
              <div
                onClick={handleSwap}
                className="pb-6 text-white cursor-pointer hover:scale-125 transition-transform flex items-center justify-center w-10 h-10"
              >
                ⇄
              </div>

              {/* Ô NHẬP GA ĐẾN (CÓ DROPDOWN) */}
              <div className="flex-1 w-full text-white relative">
                <Input
                  label="TO"
                  placeholder="e.g. Kraków Główny"
                  value={toStation}
                  onChange={handleToChange}
                  onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                />

                {/* HIỂU ỨNG DROPDOWN TỰ XỔ XUỐNG */}
                {showToDropdown && toSuggestions.length > 0 && (
                  <ul className="absolute z-50 top-[105%] left-0 w-full bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto border border-gray-200">
                    {toSuggestions.map((station) => (
                      <li
                        key={station._id}
                        onClick={() => selectToStation(station.name)}
                        className="px-4 py-3 text-gray-800 hover:bg-chuppaGreen hover:text-white cursor-pointer border-b border-gray-100 last:border-none transition-colors font-medium flex items-center gap-2"
                      >
                        <span className="text-xl">📍</span> {station.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* NGÀY & GIỜ */}
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
      </main>
    </div>
  );
};

export default Home;

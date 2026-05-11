// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CircleDollarSign,
  Ticket,
  Users,
  CalendarClock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import adminService from "../../services/adminService";
import StatCard from "../../components/admin/StatCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Gọi song song 3 API để tối ưu tốc độ tải trang
      const [statsRes, revenueRes, bookingsRes] = await Promise.all([
        adminService.getOverviewStats(),
        adminService.getRevenueStats({ period: "daily" }), // Lấy doanh thu theo ngày
        adminService.getBookings({ limit: 5 }), // Lấy 5 đơn mới nhất
      ]);

      setStats(statsRes.data);

      // Xử lý dữ liệu biểu đồ: Chỉ lấy 7 ngày gần nhất
      const dailyData = revenueRes.data.slice(-7).map((item) => ({
        date: item._id.substring(5, 10), // Cắt lấy MM-DD cho ngắn gọn
        revenue: item.totalRevenue,
      }));
      setChartData(dailyData);

      // Lưu 5 đơn hàng
      // Lưu ý: Tùy backend trả về { bookings: [] } hay mảng thẳng []
      setRecentBookings(bookingsRes.data.bookings || bookingsRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Loader2 size={48} className="animate-spin mb-4 text-chuppaGreen" />
        <p>Loading overview data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3">
        <AlertCircle size={24} />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <button
          onClick={fetchDashboardData}
          className="text-sm font-medium text-chuppaGreen hover:underline"
        >
          Refresh Data
        </button>
      </div>

      {/* 1. SECTION: THẺ THỐNG KÊ (STAT CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue (This Month)"
          value={`${stats?.revenueThisMonth?.toLocaleString() || 0} PLN`}
          icon={<CircleDollarSign size={24} />}
          colorClass="bg-green-50 text-green-600"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={<Ticket size={24} />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users size={24} />}
          colorClass="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Schedules (This Month)"
          value={stats?.schedulesThisMonth || 0}
          icon={<CalendarClock size={24} />}
          colorClass="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. SECTION: BIỂU ĐỒ DOANH THU 7 NGÀY (RECHARTS) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Revenue - Last 7 Days
          </h2>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                    name="Revenue (PLN)"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                No revenue data for the last 7 days.
              </div>
            )}
          </div>
        </div>

        {/* 3. SECTION: ĐƠN HÀNG MỚI NHẤT */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Bookings
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-4 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {booking.bookingCode}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">
                      {booking.user?.fullName || "Guest User"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-chuppaGreen">
                      {booking.totalPrice} PLN
                    </p>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                No recent bookings found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// src/pages/admin/RevenueStats.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, Filter, Loader2, TrendingUp } from "lucide-react";
import adminService from "../../services/adminService";

const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#8B5CF6", "#EF4444"];

const RevenueStats = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [topRoutesData, setTopRoutesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc
  const [filters, setFilters] = useState({
    period: "daily", // 'daily' hoặc 'monthly'
    from: "",
    to: "",
  });

  useEffect(() => {
    fetchStats();
  }, [filters.period]); // Tự động load lại khi đổi Period

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Chuẩn bị params, loại bỏ các trường rỗng
      const params = { period: filters.period };
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const [revenueRes, topRoutesRes] = await Promise.all([
        adminService.getRevenueStats(params),
        adminService.getTopRoutes(),
      ]);

      // Format lại data cho BarChart
      const formattedRevenue = revenueRes.data.map((item) => ({
        date: filters.period === "daily" ? item._id.substring(5, 10) : item._id, // MM-DD hoặc YYYY-MM
        revenue: item.totalRevenue,
        tickets: item.ticketCount,
      }));

      setRevenueData(formattedRevenue);
      setTopRoutesData(topRoutesRes.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = () => {
    fetchStats();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="text-chuppaGreen" /> Revenue Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Deep dive into financial performance and sales trends.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
          <Filter size={18} /> Filters:
        </div>

        <select
          className="border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-chuppaGreen"
          value={filters.period}
          onChange={(e) => setFilters({ ...filters, period: e.target.value })}
        >
          <option value="daily">Daily View</option>
          <option value="monthly">Monthly View</option>
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            From:
          </span>
          <input
            type="date"
            className="border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-chuppaGreen"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            To:
          </span>
          <input
            type="date"
            className="border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-chuppaGreen"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>

        <button
          onClick={handleApplyFilter}
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Apply Filters
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-xl border border-slate-200">
          <Loader2 size={40} className="animate-spin mb-4 text-chuppaGreen" />
          <p>Analyzing financial data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BAR CHART: DOANH THU THEO THỜI GIAN */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-slate-400" />
              Revenue Over Time
            </h2>
            <div className="h-80 w-full">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
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
                      yAxisId="left"
                      orientation="left"
                      stroke="#2563EB"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
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
                      yAxisId="left"
                      dataKey="revenue"
                      fill="#2563EB"
                      radius={[4, 4, 0, 0]}
                      name="Revenue (PLN)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No revenue data for this period.
                </div>
              )}
            </div>
          </div>

          {/* PIE CHART: TOP 5 TUYẾN/TÀU */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Top 5 Performing Trains
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Based on total revenue generated.
            </p>

            <div className="h-48 w-full mb-6">
              {topRoutesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topRoutesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="revenue"
                    >
                      {topRoutesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()} PLN`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  No sales data available.
                </div>
              )}
            </div>

            {/* LEADERBOARD TABLE */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {topRoutesData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-white shadow-sm border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">
                          {item.tickets} tickets sold
                        </p>
                      </div>
                    </div>
                    <div className="font-black text-chuppaGreen text-sm">
                      {item.revenue.toLocaleString()} PLN
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueStats;

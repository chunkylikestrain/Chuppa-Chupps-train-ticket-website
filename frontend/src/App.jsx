// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import MyTickets from "./pages/MyTickets";
import AccountLayout from "./components/account/AccountLayout";
import ProfilePage from "./pages/account/ProfilePage";
import SecurityPage from "./pages/account/SecurityPage";
import Home from "./pages/Home";
import MyTicketsPage from "./pages/account/MyTicketsPage";
import PassengersPage from "./pages/account/PassengersPage";
import CardsPage from "./pages/account/CardsPage";
import TransactionsPage from "./pages/account/TransactionsPage";
import LoyaltyPage from "./pages/account/LoyaltyPage";
import SettingsPage from "./pages/account/SettingsPage";

// Import Admin components
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTrains from "./pages/admin/ManageTrains";
import ManageRoutes from "./pages/admin/ManageRoutes";
import ManageSchedules from "./pages/admin/ManageSchedules";
import ManagePricing from "./pages/admin/ManagePricing";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDiscounts from "./pages/admin/ManageDiscounts";
import RevenueStats from "./pages/admin/RevenueStats";
import ManageVerifications from "./pages/admin/ManageVerifications";

// Temporary Placeholder Component for unbuilt Admin pages
const Placeholder = ({ title }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
    <p className="text-slate-500 mt-2">This page is under construction...</p>
  </div>
);

const ProtectedRoute = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================== */}
        {/* CLIENT ROUTES */}
        {/* ========================================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />

        {/* ========================================== */}
        {/* 3. CỤM ROUTE CHO ACCOUNT */}
        <Route path="/account" element={<ProtectedRoute />}>
          <Route element={<AccountLayout />}>
            <Route index element={<Navigate to="profile" />} />{" "}
            {/* Mặc định vào Profile */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="security" element={<SecurityPage />} />
            {/* Các trang còn lại sẽ thêm ở các bước sau */}
            <Route path="tickets" element={<MyTicketsPage />} />
            <Route path="passengers" element={<PassengersPage />} />
            <Route path="cards" element={<CardsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="loyalty" element={<LoyaltyPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* ========================================== */}
        {/* ADMIN ROUTES */}
        {/* ========================================== */}
        {/* 1. Protection Layer: Check Admin Role */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          {/* 2. Layout Layer: Sidebar and Topbar */}
          <Route element={<AdminLayout />}>
            {/* 3. Content Pages */}
            <Route index element={<AdminDashboard />} />

            <Route path="trains" element={<ManageTrains />} />
            <Route path="routes" element={<ManageRoutes />} />
            <Route path="schedules" element={<ManageSchedules />} />
            <Route path="pricing" element={<ManagePricing />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="verifications" element={<ManageVerifications />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="discounts" element={<ManageDiscounts />} />
            <Route path="revenue" element={<RevenueStats />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

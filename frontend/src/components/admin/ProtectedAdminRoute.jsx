// src/components/admin/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const userStr = localStorage.getItem("user");

  // Chưa đăng nhập
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // Đã đăng nhập nhưng không phải admin
  if (user.role !== "admin") {
    alert("Access Denied: You do not have administrator privileges.");
    return <Navigate to="/" replace />;
  }

  // Hợp lệ, cho phép render các route con bên trong
  return <Outlet />;
};

export default ProtectedAdminRoute;

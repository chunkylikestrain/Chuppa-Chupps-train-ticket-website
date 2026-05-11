// src/services/adminService.js
import axiosInstance from "./axiosInstance";

const adminService = {
  // ================== THỐNG KÊ ==================
  getOverviewStats: () => axiosInstance.get("/api/admin/stats/overview"),
  getRevenueStats: (params) =>
    axiosInstance.get("/api/admin/stats/revenue", { params }), // params: { period, from, to }
  getTopRoutes: () => axiosInstance.get("/api/admin/stats/top-routes"),

  // ================== TÀU ==================
  getTrains: (page = 1, limit = 10) =>
    axiosInstance.get("/api/admin/trains", { params: { page, limit } }),
  createTrain: (data) => axiosInstance.post("/api/admin/trains", data),
  updateTrain: (id, data) => axiosInstance.put(`/api/admin/trains/${id}`, data),
  deleteTrain: (id) => axiosInstance.delete(`/api/admin/trains/${id}`),

  // ================== TUYẾN ĐƯỜNG ==================
  getRoutes: (page = 1, limit = 10) =>
    axiosInstance.get("/api/admin/routes", { params: { page, limit } }),
  createRoute: (data) => axiosInstance.post("/api/admin/routes", data),
  updateRoute: (id, data) => axiosInstance.put(`/api/admin/routes/${id}`, data),
  deleteRoute: (id) => axiosInstance.delete(`/api/admin/routes/${id}`),

  // ================== LỊCH CHẠY TÀU ==================
  getSchedules: (params) =>
    axiosInstance.get("/api/admin/schedules", { params }), // params: { date, routeId, status, page, limit }
  createSchedule: (data) => axiosInstance.post("/api/admin/schedules", data),
  updateSchedule: (id, data) =>
    axiosInstance.put(`/api/admin/schedules/${id}`, data),
  updateScheduleStatus: (id, status) =>
    axiosInstance.patch(`/api/admin/schedules/${id}/status`, { status }),
  deleteSchedule: (id) => axiosInstance.delete(`/api/admin/schedules/${id}`),

  // ================== GIÁ VÉ ==================
  getPricing: () => axiosInstance.get("/api/admin/pricing"),
  createPricing: (data) => axiosInstance.post("/api/admin/pricing", data),
  updatePricing: (id, data) =>
    axiosInstance.put(`/api/admin/pricing/${id}`, data),
  deletePricing: (id) => axiosInstance.delete(`/api/admin/pricing/${id}`),

  // ================== ĐƠN ĐẶT VÉ ==================
  getBookings: (params) => axiosInstance.get("/api/admin/bookings", { params }),
  getBookingDetail: (id) => axiosInstance.get(`/api/admin/bookings/${id}`),
  updateBookingStatus: (id, status) =>
    axiosInstance.patch(`/api/admin/bookings/${id}/status`, { status }),

  // ================== NGƯỜI DÙNG ==================
  getUsers: (page = 1, limit = 10) =>
    axiosInstance.get("/api/admin/users", { params: { page, limit } }),
  getUserDetail: (id) => axiosInstance.get(`/api/admin/users/${id}`),
  toggleUserStatus: (id, status) =>
    axiosInstance.patch(`/api/admin/users/${id}/status`, { status }),
  updateUserRole: (id, role) =>
    axiosInstance.patch(`/api/admin/users/${id}/role`, { role }),

  // QUẢN LÝ PHÊ DUYỆT THẺ
  getPendingCards: () => axiosInstance.get("/api/admin/verifications/cards"),
  verifyCard: (userId, action) =>
    axiosInstance.put(`/api/admin/verifications/cards/${userId}`, { action }),

  // ================== MÃ GIẢM GIÁ ==================
  getDiscounts: () => axiosInstance.get("/api/admin/discounts"),
  createDiscount: (data) => axiosInstance.post("/api/admin/discounts", data),
  updateDiscount: (id, data) =>
    axiosInstance.put(`/api/admin/discounts/${id}`, data),
  deleteDiscount: (id) => axiosInstance.delete(`/api/admin/discounts/${id}`),
};

export default adminService;

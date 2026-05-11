// Path: src/services/accountService.js
import axiosInstance from "./axiosInstance";

const accountService = {
  // --- THÔNG TIN CÁ NHÂN ---
  getProfile: () => axiosInstance.get("/api/account/profile"),
  updateProfile: (data) => axiosInstance.put("/api/account/profile", data),
  uploadAvatar: (formData) =>
    axiosInstance.post("/api/account/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changePassword: (data) =>
    axiosInstance.put("/api/account/change-password", data),

  // --- THẺ ƯU ĐÃI ---
  getCards: () => axiosInstance.get("/api/account/cards"),
  submitStudentCard: (formData) =>
    axiosInstance.post("/api/account/student-card", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteStudentCard: () => axiosInstance.delete("/api/account/student-card"),

  // --- HÀNH KHÁCH THƯỜNG DÙNG ---
  getPassengers: () => axiosInstance.get("/api/account/passengers"),
  addPassenger: (data) => axiosInstance.post("/api/account/passengers", data),
  updatePassenger: (id, data) =>
    axiosInstance.put(`/api/account/passengers/${id}`, data),
  deletePassenger: (id) =>
    axiosInstance.delete(`/api/account/passengers/${id}`),
  setDefaultPassenger: (id) =>
    axiosInstance.patch(`/api/account/passengers/${id}/default`),

  // --- CÁC TÍNH NĂNG KHÁC ---
  getTransactions: (params) =>
    axiosInstance.get("/api/account/transactions", { params }),
  getLoyaltyInfo: () => axiosInstance.get("/api/account/loyalty"),
  updateNotifications: (data) =>
    axiosInstance.put("/api/account/notifications", data),
  getLoginHistory: () => axiosInstance.get("/api/account/login-history"),
};

export default accountService;

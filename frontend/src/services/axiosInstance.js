// src/services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // Sử dụng biến môi trường nếu có, nếu không dùng localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request: Gắn token vào header trước khi gửi API
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor Response: Xử lý lỗi cục bộ (VD: Hết hạn token)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token và user khỏi local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect về trang login (Dùng window.location để điều hướng ngoài Component)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

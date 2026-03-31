import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Xóa lỗi cũ

    try {
      // 1. Gửi request đăng nhập lên Backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      // 2. Nếu thành công, Backend sẽ trả về token và thông tin user
      const { token, user, message } = response.data;

      // 3. Cất Token và User vào LocalStorage của trình duyệt
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 4. Thông báo và chuyển hướng về Trang chủ
      alert("👋 " + message);
      navigate("/");
    } catch (error) {
      // 5. Bắt lỗi (sai mật khẩu, sai email...)
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-chuppaGray font-sans">
      {/* NỬA TRÁI: Form Đăng Nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white shadow-[10px_0_15px_-3px_rgba(0,0,0,0.1)] z-10">
        <div className="w-full max-w-md">
          {/* Nút quay lại */}
          <Link
            to="/"
            className="mb-8 text-gray-400 hover:text-chuppaGreen transition-colors flex items-center gap-2 w-max"
          >
            ← Back to Home
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-800 mb-2">
              Welcome Back 🚂
            </h1>
            <p className="text-gray-500">
              Log in to manage your tickets and travel green.
            </p>
          </div>

          {/* Hiển thị lỗi nếu đăng nhập sai */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right mt-2">
                <a
                  href="#"
                  className="text-sm text-chuppaGreen font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" fullWidth variant="primary">
              Log In
            </Button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-chuppaGreen font-bold hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* NỬA PHẢI: Banner (Giữ nguyên) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-chuppaGreen-dark to-chuppaGreen-light items-center justify-center p-12 relative overflow-hidden">
        {/* Vòng tròn trang trí mờ */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-white opacity-10"></div>

        <div className="text-center text-white z-10 max-w-lg">
          <h2 className="text-5xl font-black italic tracking-wider mb-6">
            TRAVEL GREEN
            <br />
            TRAVEL FAST
          </h2>
          <p className="text-xl font-medium opacity-90 leading-relaxed">
            The most eco-friendly way to travel across Poland. Book your tickets
            in seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

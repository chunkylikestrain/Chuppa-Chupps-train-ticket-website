import React, { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // Ngăn form tự động reload trang
    console.log("Đang đăng nhập với:", email, password);
    // TODO: Gọi API Backend ở đây sau này
  };

  return (
    <div className="min-h-screen flex bg-chuppaGray font-sans">
      {/* NỬA TRÁI: Form Đăng Nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white shadow-[10px_0_15px_-3px_rgba(0,0,0,0.1)] z-10">
        <div className="w-full max-w-md">
          {/* Nút quay lại Trang chủ (tạm thời dùng icon text) */}
          <Link
            to="/"
            className="mb-8 text-gray-400 hover:text-chuppaGreen transition-colors flex items-center gap-2 w-max"
          >
            ← Back to Home
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-800 mb-2">
              Welcome Back! 👋
            </h1>
            <p className="text-gray-500">
              Please enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a
                href="#"
                className="absolute right-0 -top-1 text-sm text-chuppaGreen hover:text-chuppaGreen-dark font-semibold"
              >
                Forgot password?
              </a>
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

      {/* NỬA PHẢI: Banner (Chỉ hiện trên màn hình lớn) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-chuppaGreen-light to-chuppaGreen-dark items-center justify-center p-12 relative overflow-hidden">
        {/* Vòng tròn trang trí mờ */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-white opacity-10"></div>

        <div className="text-center text-white z-10 max-w-lg">
          <h2 className="text-5xl font-black italic tracking-wider mb-6">
            CHUPPACHUP
            <br />
            GREEN TRAIN
          </h2>
          <p className="text-xl font-medium opacity-90 leading-relaxed">
            Fast, eco-friendly, and convenient travel across Poland. Book your
            tickets in seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Register = () => {
  // Quản lý trạng thái (state) cho các ô nhập liệu
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Kiểm tra cơ bản ở Frontend trước khi gửi lên Backend
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Đang đăng ký tài khoản cho:", fullName, email);
    // TODO: Gọi API Backend tạo User ở đây sau này
  };

  return (
    <div className="min-h-screen flex bg-chuppaGray font-sans">
      {/* NỬA TRÁI: Form Đăng Ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white shadow-[10px_0_15px_-3px_rgba(0,0,0,0.1)] z-10 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Nút quay lại */}
          <Link
            to="/"
            className="mb-6 text-gray-400 hover:text-chuppaGreen transition-colors flex items-center gap-2 w-max"
          >
            ← Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-800 mb-2">
              Join Us Today 🚂
            </h1>
            <p className="text-gray-500">
              Create an account to book your green journeys faster.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Jan Kowalski"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Checkbox Đồng ý điều khoản */}
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-chuppaGreen-light accent-chuppaGreen"
                  required
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                I agree to the{" "}
                <a href="#" className="text-chuppaGreen hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-chuppaGreen hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <Button type="submit" fullWidth variant="primary">
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-chuppaGreen font-bold hover:underline"
            >
              Log in here
            </Link>
          </div>
        </div>
      </div>

      {/* NỬA PHẢI: Banner (Giống trang Login để tạo sự đồng nhất) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-chuppaGreen-dark to-chuppaGreen-light items-center justify-center p-12 relative overflow-hidden">
        {/* Vòng tròn trang trí mờ */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-white opacity-10"></div>

        <div className="text-center text-white z-10 max-w-lg">
          <h2 className="text-5xl font-black italic tracking-wider mb-6">
            START YOUR
            <br />
            JOURNEY
          </h2>
          <p className="text-xl font-medium opacity-90 leading-relaxed">
            Join thousands of passengers traveling comfortably and sustainably
            across Poland.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

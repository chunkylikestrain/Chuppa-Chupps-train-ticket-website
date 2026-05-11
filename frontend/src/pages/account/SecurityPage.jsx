/* eslint-disable no-unused-vars */
// Path: src/pages/account/SecurityPage.jsx
import React, { useState, useEffect } from "react";
import { ShieldCheck, Key, Smartphone, Monitor } from "lucide-react";
import accountService from "../../services/accountService";

const SecurityPage = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loginHistory, setLoginHistory] = useState([]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Tải lịch sử đăng nhập khi vào trang
    const fetchHistory = async () => {
      try {
        const res = await accountService.getLoginHistory();
        setLoginHistory(res.data);
      } catch (error) {
        console.error("Failed to load history");
      }
    };
    fetchHistory();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showMessage("error", "New passwords do not match.");
    }
    if (passwords.newPassword.length < 6) {
      return showMessage("error", "Password must be at least 6 characters.");
    }

    try {
      await accountService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      showMessage("success", "Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }); // Xóa trắng form
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Failed to update password.",
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" /> Security Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Update your password and secure your account.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg font-medium text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ĐỔI MẬT KHẨU */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="text-slate-400" size={20} />
            <h2 className="font-bold text-lg text-slate-800">
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* XÁC THỰC 2 LỚP (2FA) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="text-slate-400" size={20} />
                <h2 className="font-bold text-lg text-slate-800">
                  Two-Factor Auth (2FA)
                </h2>
              </div>
              {/* Fake Toggle Switch UI */}
              <button
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${is2FAEnabled ? "bg-indigo-600" : "bg-slate-300"}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${is2FAEnabled ? "left-7" : "left-1"}`}
                ></div>
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Add an extra layer of security to your account. Once enabled,
              you'll be prompted to enter a code from Google Authenticator
              during login.
            </p>

            {is2FAEnabled && (
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                <div className="w-32 h-32 bg-white mx-auto mb-2 border p-2 flex justify-center items-center">
                  {/* Giả lập QRCode */}
                  <span className="text-xs text-slate-400">QR Code Mockup</span>
                </div>
                <p className="text-xs font-bold text-indigo-700">
                  Scan this code with your Authenticator app
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LỊCH SỬ ĐĂNG NHẬP */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="font-bold text-lg text-slate-800 mb-4">
          Recent Login Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-3 font-medium">Device & Location</th>
                <th className="pb-3 font-medium">IP Address</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loginHistory.length > 0 ? (
                loginHistory.map((history, idx) => (
                  <tr key={idx}>
                    <td className="py-3 flex items-center gap-2 text-slate-700">
                      <Monitor size={16} className="text-slate-400" />
                      {history.device || "Unknown Web Browser"}
                      {idx === 0 && (
                        <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          Current Session
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-xs">
                      {history.ip || "192.168.1.1"}
                    </td>
                    <td className="py-3 text-slate-600">
                      {new Date(history.loginAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-slate-400">
                    No recent login data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;

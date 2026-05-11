/* eslint-disable no-unused-vars */
// Path: src/pages/account/ProfilePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { User, Upload, Save, Loader2, CheckCircle2 } from "lucide-react";
import accountService from "../../services/accountService";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // State cho thông tin form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "other",
    nationalId: "",
    passportNumber: "",
    passengerType: "",
  });

  // State cho Avatar
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await accountService.getProfile();
      const user = res.data;

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "", // Cắt lấy YYYY-MM-DD
        gender: user.gender || "other",
        nationalId: user.nationalId || "",
        passportNumber: user.passportNumber || "",
      });

      if (user.avatar) {
        setAvatarPreview(`http://localhost:5000${user.avatar}`);
      }
    } catch (error) {
      showMessage("error", "Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // ================== LOGIC UPLOAD AVATAR ==================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return showMessage("error", "Image size must be less than 5MB.");
      }
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Preview ảnh ngay lập tức
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("avatar", selectedFile);

      const res = await accountService.uploadAvatar(formDataToSend);
      setAvatarPreview(`http://localhost:5000${res.data.avatar}`);
      setSelectedFile(null);
      showMessage("success", "Profile picture updated successfully!");

      // Cập nhật lại user trong localStorage để Header nhận diện ảnh mới
      const currentUser = JSON.parse(localStorage.getItem("user"));
      currentUser.avatar = res.data.avatar;
      localStorage.setItem("user", JSON.stringify(currentUser));
      window.dispatchEvent(new Event("storage")); // Kích hoạt render lại Navbar (tuỳ chọn)
    } catch (error) {
      showMessage("error", "Failed to upload image.");
    }
  };

  // ================== LOGIC CẬP NHẬT PROFILE ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await accountService.updateProfile(formData);
      showMessage("success", "Profile updated successfully!");

      // Cập nhật lại tên trong localStorage nếu có đổi
      const currentUser = JSON.parse(localStorage.getItem("user"));
      currentUser.fullName = formData.fullName;
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      showMessage("error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">
        <Loader2 className="animate-spin mx-auto mb-4" /> Loading profile...
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <User className="text-indigo-600" /> My Profile
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal information and identity documents.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg font-medium text-sm flex items-center gap-2 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <Loader2 size={18} />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CỘT TRÁI: AVATAR */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-fit">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-md mb-4 overflow-hidden bg-slate-100 flex items-center justify-center text-slate-300">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} />
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          {!selectedFile ? (
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
            >
              <Upload size={16} /> Change Picture
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleAvatarUpload}
                className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
              >
                Save Image
              </button>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setAvatarPreview(null);
                  fetchProfile();
                }}
                className="text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-4">
            Allowed JPG, PNG or WEBP. Max size of 5MB.
          </p>
        </div>

        {/* CỘT PHẢI: FORM THÔNG TIN */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg outline-none cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  placeholder="e.g. +48 123 456 789"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  National ID (PESEL/CCCD)
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Passport Number
                </label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, passportNumber: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm uppercase"
                />
              </div>

              {/* Thêm ô chọn Loại hành khách */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Passenger Type
                </label>
                <select
                  value={formData.passengerType || "adult"}
                  onChange={(e) =>
                    setFormData({ ...formData, passengerType: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm"
                >
                  <option value="adult">Adult (12-59 years)</option>
                  <option value="child">Child (Under 12)</option>
                  <option value="student">Student (Requires Card)</option>
                  <option value="senior">Senior (60+ years)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/* eslint-disable no-unused-vars */
// Path: src/pages/admin/ManageVerifications.jsx
import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  FileImage,
  Loader2,
} from "lucide-react";
import adminService from "../../services/adminService";

const ManageVerifications = () => {
  const [pendingCards, setPendingCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Để phóng to ảnh

  useEffect(() => {
    fetchPendingCards();
  }, []);

  const fetchPendingCards = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPendingCards();
      setPendingCards(res.data);
    } catch (error) {
      console.error("Failed to fetch pending cards", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (userId, action) => {
    const confirmMsg =
      action === "approve"
        ? "Approve this student card? They will receive a 51% discount."
        : "Reject this card? The user will have to submit a new one.";

    if (window.confirm(confirmMsg)) {
      try {
        await adminService.verifyCard(userId, action);
        // Cập nhật lại UI bằng cách lọc user đó ra khỏi danh sách pending
        setPendingCards(pendingCards.filter((user) => user._id !== userId));
      } catch (error) {
        alert(`Failed to ${action} card.`);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-chuppaGreen" /> Card Verifications
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and approve uploaded student ID cards for discounts.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center">
          <Loader2 className="animate-spin mb-2 text-chuppaGreen" size={32} />{" "}
          Loading pending requests...
        </div>
      ) : pendingCards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500">
          <CheckCircle size={48} className="mx-auto text-green-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            All caught up!
          </h3>
          <p className="text-sm">
            There are no pending card verification requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingCards.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6"
            >
              {/* Ảnh thẻ */}
              <div
                className="w-full sm:w-32 h-32 bg-slate-100 rounded-lg border-2 border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden group"
                onClick={() =>
                  setSelectedImage(
                    `http://localhost:5000${user.studentCard.imageUrl}`,
                  )
                }
                title="Click to enlarge"
              >
                {user.studentCard.imageUrl ? (
                  <img
                    src={`http://localhost:5000${user.studentCard.imageUrl}`}
                    alt="ID Card"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <FileImage className="text-slate-300" size={32} />
                )}
              </div>

              {/* Thông tin */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {user.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">{user.email}</p>

                  <div className="space-y-1 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p>
                      <span className="text-slate-400 font-medium">Uni:</span>{" "}
                      <strong>{user.studentCard.university}</strong>
                    </p>
                    <p>
                      <span className="text-slate-400 font-medium">Major:</span>{" "}
                      {user.studentCard.major}
                    </p>
                    <p>
                      <span className="text-slate-400 font-medium">ID No:</span>{" "}
                      {user.studentCard.studentId}
                    </p>
                    <p>
                      <span className="text-slate-400 font-medium">
                        Expiry:
                      </span>{" "}
                      <span className="text-red-500 font-bold">
                        {new Date(
                          user.studentCard.expiresAt,
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleVerification(user._id, "approve")}
                    className="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleVerification(user._id, "reject")}
                    className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal phóng to ảnh */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged ID"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default ManageVerifications;

// Path: src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Loader2,
  Lock,
  Smartphone,
  AlertCircle,
  Users,
  Tag,
  Star,
} from "lucide-react";
import Button from "../components/ui/Button";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state || {};
  const schedule = bookingData.selectedSchedule || {};

  // --- STATE QUẢN LÝ LUỒNG (STEPS) ---
  const [step, setStep] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [finalBookingCode, setFinalBookingCode] = useState("");

  // --- STATE DỮ LIỆU CƠ BẢN ---
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Card Details
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Auth
  const [authPassword, setAuthPassword] = useState("");
  const [useOtp, setUseOtp] = useState(false);

  // Voucher & Discount States
  const [userProfile, setUserProfile] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  const [usePoints, setUsePoints] = useState(false);

  // ==========================================
  // STATE DANH SÁCH HÀNH KHÁCH
  // ==========================================
  const [passengerList, setPassengerList] = useState([]);

  useEffect(() => {
    if (!bookingData.totalPrice) {
      navigate("/");
      return;
    }

    const initialPassengers = bookingData.selectedSeats.map((seat, index) => ({
      id: index,
      seatDisplay: seat,
      fullName: "",
      idCard: "",
      type: "adult",
    }));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email || "");
      if (initialPassengers.length > 0) {
        initialPassengers[0].fullName = user.fullName || "";
        initialPassengers[0].idCard = user.nationalId || "";
      }
    }
    setPassengerList(initialPassengers);

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/account/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUserProfile(res.data);
      } catch (error) {
        console.error("Lỗi lấy profile", error);
      }
    };
    fetchProfile();
  }, [bookingData, navigate]);

  const updatePassenger = (index, field, value) => {
    const updatedList = [...passengerList];
    updatedList[index][field] = value;
    setPassengerList(updatedList);
  };

  // ==========================================
  // XỬ LÝ CHUYỂN BƯỚC (BỌC LÓT RÀNG BUỘC)
  // ==========================================
  const handleProceedToStep2 = () => {
    // Ràng buộc cứng: Quét xem có ông nào chưa nhập tên không
    const hasEmptyName = passengerList.some(
      (p) => !p.fullName || p.fullName.trim() === "",
    );

    if (hasEmptyName) {
      alert("Please enter full names for all passengers before proceeding!");
      return; // Cắt ngang, không cho chuyển bước
    }

    setStep(2);
  };

  // ==========================================
  // LOGIC TÍNH TOÁN GIÁ TIỀN, VOUCHER & ĐIỂM THƯỞNG
  // ==========================================
  const basePricePerSeat =
    bookingData.totalPrice / (bookingData.selectedSeats?.length || 1);

  const calculateSubtotal = () => {
    let total = 0;
    passengerList.forEach((p) => {
      let price = basePricePerSeat;
      if (p.type === "student" || p.type === "child") price = price * 0.5;
      if (p.type === "senior") price = price * 0.7;
      total += price;
    });
    return total;
  };

  const subTotal = calculateSubtotal();

  const hasDiscountedPassenger = passengerList.some(
    (p) => p.type === "student" || p.type === "child" || p.type === "senior",
  );

  useEffect(() => {
    if (hasDiscountedPassenger && appliedVoucher) {
      setAppliedVoucher(null);
      setVoucherError(
        "Voucher removed because standard discounts are applied.",
      );
    }
  }, [hasDiscountedPassenger, appliedVoucher]);

  let voucherDiscount = 0;
  if (appliedVoucher && !hasDiscountedPassenger) {
    if (appliedVoucher.discountType === "percent") {
      voucherDiscount = (subTotal * appliedVoucher.discountValue) / 100;
    } else {
      voucherDiscount = appliedVoucher.discountValue;
    }
  }

  const priceAfterVoucher = Math.max(0, subTotal - voucherDiscount);

  const availablePoints = userProfile?.loyaltyPoints || 0;
  let pointsToUse = 0;
  let pointsDiscount = 0;

  if (usePoints && availablePoints > 0) {
    const maxPointsNeeded = Math.floor(priceAfterVoucher * 10);
    pointsToUse = Math.min(availablePoints, maxPointsNeeded);
    pointsDiscount = pointsToUse / 10;
  }

  const finalPrice = Math.max(0, priceAfterVoucher - pointsDiscount);

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    setVoucherError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/public/validate-voucher",
        { code: voucherCode },
      );
      setAppliedVoucher(res.data);
    } catch (error) {
      setVoucherError(error.response?.data?.message || "Invalid voucher code");
      setAppliedVoucher(null);
    }
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(val.substring(0, 19));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setExpiry(val.substring(0, 5));
  };

  // ==========================================
  // XỬ LÝ THANH TOÁN
  // ==========================================
  const processPayment = async () => {
    setStep(4);
    setIsProcessing(true);
    setPaymentError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const formattedPassengers = passengerList.map((p) => ({
        fullName: p.fullName,
        idCard: p.idCard || "N/A",
        ticketType: p.type,
      }));

      const payload = {
        train: bookingData.selectedSchedule.trainId,
        scheduleId:
          bookingData.selectedSchedule.scheduleId ||
          bookingData.selectedSchedule._id ||
          schedule.scheduleId,
        seats: bookingData.selectedSeats,
        totalPrice: finalPrice,
        usedPoints: pointsToUse,
        passengers: formattedPassengers,
        status: "confirmed",
        journeyDetails: {
          fromStation: schedule.fromStation,
          toStation: schedule.toStation,
          travelDate: schedule.travelDate,
          departureTime: schedule.departureTime,
          arrivalTime: schedule.arrivalTime,
          trainCode: schedule.trainCode,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        payload,
        config,
      );

      if (response.data.user) {
        setUserProfile(response.data.user);
        const currentLocalUser = JSON.parse(
          localStorage.getItem("user") || "{}",
        );
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentLocalUser,
            loyaltyPoints: response.data.user.loyaltyPoints,
          }),
        );
      }

      setFinalBookingCode(response.data.booking.bookingCode);
      setStep(5);
    } catch (error) {
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Your card was declined.",
      );
      setStep(6);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData.totalPrice || passengerList.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col pb-12">
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        {step > 1 && step < 4 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ChevronLeft size={20} /> Back
          </button>
        ) : (
          <div className="w-20"></div>
        )}
        <div className="text-xl font-black italic tracking-tighter text-chuppaGreen">
          Chuppa
          <span className="text-white font-sans not-italic text-lg ml-1">
            Secure
          </span>
        </div>
        <div className="w-20 text-right text-xs text-gray-400">
          Step {step > 4 ? 4 : step}/4
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users className="text-chuppaGreen" /> Passenger Details
              </h1>

              <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl text-sm font-medium flex gap-3 mb-6">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p>
                  Please ensure passenger names match their ID cards. Students
                  and Seniors must present valid identification on board the
                  train.
                </p>
              </div>

              {passengerList.map((passenger, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6"
                >
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-lg">
                      Passenger {index + 1}
                    </h3>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-bold border border-slate-200">
                      {passenger.seatDisplay}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={passenger.fullName}
                        onChange={(e) =>
                          updatePassenger(index, "fullName", e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        ID Card / Passport
                      </label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={passenger.idCard}
                        onChange={(e) =>
                          updatePassenger(index, "idCard", e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-chuppaGreen text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Ticket Type *
                      </label>
                      <select
                        value={passenger.type}
                        onChange={(e) =>
                          updatePassenger(index, "type", e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-chuppaGreen text-sm bg-slate-50 font-medium"
                      >
                        <option value="adult">Adult (Standard Price)</option>
                        <option value="student">Student (50% Discount)</option>
                        <option value="child">
                          Child under 12 (50% Discount)
                        </option>
                        <option value="senior">
                          Senior 60+ (30% Discount)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                <h2 className="text-lg font-bold text-slate-800 mb-3">
                  Select Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["card", "paypal", "blik"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-xl border-2 font-bold uppercase tracking-wider text-sm transition-all ${paymentMethod === method ? "border-chuppaGreen bg-chuppaGreen/5 text-chuppaGreen" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                    >
                      {method === "card"
                        ? "Credit Card"
                        : method === "paypal"
                          ? "PayPal"
                          : "BLIK"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thay đổi handler và ràng buộc disabled an toàn tuyệt đối */}
              <Button
                fullWidth
                onClick={handleProceedToStep2}
                disabled={passengerList.some(
                  (p) => !p.fullName || p.fullName.trim() === "",
                )}
              >
                Proceed to Payment Details
              </Button>
            </div>
          )}

          {/* STEP 2: NHẬP THÔNG TIN THANH TOÁN */}
          {step === 2 && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <ShieldCheck
                  size={48}
                  className="mx-auto text-chuppaGreen mb-3"
                />
                <h1 className="text-2xl font-bold text-slate-800">
                  Secure Payment
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  256-bit SSL Encrypted — powered by Stripe
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-chuppaGreen outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={expiry}
                          onChange={handleExpiryChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-chuppaGreen outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength="3"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-chuppaGreen outline-none font-mono tracking-widest"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={cardName}
                        onChange={(e) =>
                          setCardName(e.target.value.toUpperCase())
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-chuppaGreen outline-none uppercase"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-8">
                    <div className="text-blue-800 font-black italic text-4xl mb-4">
                      Pay<span className="text-blue-400">Pal</span>
                    </div>
                    <p className="text-slate-500 mb-6">
                      You will be redirected to PayPal to complete your purchase
                      securely.
                    </p>
                  </div>
                )}

                {paymentMethod === "blik" && (
                  <div className="text-center py-8">
                    <div className="bg-black text-white inline-block px-4 py-1 rounded font-bold text-xl uppercase mb-6">
                      BLIK
                    </div>
                    <br />
                    <input
                      type="text"
                      placeholder="000 000"
                      maxLength="6"
                      className="w-48 text-center text-3xl tracking-widest py-3 border-b-2 border-slate-300 focus:border-chuppaGreen outline-none font-mono mb-4"
                    />
                    <p className="text-slate-500 text-sm">
                      Enter the 6-digit code from your banking app
                    </p>
                  </div>
                )}
              </div>

              <Button
                fullWidth
                onClick={() => setStep(3)}
                disabled={
                  paymentMethod === "card" &&
                  (cardNumber.length < 19 ||
                    expiry.length < 5 ||
                    cvv.length < 3)
                }
              >
                Confirm & Pay {finalPrice.toFixed(2)} PLN
              </Button>
            </div>
          )}

          {/* STEP 3: RE-AUTH */}
          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-4 duration-300 text-center max-w-sm mx-auto mt-10">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                {useOtp ? <Smartphone size={32} /> : <Lock size={32} />}
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Confirm your identity
              </h1>
              <p className="text-slate-500 text-sm mb-6">
                Before we charge {finalPrice.toFixed(2)} PLN, please verify it's
                you.
              </p>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 text-left">
                <p className="text-center font-medium text-slate-800 mb-6">
                  {email}
                </p>
                {!useOtp ? (
                  <>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Account Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-chuppaGreen outline-none mb-4"
                    />
                    <button
                      onClick={() => setUseOtp(true)}
                      className="text-sm text-chuppaGreen font-medium hover:underline w-full text-center"
                    >
                      Use SMS OTP instead
                    </button>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-bold text-slate-700 mb-1 text-center">
                      Enter 6-digit OTP
                    </label>
                    <div className="flex gap-2 justify-center mb-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength="1"
                          className="w-10 h-12 text-center text-xl font-bold border border-slate-300 rounded focus:border-chuppaGreen outline-none"
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setUseOtp(false)}
                      className="text-sm text-chuppaGreen font-medium hover:underline w-full text-center"
                    >
                      Use Password instead
                    </button>
                  </>
                )}
              </div>

              <Button
                fullWidth
                onClick={processPayment}
                disabled={!useOtp && authPassword.length < 1}
              >
                Verify & Pay
              </Button>
            </div>
          )}

          {/* STEP 4: PROCESSING */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
              <Loader2
                size={64}
                className="text-chuppaGreen animate-spin mb-6"
              />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Processing payment...
              </h2>
              <p className="text-slate-500">
                Please do not close this window or click back.
              </p>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <div className="animate-in zoom-in-95 duration-500 max-w-md mx-auto text-center mt-10">
              <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-black text-slate-800 mb-2">
                Payment Successful!
              </h1>
              <p className="text-slate-500 mb-8">
                Your journey is now officially booked.
              </p>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6 text-left">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 text-sm">Amount Paid</span>
                    <span className="font-black text-slate-800">
                      {finalPrice.toFixed(2)} PLN
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 text-sm">Booking Code</span>
                    <span className="font-bold text-chuppaGreen">
                      {finalBookingCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Date</span>
                    <span className="font-medium text-slate-800">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 text-center text-sm text-green-700 font-medium">
                  A receipt has been sent to {email}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-center gap-2">
                  <Star size={20} className="text-yellow-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Your current Chuppa Points balance:{" "}
                    <strong className="text-slate-900">
                      {userProfile?.loyaltyPoints || 0}
                    </strong>{" "}
                    pts
                  </span>
                </div>
              </div>
              <Link to="/account/tickets">
                <Button fullWidth>View My Tickets</Button>
              </Link>
            </div>
          )}

          {/* STEP 6: FAIL */}
          {step === 6 && (
            <div className="animate-in zoom-in-95 duration-500 max-w-md mx-auto text-center mt-10">
              <XCircle size={80} className="text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-black text-slate-800 mb-2">
                Payment Unsuccessful
              </h1>
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-left mb-8 mt-4">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{paymentError}</p>
              </div>
              <div className="space-y-3">
                <Button fullWidth onClick={() => setStep(2)}>
                  Try Again with Current Card
                </Button>
                <button
                  onClick={() => {
                    setCardNumber("");
                    setExpiry("");
                    setCvv("");
                    setStep(2);
                  }}
                  className="w-full py-3 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Use a Different Payment Method
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: BILLING SUMMARY CỐ ĐỊNH (CHỈ HIỆN Ở STEP 1 & 2) */}
        {step < 3 && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-800 text-lg mb-4 border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              <div className="mb-4">
                <p className="font-bold text-sm text-slate-800">
                  {schedule.fromStation} ➔ {schedule.toStation}
                </p>
                <p className="text-xs text-slate-500">
                  {schedule.travelDate} | {schedule.departureTime}
                </p>
              </div>

              {/* CHI TIẾT TỪNG GHẾ THEO LOẠI HÀNH KHÁCH */}
              <div className="space-y-2 mb-4 border-b border-slate-100 pb-4">
                {passengerList.map((p, idx) => {
                  let pPrice = basePricePerSeat;
                  if (p.type === "student" || p.type === "child") pPrice *= 0.5;
                  if (p.type === "senior") pPrice *= 0.7;

                  return (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        Seat {p.seatDisplay.split("-")[1]}{" "}
                        <span className="text-[10px] uppercase font-bold text-indigo-500 ml-1">
                          ({p.type})
                        </span>
                      </span>
                      <span className="font-medium text-slate-800">
                        {pPrice.toFixed(2)} PLN
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* VOUCHER INPUT THÔNG MINH */}
              <div className="mb-4 border-b border-slate-100 pb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Voucher Code
                </label>

                {hasDiscountedPassenger ? (
                  <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 font-medium flex gap-2 items-start border border-slate-100">
                    <Tag size={14} className="shrink-0 mt-0.5 text-slate-400" />
                    Cannot combine vouchers with Student, Child, or Senior
                    discounts.
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={voucherCode}
                        onChange={(e) =>
                          setVoucherCode(e.target.value.toUpperCase())
                        }
                        className="flex-1 p-2 border border-slate-300 rounded text-sm outline-none focus:border-chuppaGreen font-bold"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-3 rounded text-sm font-bold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-red-500 text-xs font-bold">
                        {voucherError}
                      </p>
                    )}
                    {appliedVoucher && (
                      <p className="text-green-600 text-xs font-bold">
                        Voucher applied: -{voucherDiscount.toFixed(2)} PLN
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* LOYALTY POINTS REDEMPTION THÔNG MINH */}
              {availablePoints > 0 && (
                <div className="mb-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" /> Chuppa
                        Points
                      </p>
                      <p className="text-xs text-slate-500">
                        You have {availablePoints} pts (≈{" "}
                        {(availablePoints / 10).toFixed(2)} PLN)
                      </p>
                    </div>

                    <button
                      onClick={() => setUsePoints(!usePoints)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${usePoints ? "bg-chuppaGreen" : "bg-slate-300"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${usePoints ? "left-7" : "left-1"}`}
                      ></div>
                    </button>
                  </div>

                  {usePoints && pointsDiscount > 0 && (
                    <div className="mt-3 text-xs font-bold text-chuppaGreen bg-green-50 p-2.5 rounded border border-green-100 flex justify-between items-center">
                      <span>Redeeming {Math.floor(pointsToUse)} pts</span>
                      <span className="text-sm">
                        - {pointsDiscount.toFixed(2)} PLN
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-end mb-6">
                <span className="text-sm font-bold text-slate-500 uppercase">
                  Total
                </span>
                <span className="text-3xl font-black text-chuppaGreen">
                  {finalPrice.toFixed(2)} PLN
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;

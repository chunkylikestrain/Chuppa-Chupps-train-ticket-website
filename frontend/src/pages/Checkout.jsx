import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hứng dữ liệu từ trang SeatSelection
  const bookingData = location.state || {};
  const train = bookingData.selectedTrain || {};

  // State cho Form thanh toán
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paypal"); // Mặc định chọn PayPal

  // Tự động điền thông tin nếu user đã đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPassengerName(user.fullName || "");
      setEmail(user.email || "");
    }

    // Nếu ai đó gõ thẳng link /checkout mà không có dữ liệu đặt vé, đẩy về trang chủ
    if (!bookingData.totalPrice) {
      navigate("/");
    }
  }, [bookingData, navigate]);

  // Hàm xử lý nút Thanh toán (Tạm thời chỉ hiển thị Alert)
  const handlePayment = (e) => {
    e.preventDefault();
    alert(
      `Mockup: Redirecting to ${paymentMethod.toUpperCase()} gateway to pay ${bookingData.totalPrice} PLN.\n(Backend PayPal integration coming soon!)`,
    );
  };

  // Tránh render lỗi nếu không có dữ liệu
  if (!bookingData.totalPrice) return null;

  return (
    <div className="min-h-screen bg-chuppaGray font-sans flex flex-col">
      {/* HEADER TÓM TẮT */}
      <header className="bg-chuppaGreen-dark text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/seat-selection"
            state={bookingData} // Truyền ngược data lại nếu họ muốn chọn lại ghế
            className="text-white hover:text-yellow-300 transition-colors font-medium flex items-center gap-2"
          >
            ← Back to seats
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wide">
              Secure Checkout
            </h1>
          </div>
          <div className="text-2xl font-black italic tracking-tighter">
            ChuppaChup{" "}
            <span className="text-yellow-400 font-sans not-italic text-lg ml-1">
              Train
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* NỬA TRÁI: Form nhập liệu & Chọn phương thức thanh toán */}
        <div className="flex-1 space-y-6">
          {/* SECTION 1: Passenger Details */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              1. Passenger Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Full Name (as on ID)"
                  placeholder="e.g. Jan Kowalski"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Email Address (for e-ticket)"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+48 123 456 789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </section>

          {/* SECTION 2: Payment Method */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Lựa chọn PayPal */}
              <label
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "paypal" ? "border-chuppaGreen bg-chuppaGreen/5 ring-1 ring-chuppaGreen" : "border-gray-200 hover:border-chuppaGreen-light"}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-chuppaGreen focus:ring-chuppaGreen accent-chuppaGreen"
                  />
                  <div>
                    <span className="block font-bold text-gray-800">
                      PayPal
                    </span>
                    <span className="block text-xs text-gray-500">
                      Fast and secure checkout
                    </span>
                  </div>
                </div>
                {/* Giả lập Logo PayPal bằng chữ */}
                <span className="text-blue-800 font-black italic text-xl tracking-tighter">
                  Pay<span className="text-blue-400">Pal</span>
                </span>
              </label>

              {/* Lựa chọn Credit Card */}
              <label
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "card" ? "border-chuppaGreen bg-chuppaGreen/5 ring-1 ring-chuppaGreen" : "border-gray-200 hover:border-chuppaGreen-light"}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-chuppaGreen focus:ring-chuppaGreen accent-chuppaGreen"
                  />
                  <div>
                    <span className="block font-bold text-gray-800">
                      Credit / Debit Card
                    </span>
                    <span className="block text-xs text-gray-500">
                      Visa, MasterCard, Maestro
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 text-xl">💳</div>
              </label>

              {/* Lựa chọn BLIK (Phổ biến ở Ba Lan) */}
              <label
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "blik" ? "border-chuppaGreen bg-chuppaGreen/5 ring-1 ring-chuppaGreen" : "border-gray-200 hover:border-chuppaGreen-light"}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="blik"
                    checked={paymentMethod === "blik"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-chuppaGreen focus:ring-chuppaGreen accent-chuppaGreen"
                  />
                  <div>
                    <span className="block font-bold text-gray-800">BLIK</span>
                    <span className="block text-xs text-gray-500">
                      Pay with BLIK code
                    </span>
                  </div>
                </div>
                <span className="bg-black text-white px-2 py-0.5 rounded font-bold text-xs uppercase">
                  blik
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* NỬA PHẢI: Tóm tắt đơn hàng (Order Summary) */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28 z-40">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🎫 Order Summary
            </h2>

            {/* Chi tiết chuyến đi */}
            <div className="bg-chuppaGray p-4 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">
                  {bookingData.displayFrom}
                </span>
                <span className="text-yellow-500">➔</span>
                <span className="font-bold text-gray-800">
                  {bookingData.displayTo}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {bookingData.displayDate}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {train.departureTime} - {train.arrivalTime} ({train.duration})
              </p>
              <div className="mt-3 inline-block bg-white px-2 py-1 rounded text-xs font-bold text-chuppaGreen border border-chuppaGreen/20">
                {train.type} {train.trainNumber}
              </div>
            </div>

            {/* Chi tiết ghế & tiền */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Seats ({bookingData.selectedSeats?.length || 0}):</span>
                <span className="font-bold text-gray-800">
                  {bookingData.selectedSeats?.join(", ") || "None"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ticket Price:</span>
                <span>{train.price} PLN</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold">Total to pay:</span>
                  <span className="text-3xl font-black text-chuppaGreen">
                    {bookingData.totalPrice} PLN
                  </span>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-8">
              <Button
                variant="primary"
                fullWidth
                onClick={handlePayment}
                // Khóa nút nếu chưa điền tên/email
                className={
                  !passengerName || !email
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                Pay {bookingData.totalPrice} PLN Now
              </Button>
              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                🔒 Secure, encrypted payment
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;

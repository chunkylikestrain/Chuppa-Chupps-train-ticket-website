import React from "react";
import Button from "./Button";

const TrainCard = ({ train, onChoose }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 hover:shadow-lg hover:border-chuppaGreen transition-all flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 group">
      {/* ... (Các phần hiển thị thời gian, mã tàu giữ nguyên) ... */}
      <div className="flex flex-1 items-center justify-between md:justify-start gap-4 md:gap-8 w-full">
        <div className="text-center md:text-left min-w-[100px]">
          <p className="text-2xl font-black text-gray-800">
            {train.departureTime}
          </p>
          <p className="text-sm font-medium text-gray-500">{train.from}</p>
        </div>
        <div className="flex flex-col items-center px-2 flex-1 max-w-[200px]">
          <span className="text-xs text-gray-400 font-medium mb-1">
            {train.duration}
          </span>
          <div className="w-full flex items-center">
            <div className="w-2 h-2 rounded-full border-2 border-chuppaGreen bg-white z-10"></div>
            <div className="h-[2px] bg-chuppaGreen-light flex-1 -mx-1 opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-chuppaGreen z-10"></div>
          </div>
          <span className="text-xs font-bold text-chuppaGreen mt-1 bg-chuppaGreen/10 px-2 py-0.5 rounded">
            {train.type} {train.trainNumber}
          </span>
        </div>
        <div className="text-center md:text-right min-w-[100px]">
          <p className="text-2xl font-black text-gray-800">
            {train.arrivalTime}
          </p>
          <p className="text-sm font-medium text-gray-500">{train.to}</p>
        </div>
      </div>

      {/* Cột 2: Giá tiền & Nút Đặt vé */}
      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 md:border-l md:border-gray-100 md:pl-8 pt-4 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
        <div className="text-left md:text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">From</p>
          <p className="text-2xl font-bold text-chuppaGreen">
            {train.price} <span className="text-lg">PLN</span>
          </p>
        </div>

        {/* 2. Gắn sự kiện onClick vào Button */}
        <Button variant="primary" onClick={onChoose}>
          Choose ticket
        </Button>
      </div>
    </div>
  );
};

export default TrainCard;

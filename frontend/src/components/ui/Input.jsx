import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label className="mb-1 text-sm font-medium text-white md:text-gray-700">
          {/* Mẹo nhỏ: Tôi đã đổi label thành text-white để nổi bật trên nền xanh */}
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          //  Thêm text-gray-900 vào đây
          className={`w-full py-2.5 border border-gray-300 rounded-lg outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-gray-900 font-medium ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

export default Input;

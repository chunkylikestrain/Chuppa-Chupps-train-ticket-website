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
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Nếu có icon (ví dụ icon định vị), sẽ hiển thị ở góc trái */}
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
          className={`w-full py-2.5 border border-gray-300 rounded-lg outline-none transition-all focus:border-chuppaGreen focus:ring-1 focus:ring-chuppaGreen ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

export default Input;

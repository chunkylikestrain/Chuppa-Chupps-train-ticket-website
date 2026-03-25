import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary", // Mặc định là nút xanh chính
  type = "button",
  fullWidth = false,
}) => {
  // Setup màu sắc dựa trên variant
  const baseStyle =
    "font-semibold rounded-lg transition-all duration-300 px-6 py-2.5 flex justify-center items-center";

  const variants = {
    primary: "bg-chuppaGreen hover:bg-chuppaGreen-dark text-white shadow-md",
    outline:
      "border-2 border-chuppaGreen text-chuppaGreen hover:bg-chuppaGreen hover:text-white",
    ghost: "text-gray-600 hover:bg-chuppaGray hover:text-chuppaGreen",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;

"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "default" | "icon" | "text";
  className?: string;
  style?: React.CSSProperties;
};

export default function Button({
  children,
  variant = "default",
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const variantClasses: Record<string, string> = {
    default: "bg-white border border-[#e9e9e7] text-[#37352f] px-3 py-2 rounded-md text-sm font-medium",
    icon: "bg-transparent border-none p-1.5 rounded",
    text: "bg-white border border-[#e9e9e7] text-[#37352f] px-3 py-1.5 rounded-md text-sm font-medium",
  };

  return (
    <button
      className={`cursor-pointer transition-all duration-150 ease-out ${variantClasses[variant]} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}


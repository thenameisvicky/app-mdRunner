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
  const baseStyles: React.CSSProperties = {
    cursor: "pointer",
    transition: "all 0.15s ease-out",
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: "#ffffff",
      border: "1px solid #e9e9e7",
      color: "#37352f",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
    },
    icon: {
      background: "transparent",
      border: "none",
      padding: "6px",
      borderRadius: "4px",
    },
    text: {
      background: "#ffffff",
      border: "1px solid #e9e9e7",
      color: "#37352f",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
    },
  };

  const combinedStyle = {
    ...variantStyles[variant],
    ...baseStyles,
  };

  return (
    <button
      className={className}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </button>
  );
}


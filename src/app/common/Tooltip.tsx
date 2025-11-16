"use client";

import React, { useState, ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  children: ReactNode;
  content: string;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export default function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
  className = "",
  style,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionStyles: Record<TooltipPosition, React.CSSProperties> = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: "8px",
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: "8px",
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: "8px",
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: "8px",
    },
  };

  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    ...positionStyles[position],
    background: "rgba(15, 15, 15, 0.9)",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: 1000,
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.2s ease-in-out",
  };

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    ...(style || {}),
  };

  return (
    <div
      className={className}
      style={wrapperStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {!disabled && (
        <div
          style={tooltipStyle}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {content}
        </div>
      )}
    </div>
  );
}


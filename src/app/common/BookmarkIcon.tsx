"use client";

import React from "react";

type BookmarkIconProps = {
  isBookmarked: boolean;
  size?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  "aria-label"?: string;
};

export default function BookmarkIcon({
  isBookmarked,
  size = 30,
  className = "",
  onClick,
  "aria-label": ariaLabel,
}: BookmarkIconProps) {
  const fillColor = isBookmarked ? "#FFD700" : "#ffffff";
  const strokeColor = isBookmarked ? "#c7aa05ff" : "#787774";

  const rectWidth = size * 0.5;
  const rectHeight = size * 0.8;
  const rectX = (size - rectWidth) / 2;
  const rectY = (size - rectHeight) / 2;
  const borderRadius = 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${
        onClick ? "cursor-pointer" : "cursor-default"
      } transition-all duration-500 ease-in-out`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        rx={borderRadius}
        ry={borderRadius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
}

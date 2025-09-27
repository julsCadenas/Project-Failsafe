// import React from "react";

interface BatmanLogoProps {
  className?: string;
  size?: number;
}

export function BatmanLogo({ className = "", size = 80 }: BatmanLogoProps) {
  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground"
      >
        <path
          d="M50 15 C35 15, 25 25, 25 35 C25 45, 30 50, 35 55 L40 60 C42 65, 45 70, 50 70 C55 70, 58 65, 60 60 L65 55 C70 50, 75 45, 75 35 C75 25, 65 15, 50 15 Z"
          fill="currentColor"
        />
        <path
          d="M35 55 C30 60, 25 65, 20 75 C18 80, 20 85, 25 85 C30 85, 35 80, 40 75 L50 70 L60 75 C65 80, 70 85, 75 85 C80 85, 82 80, 80 75 C75 65, 70 60, 65 55"
          fill="currentColor"
        />
        <path d="M25 35 C20 40, 15 50, 10 60 C8 65, 10 70, 15 68 C20 65, 25 55, 30 50" fill="currentColor" />
        <path d="M75 35 C80 40, 85 50, 90 60 C92 65, 90 70, 85 68 C80 65, 75 55, 70 50" fill="currentColor" />
      </svg>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface MacOSWindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

export default function MacOSWindowControls({
  onClose,
  onMinimize,
  onMaximize,
  className = "",
}: MacOSWindowControlsProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const buttons = [
    {
      id: "close",
      color: "bg-macos-red",
      hoverColor: "hover:bg-macos-red/80",
      icon: "×",
      onClick: onClose,
      tooltip: "Close",
    },
    {
      id: "minimize",
      color: "bg-macos-yellow",
      hoverColor: "hover:bg-macos-yellow/80",
      icon: "−",
      onClick: onMinimize,
      tooltip: "Minimize",
    },
    {
      id: "maximize",
      color: "bg-macos-green",
      hoverColor: "hover:bg-macos-green/80",
      icon: "⤢",
      onClick: onMaximize,
      tooltip: "Maximize",
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {buttons.map((button) => (
        <div key={button.id} className="relative group">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={button.onClick}
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
            className={`
              w-3 h-3 rounded-full ${button.color} ${button.hoverColor}
              transition-all duration-200
              flex items-center justify-center
              shadow-sm
              ${hoveredButton === button.id ? "shadow-lg" : ""}
            `}
            aria-label={button.tooltip}
          >
            {/* Show icon only on hover */}
            <span
              className={`
                text-[8px] font-bold text-black/60
                transition-opacity duration-200
                ${hoveredButton === button.id ? "opacity-100" : "opacity-0"}
              `}
            >
              {button.icon}
            </span>
          </motion.button>

          {/* Tooltip */}
          {hoveredButton === button.id && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
                         bg-black/80 text-white text-[10px] rounded whitespace-nowrap
                         pointer-events-none z-50"
            >
              {button.tooltip}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

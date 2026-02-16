"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

interface TerminalSectionProps {
  children?: React.ReactNode;
  command?: string;
  output?: string[];
  title?: string;
  className?: string;
}

export default function TerminalSection({
  children,
  command = "$ whoami",
  output = [],
  title = "Terminal",
  className = "",
}: TerminalSectionProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typing animation effect
  useEffect(() => {
    if (currentLine < output.length) {
      const line = output[currentLine];
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex <= line.length) {
          setDisplayedText(line.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setCurrentLine((prev) => prev + 1);
            setDisplayedText("");
          }, 500);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [currentLine, output]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass-card rounded-lg overflow-hidden ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-macos-red" />
            <div className="w-2.5 h-2.5 rounded-full bg-macos-yellow" />
            <div className="w-2.5 h-2.5 rounded-full bg-macos-green" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2">
            {title}
          </span>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          bash
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 font-mono text-sm bg-background/50">
        {/* Command Prompt */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-macos-green">➜</span>
          <span className="text-macos-yellow">~</span>
          <span className="text-foreground">{command}</span>
        </div>

        {/* Output Lines */}
        <div className="space-y-1">
          {output.slice(0, currentLine).map((line, index) => (
            <div key={index} className="text-muted-foreground">
              {line}
            </div>
          ))}
          
          {/* Current typing line */}
          {currentLine < output.length && (
            <div className="text-muted-foreground">
              {displayedText}
              <span
                className={`inline-block w-2 h-4 bg-macos-green ml-1 ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          )}
        </div>

        {/* Custom Content */}
        {children && (
          <div className="mt-4 text-foreground">
            {children}
          </div>
        )}

        {/* Blinking Cursor at end */}
        {currentLine >= output.length && !children && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-macos-green">➜</span>
            <span className="text-macos-yellow">~</span>
            <span
              className={`inline-block w-2 h-4 bg-macos-green ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

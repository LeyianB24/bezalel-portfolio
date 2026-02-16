"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

interface CodeSnippetProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeSnippet({
  code,
  language = "typescript",
  title = "code.ts",
  showLineNumbers = true,
  className = "",
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass-card rounded-lg overflow-hidden ${className}`}
    >
      {/* Code Header */}
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

        {/* Copy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono
                     text-muted-foreground hover:text-macos-green hover:bg-macos-green/10
                     transition-colors duration-200"
        >
          {copied ? (
            <>
              <FiCheck className="text-macos-green" />
              <span className="text-macos-green">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code Body */}
      <div className="overflow-x-auto">
        <div className="p-4 font-mono text-sm bg-background/50">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {/* Line Numbers */}
              {showLineNumbers && (
                <span className="select-none text-muted-foreground/50 mr-4 text-right w-8">
                  {index + 1}
                </span>
              )}
              
              {/* Code Line */}
              <pre className="flex-1">
                <code className="text-foreground">{line || " "}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

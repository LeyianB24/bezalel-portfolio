"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { FiPlay, FiRefreshCw, FiCode } from "react-icons/fi";
import { jellyPresets } from "@/lib/jelly-springs";

const INITIAL_CODE = `// Bezalel Portfolio Engine v2.0
// Welcome to the live environment.

const stack = {
  frontend: ["Next.js", "React", "Tailwind"],
  animations: ["Framer Motion", "Three.js"],
  physics: "Jelly Physics Engine"
};

function initPortfolio() {
  console.log("Initializing premium experience...");
  return \`Bezalel Portfolio: \${stack.physics} enabled.\`;
}

console.log(initPortfolio());
`;

export default function LiveCodeEditor() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [isMounted, setIsMounted] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 1500);
  };

  const handleReset = () => {
    setCode(INITIAL_CODE);
  };

  if (!isMounted) return <div className="h-[400px] w-full bg-black/20 animate-pulse rounded-xl" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full flex flex-col rounded-xl overflow-hidden glass-ultra border border-white/10 shadow-2xl group"
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[0_0_8px_rgba(255,95,87,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-[0_0_8px_rgba(40,200,64,0.4)]" />
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/60 tracking-wider">
            <FiCode className="w-3.5 h-3.5" />
            <span>engine.ts</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="p-2 mr-1 rounded-md hover:bg-white/5 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            transition={jellyPresets.snap}
            onClick={handleRun}
            disabled={isExecuting}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all
              ${isExecuting 
                ? "bg-macos-green/20 text-macos-green cursor-wait" 
                : "bg-macos-green text-white hover:shadow-[0_0_15px_rgba(40,200,64,0.4)]"}`}
          >
            {isExecuting ? <FiRefreshCw className="animate-spin w-3.5 h-3.5" /> : <FiPlay className="w-3.5 h-3.5 fill-current" />}
            {isExecuting ? "Executing..." : "Run Engine"}
          </motion.button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="relative h-[450px] w-full bg-[#1e1e1e]/80">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-geist-mono)",
            padding: { top: 20 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "all",
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden"
            }
          }}
        />
        
        {/* Execution Pulse Overlay */}
        {isExecuting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-accent/5 pointer-events-none border-2 border-accent/20"
          />
        )}
      </div>

      {/* Editor Footer Status */}
      <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Main Process: RUNNING</span>
          <span>FPS: 120</span>
        </div>
        <div>UTF-8</div>
      </div>
    </motion.div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// components/pages/MobileServicesPage.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useTransform, 
  useSpring, 
  useMotionValue, 
} from "framer-motion";
import { 
  Smartphone, WifiOff, Zap, Cpu, 
  Code2, Battery, Globe2, Fingerprint, 
  Activity, Settings, Share2, ShieldCheck, Terminal, Database, 
  Lock
} from "lucide-react";
import PageLayout from "@/components/PageLayout";

type Platform = 'ios' | 'android';

interface Theme {
  name: string;
  primary: string;
  accent: string;
  bg: string;
  border: string;
  glow: string;
  gradient: string;
  gradientBg: string;
  code: string;
  platform: string;
}

export default function MobileServicesPage() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line
  useEffect(() => setMounted(true), []);

  // --- THEME ENGINE ---
  const theme: Theme = {
    ios: {
      name: "iOS 17",
      primary: "text-blue-500",
      accent: "text-cyan-400",
      bg: "bg-blue-600",
      border: "border-blue-500/30",
      glow: "shadow-blue-500/20",
      gradient: "from-blue-600 via-indigo-500 to-cyan-400",
      gradientBg: "bg-gradient-to-r from-blue-900/40 to-slate-900/40",
      code: "swift",
      platform: "ios"
    },
    android: {
      name: "Android 14",
      primary: "text-emerald-500",
      accent: "text-lime-400",
      bg: "bg-emerald-600",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/20",
      gradient: "from-emerald-600 via-teal-500 to-lime-400",
      gradientBg: "bg-gradient-to-r from-emerald-900/40 to-slate-900/40",
      code: "kotlin",
      platform: "android"
    }
  }[platform];

  if (!mounted) return null;

  return (
    <PageLayout variant="subtle" showScrollProgress={false}>
      <div className="pt-24 pb-20 overflow-x-hidden selection:bg-white/20 font-sans perspective-[2000px]">
        
        {/* --- 3D MOVING GRID BACKGROUND --- */}
        <BackgroundGrid theme={theme} />

        {/* --- FLOATING OS SWITCHER --- */}
        <div className="fixed top-28 right-8 z-50">
           <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex relative shadow-2xl">
              <motion.div 
                 layoutId="active-pill"
                 className={`absolute inset-1.5 w-[calc(50%-6px)] rounded-full ${theme.bg} opacity-20`}
                 style={{ left: platform === 'ios' ? '6px' : 'calc(50% + 3px)' }}
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button 
                onClick={() => setPlatform('ios')}
                className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all relative z-10 tracking-widest ${platform === 'ios' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                 iOS
              </button>
              <button 
                onClick={() => setPlatform('android')}
                className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all relative z-10 tracking-widest ${platform === 'android' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                 ANDROID
              </button>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* --- HERO SECTION --- */}
          <div className="grid lg:grid-cols-2 gap-20 items-center min-h-[80vh] mb-32">
            
            {/* Left: Text Content */}
            <div className="relative z-20">
              <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border ${theme.border} ${theme.primary} text-xs font-mono mb-8 backdrop-blur-md`}
              >
                <Settings className="w-3.5 h-3.5 animate-[spin_4s_linear_infinite]" />
                <span className="tracking-widest font-bold">SYSTEM: {theme.name}</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                NATIVE <br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient} animate-gradient-x`}>
                  VELOCITY.
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed mb-12 border-l-2 border-slate-800 pl-6">
                We compile high-performance code into <strong>ARM64 binaries</strong>. Using the <span className="text-white font-medium">Hermes Engine</span>, we achieve sub-16ms frame times.
              </p>

              {/* Metrics Dashboard */}
              <div className="grid grid-cols-3 gap-4">
                 <MetricCard 
                   icon={<Activity />} 
                   label="Frame Time" 
                   value="16ms" 
                   theme={theme} 
                   delay={0.1}
                 />
                 <MetricCard 
                   icon={<Database />} 
                   label="Bundle Size" 
                   value="4.2MB" 
                   theme={theme} 
                   delay={0.2}
                 />
                 <MetricCard 
                   icon={<Zap />} 
                   label="TTI" 
                   value="0.4s" 
                   theme={theme} 
                   delay={0.3}
                 />
              </div>
            </div>

            {/* Right: 3D Interactive Phone */}
            <div className="h-[800px] w-full flex items-center justify-center relative">
                {/* Radial Glow behind phone */}
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-20 blur-[120px] rounded-full mix-blend-screen pointer-events-none`} />
                <InteractivePhone theme={theme} platform={platform} />
            </div>
          </div>

          {/* --- ARCHITECTURE DIAGRAM SECTION --- */}
          <div className="mb-48 relative">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent -z-10" />
             
             <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The JSI Architecture</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                   Traditional bridges serialize data over a JSON bus. We use the <strong>JavaScript Interface (JSI)</strong> to allow JS to hold direct references to C++ Host Objects.
                </p>
             </div>

             

             <div className="bg-[#050505] border border-slate-800/60 rounded-3xl p-1 md:p-2 shadow-2xl overflow-hidden ring-1 ring-white/5">
                <div className="bg-[url('/grid-pattern.svg')] opacity-[0.03] absolute inset-0" />
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:divide-x divide-slate-800/50 relative z-10">
                   
                   {/* JS THREAD */}
                   <div className="md:col-span-5 p-8 md:p-12 font-mono text-sm relative group">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Code2 size={20} /></div>
                          <span className="font-bold text-slate-300">JS Thread</span>
                      </div>
                      
                      <div className="space-y-2 text-slate-500 text-xs md:text-sm">
                          <div className="flex gap-4">
                              <span className="text-slate-700">01</span>
                              <span><span className="text-purple-400">const</span> <span className="text-blue-400">result</span> = <span className="text-purple-400">await</span></span>
                          </div>
                          <div className="flex gap-4">
                              <span className="text-slate-700">02</span>
                              <span className="pl-4">NativeModules.</span>
                          </div>
                          <div className="flex gap-4 bg-yellow-500/5 -mx-4 px-4 py-1 border-l-2 border-yellow-500/50">
                              <span className="text-slate-700">03</span>
                              <span className="pl-4 text-yellow-100">Biometrics.authenticate();</span>
                          </div>
                      </div>
                   </div>

                   {/* THE BRIDGE VISUALIZER */}
                   <div className="md:col-span-2 flex flex-col items-center justify-center py-12 relative overflow-hidden bg-slate-900/20">
                      <div className="absolute inset-0 bg-slate-950/50" />
                      
                      {/* Animated Connection Lines */}
                      <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent top-1/2" />
                      
                      {/* Data Particle */}
                      <motion.div 
                        animate={{ 
                           x: [-40, 40, -40],
                           scale: [1, 1.5, 1],
                           filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className={`relative z-10 w-12 h-12 rounded-xl ${theme.bg} flex items-center justify-center shadow-[0_0_30px_currentColor]`}
                      >
                         <Share2 className="text-white w-5 h-5" />
                      </motion.div>
                      
                      <div className="mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center px-4">
                          Synchronous<br/>Binding
                      </div>
                   </div>

                   {/* NATIVE THREAD */}
                   <div className="md:col-span-5 p-8 md:p-12 font-mono text-sm relative">
                      <div className="flex items-center gap-3 mb-6">
                          <div className={`p-2 rounded-lg ${theme.bg} bg-opacity-10 ${theme.primary}`}><Smartphone size={20} /></div>
                          <span className="font-bold text-slate-300">UI Thread (Main)</span>
                      </div>

                      <div className="space-y-2 text-slate-500 text-xs md:text-sm">
                          <div className="flex gap-4">
                               <span className="text-slate-700">01</span>
                               <span className="text-slate-500">{'// '}{platform === 'ios' ? 'Swift / Obj-C' : 'Kotlin / Java'}</span>
                          </div>
                          <div className="flex gap-4 bg-blue-500/5 -mx-4 px-4 py-1 border-l-2 border-blue-500/50">
                               <span className="text-slate-700">02</span>
                               <span className={theme.primary}>
                                   {platform === 'ios' ? 'FaceIDContext.evaluate()' : 'BiometricPrompt.auth()'}
                               </span>
                          </div>
                          <div className="flex gap-4">
                               <span className="text-slate-700">03</span>
                               <span><span className="text-purple-400">return</span> <span className="text-green-400">true</span>;</span>
                          </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* --- TILT CARDS GRID --- */}
          <div className="mb-20">
             <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Terminal className="text-slate-500" />
                <span>Core Capabilities</span>
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TiltCard 
                  icon={<WifiOff />} 
                  title="Local First Database" 
                  subtitle="SQLite + WatermelonDB"
                  desc="We treat 'offline' as a primary state, not an error. Data is persisted locally and synced via CRDTs."
                  theme={theme}
                />
                <TiltCard 
                  icon={<ShieldCheck />} 
                  title="Hardware Security" 
                  subtitle="Secure Enclave Access"
                  desc="Store sensitive tokens directly in the device's hardware-backed keystore, inaccessible to the JS layer."
                  theme={theme}
                />
                <TiltCard 
                  icon={<Zap />} 
                  title="Instant Updates" 
                  subtitle="Code Push Integration"
                  desc="Deploy JS bundle updates instantly to users without waiting for App Store review cycles."
                  theme={theme}
                />
             </div>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}

// ------------------------------------------------------------------
// --- SUB COMPONENTS ---
// ------------------------------------------------------------------

function BackgroundGrid({ theme }: { theme: any }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
       {/* Deep Space Background */}
       <div className="absolute inset-0 bg-[#020617]" />
       
       {/* Moving Perspective Grid */}
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 0.4 }}
         transition={{ duration: 2 }}
         className="absolute inset-[-100%] w-[300%] h-[300%] opacity-20"
         style={{
            backgroundSize: "100px 100px",
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            transform: "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
            transformOrigin: "center top"
         }}
       >
          <motion.div 
            animate={{ y: [0, 100] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="w-full h-full"
            style={{
               background: `radial-gradient(circle at center, ${theme.platform === 'ios' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'}, transparent 70%)`
            }}
          />
       </motion.div>
    </div>
  )
}

function MetricCard({ icon, label, value, theme, delay }: any) {
   return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay, duration: 0.5 }}
        className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm flex flex-col gap-3 group hover:bg-slate-900/60 transition-colors"
      >
         <div className={`p-2 w-fit rounded-lg bg-slate-800 text-slate-400 group-hover:text-white group-hover:${theme.bg} transition-all`}>
            {React.cloneElement(icon, { size: 18 })}
         </div>
         <div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</div>
         </div>
      </motion.div>
   )
}

function TiltCard({ icon, title, subtitle, desc, theme }: any) {
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(event.clientX - centerX);
      y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
      x.set(0);
      y.set(0);
  }

  return (
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md group hover:border-slate-600 transition-colors duration-500"
      >
         <div className="[transform:translateZ(30px)]">
            <div className={`w-14 h-14 rounded-2xl ${theme.gradientBg} flex items-center justify-center mb-6 border border-white/5`}>
               <div className={theme.primary}>{React.cloneElement(icon, { size: 28 })}</div>
            </div>
            
            <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
            <div className={`text-xs font-mono mb-4 ${theme.primary}`}>{subtitle}</div>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
         </div>

         {/* Shine Effect */}
         <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>
  )
}

// ------------------------------------------------------------------
// --- INTERACTIVE 3D PHONE ---
// ------------------------------------------------------------------

function InteractivePhone({ theme, platform }: { theme: Theme; platform: Platform }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse Tracking for Rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-400, 400], [15, -15]);
  const rotateY = useTransform(mouseX, [-400, 400], [-15, 15]);

  // Smooth Spring Physics
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    // This effect is intentionally empty or for side effects not directly tied to state/props
    // The rotation logic is handled by useMotionValue and useTransform
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
     if (!containerRef.current) return;
     const rect = containerRef.current.getBoundingClientRect();
     const centerX = rect.left + rect.width / 2;
     const centerY = rect.top + rect.height / 2;
     mouseX.set(e.clientX - centerX);
     mouseY.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
     mouseX.set(0);
     mouseY.set(0);
  }

  return (
     <div 
       ref={containerRef}
       className="w-full h-full flex items-center justify-center perspective-[1200px]" 
       onMouseMove={handleMouseMove}
       onMouseLeave={handleMouseLeave}
     >
        <motion.div
           style={{ 
              rotateX: smoothRotateX, 
              rotateY: smoothRotateY,
              transformStyle: "preserve-3d" 
           }}
           className="relative w-[300px] h-[600px] transition-transform duration-200 ease-out"
        >  
           {/* SCAN LINE ANIMATION */}
           <motion.div 
             animate={{ top: ['0%', '120%', '0%'] }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className={`absolute left-[-50px] right-[-50px] h-[2px] ${theme.bg} z-50 blur-[2px] shadow-[0_0_20px_2px_currentColor] opacity-50 pointer-events-none [transform:translateZ(200px)]`}
           />

           {/* --- LAYER 1: BACK PLATE --- */}
           <PhoneLayer z={0} className="bg-[#0b0c10] border-slate-800">
               <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
               <div className="flex flex-col items-center justify-center h-full opacity-30">
                  <div className="w-24 h-24 rounded-full border border-slate-700 flex items-center justify-center">
                     <Zap size={32} />
                  </div>
                  <div className="mt-4 font-mono text-[10px] tracking-widest">WIRELESS_COIL</div>
               </div>
           </PhoneLayer>

           {/* --- LAYER 2: LOGIC BOARD --- */}
           <PhoneLayer z={50} className="bg-slate-900/90 backdrop-blur-sm border-slate-700">
               <div className="w-full h-full relative p-4">
                  {/* CPU Unit */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-950 border border-slate-600 rounded-xl flex flex-col items-center justify-center shadow-xl">
                      <Cpu className={`w-12 h-12 ${theme.primary} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] animate-pulse`} />
                      <div className="mt-2 text-[8px] text-white font-mono">ARM64 ARCH</div>
                  </div>
                  {/* Circuit Traces */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                      <path d="M50 50 H 250 V 200" stroke="white" strokeWidth="1" fill="none" />
                      <path d="M150 300 V 500" stroke="white" strokeWidth="1" fill="none" />
                      <circle cx="150" cy="300" r="4" fill="white" />
                  </svg>
               </div>
           </PhoneLayer>

           {/* --- LAYER 3: BATTERY & HAPTICS --- */}
           <PhoneLayer z={100} className="bg-transparent border-none shadow-none">
               <div className="w-full h-full relative">
                   <div className="absolute bottom-12 left-4 right-4 h-32 bg-slate-800/90 rounded-xl border border-slate-600 flex items-center justify-center gap-4">
                       <Battery className="text-slate-400" />
                       <span className="text-xs font-mono text-slate-400">4323 mAh</span>
                   </div>
               </div>
           </PhoneLayer>

           {/* --- LAYER 4: GLASS UI --- */}
           <PhoneLayer z={160} className="bg-black border-slate-700 overflow-hidden ring-4 ring-black">
               <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black relative">
                  
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 pt-6 pb-2">
                     <span className="text-[10px] font-bold text-white">5G+</span>
                     <div className="flex gap-1.5">
                        <div className="w-4 h-1.5 bg-white rounded-full" />
                        <div className="w-2 h-1.5 bg-white/50 rounded-full" />
                     </div>
                  </div>

                  {/* App Interface */}
                  <div className="p-5 space-y-4">
                     {/* Dynamic Header */}
                     <motion.div 
                        layoutId="header"
                        className={`h-48 rounded-2xl bg-gradient-to-br ${theme.gradient} relative overflow-hidden flex flex-col justify-end p-5 shadow-lg`}
                     >
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                            <Globe2 size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-white/80 text-xs font-mono mb-1">CURRENT SESSION</div>
                            <div className="text-2xl font-bold text-white">Connected</div>
                        </div>
                     </motion.div>

                     {/* Stats Row */}
                     <div className="flex gap-3">
                        <div className="flex-1 h-20 bg-slate-800/50 rounded-xl border border-white/5 p-3">
                           <Lock className="w-4 h-4 text-slate-400 mb-2" />
                           <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                        </div>
                        <div className="flex-1 h-20 bg-slate-800/50 rounded-xl border border-white/5 p-3">
                           <Activity className="w-4 h-4 text-slate-400 mb-2" />
                           <div className="h-1.5 w-8 bg-blue-500 rounded-full" />
                        </div>
                     </div>

                     {/* Notification Toast */}
                     <motion.div
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 1 }}
                       className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex gap-3 items-center"
                     >
                        <div className={`p-1.5 rounded-lg ${theme.bg} shadow-lg`}>
                           <ShieldCheck size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                           <div className="text-[10px] font-bold text-white">Biometric Verified</div>
                           <div className="text-[9px] text-slate-400 font-mono">Secure Enclave :: Access Granted</div>
                        </div>
                     </motion.div>
                  </div>
               </div>
           </PhoneLayer>
        </motion.div>
     </div>
  )
}

function PhoneLayer({ z, className, children }: { z: number; className?: string; children: React.ReactNode }) {
   return (
      <div 
        className={`absolute inset-0 rounded-[3rem] border shadow-2xl ${className}`}
        style={{ transform: `translateZ(${z}px)` }}
      >
         {children}
      </div>
   )
}

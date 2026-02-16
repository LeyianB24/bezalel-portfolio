/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 
import { FiArrowUpRight, FiCommand, FiCpu, FiGlobe, FiTerminal, FiArrowUp } from "react-icons/fi";

export default function Footer() {
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Real-time Nairobi Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        timeZone: 'Africa/Nairobi', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }));
    };
    updateTime(); 
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
        setEmail("");
        setSubscribed(false);
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { 
      title: "Directory: /Studio", 
      links: [
        { name: "The Logic", href: "/studio/logic" },
        { name: "Process", href: "/studio/process" },
        { name: "Careers", href: "/studio/careers" }
      ] 
    },
    { 
      title: "Directory: /Services", 
      links: [
        { name: "Web Systems", href: "/services/web-systems" },
        { name: "Mobile Arch", href: "/services/mobile" },
        { name: "API Infra", href: "/services/api" }
      ] 
    },
    { 
      title: "Directory: /Legal", 
      links: [
        { name: "Privacy.md", href: "/legal/privacy" },
        { name: "Terms.md", href: "/legal/terms" }
      ] 
    },
  ];

  return (
    <footer className="relative bg-background pt-32 overflow-hidden border-t border-slate-200 dark:border-white/10">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* --- GIANT GHOST TYPOGRAPHY --- */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full select-none pointer-events-none overflow-hidden">
        <h1 className="text-[15vw] font-black text-foreground opacity-[0.03] leading-none text-center tracking-tighter whitespace-nowrap">
          SYSTEM ROOT
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- TOP: CALL TO ACTION --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24 border-b border-slate-200 dark:border-white/10 pb-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
               <span className="px-3 py-1 rounded bg-macos-green/10 text-macos-green border border-macos-green/20 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-macos-green opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-macos-green"></span>
                 </span>
                 System Online
               </span>
               <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                 <FiCpu /> Kernel v2.4.0
               </span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
              READY TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-macos-green to-macos-yellow">
                DEPLOY?
              </span>
            </h2>
          </div>

          <motion.a 
            href="https://wa.me/254796157265" 
            target="_blank"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-6 bg-foreground text-background rounded-lg font-bold text-xl overflow-hidden shadow-2xl shadow-cyan-500/10 w-full md:w-auto text-center"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"></div>
            <span className="relative flex items-center justify-center gap-3">
              Start Project <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </motion.a>
        </div>

        {/* --- MIDDLE: GRID SYSTEM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Column 1: Brand & Terminal */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-2 mb-4">
                <FiCommand className="text-macos-green" /> BEZALEL
              </h3>
              <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
                Architecting high-performance digital infrastructure. We treat code as a raw material for building assets.
              </p>
            </div>

            {/* Terminal Newsletter Input */}
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm border border-slate-800 shadow-xl max-w-sm">
                <div className="flex gap-1.5 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="text-slate-400 text-xs mb-2"># Stay updated on system patches</div>
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                    <span className="text-macos-green">➜</span>
                    <span className="text-purple-400">~</span>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={subscribed ? "Subscription initialized..." : "enter_email.exe"}
                        disabled={subscribed}
                        className="bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600 w-full px-0 py-0"
                    />
                </form>
            </div>
          </div>

          {/* Column 2: Directory Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {footerLinks.map((column, idx) => (
              <div key={idx}>
                <h4 className="font-mono font-bold text-foreground mb-6 text-[10px] uppercase tracking-widest opacity-60">
                    {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link 
                        href={link.href} 
                        className="text-muted-foreground hover:text-macos-green transition-colors flex items-center gap-2 group w-fit text-sm"
                      >
                        <span className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-macos-green">/</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Column 3: Live Telemetry */}
          <div className="lg:col-span-3 space-y-4">
             <h4 className="font-mono font-bold text-foreground mb-6 text-[10px] uppercase tracking-widest opacity-60">
                System Telemetry
            </h4>
            
            {/* Clock Widget */}
            <div className="p-4 rounded border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 backdrop-blur-sm">
               <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                 <span>HQ Time (NBO)</span>
                 <FiGlobe className="text-macos-green" />
               </div>
               <div className="text-2xl font-mono font-bold text-foreground tabular-nums tracking-tight">
                 {time}
               </div>
            </div>

             {/* Server Status Widget */}
            <div className="p-4 rounded border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 backdrop-blur-sm">
               <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                 <span>Server Load</span>
                 <div className="flex gap-0.5">
                    <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse delay-100" />
                 </div>
               </div>
               <div className="w-full bg-stone-200 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                   <div className="bg-macos-green h-full w-[42%] animate-pulse" />
               </div>
               <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500">
                   <span>CPU: 42%</span>
                   <span>RAM: 12GB</span>
               </div>
            </div>

          </div>
        </div>

        {/* --- BOTTOM: UTILITY BAR --- */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-20 pb-10">
          
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            © {currentYear} Bezalel Technologies. // All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
             {/* Social Array */}
            {[
                { icon: <FaInstagram />, href: "https://instagram.com/leyian_.b" },
                { icon: <FaXTwitter />, href: "https://twitter.com/LeyianB" },
                { icon: <FaTiktok />, href: "https://www.tiktok.com/@leyian_.b" },
                { icon: <FaGithub />, href: "https://github.com/LeyianB24" },
                { icon: <FaWhatsapp />, href: "https://wa.me/254796157265" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-macos-green hover:scale-110 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <button 
            onClick={scrollToTop} 
            className="group flex items-center gap-2 text-[10px] font-mono font-bold text-foreground uppercase tracking-widest hover:text-macos-green transition-colors"
          >
            Return to Top 
            <span className="p-1 bg-stone-100 dark:bg-white/10 rounded group-hover:bg-macos-green group-hover:text-white transition-colors">
                <FiArrowUp />
            </span>
          </button>
        </div>
      </div>

      {/* --- INFINITE TICKER --- */}
      <div className="border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] py-2 overflow-hidden">
         <motion.div 
            className="flex whitespace-nowrap gap-8 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
         >
            {/* Repeated text for marquee effect */}
            {Array(10).fill(" // Architecting the Future // Logic First // Scale Infinite").map((item, i) => (
                <span key={i}>{item}</span>
            ))}
         </motion.div>
      </div>
    </footer>
  );
}
"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechArsenal from "@/components/TechArsenal";
import Footer from "@/components/Footer";

export default function Home() {
  // 1. Setup Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="min-h-screen bg-[#02040a] text-white selection:bg-purple-500/30 selection:text-purple-200 relative">
      
      {/* --- 1. GLOBAL SCROLL PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* --- 2. FIXED AMBIENT BACKGROUND --- */}
      {/* This layer stays fixed while content scrolls over it */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Top Glow (Spotlight effect) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
        
        {/* Bottom/Footer Glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      {/* --- 3. PAGE CONTENT --- */}
      {/* Relative + z-10 ensures content sits ABOVE the fixed background */}
      <div className="relative z-10 flex flex-col">
        <Header />
        
        <Hero />
        
        {/* Add an ID here if you want the #services link to go somewhere, 
            or rename TechArsenal to act as Services */}
        <div id="services"></div> 
        
        <About />
        
        <div id="arsenal">
          <TechArsenal />
        </div>
        
        <Footer />
      </div>

    </main>
  );
}
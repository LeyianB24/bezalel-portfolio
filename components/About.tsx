"use client";
import { motion, Variants } from "framer-motion";
import { 
  TbMicroscope,     // Discovery
  TbSchema,         // REPLACED: "Blueprint" -> "Schema" (Architecture)
  TbRocket,         // Execution
  TbCpu,            // Methodology
  TbActivity,       // Uptime
  TbShieldLock      // Security
} from "react-icons/tb";

export default function About() {
  
  // --- DATA: ENGINEERING PROTOCOLS ---
  const steps = [
    { 
      num: "01", 
      icon: <TbMicroscope />, 
      title: "Diagnostic Audit", 
      desc: "We dissect your existing infrastructure. No guesswork. We analyze business logic, bottlenecks, and security flaws to define the optimal engineering path." 
    },
    { 
      num: "02", 
      icon: <TbSchema />, // <--- Updated Icon
      title: "System Architecture", 
      desc: "Blueprinting scalable, fault-tolerant systems. We define database schemas, API contracts, and microservice boundaries before writing a single line of code." 
    },
    { 
      num: "03", 
      icon: <TbRocket />, 
      title: "Velocity Execution", 
      desc: "High-frequency sprints delivering production-ready artifacts. Continuous integration, automated testing pipelines, and zero-downtime deployment strategies." 
    },
  ];

  const stats = [
    { value: "99.99%", label: "Uptime Guarantee", icon: <TbActivity /> },
    { value: "ISO", label: "Security Compliance", icon: <TbShieldLock /> },
  ];

  // Animation variants
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="about" className="py-24 lg:py-32 px-6 bg-background relative overflow-hidden">
      
      {/* --- LAYER 1: ENGINEERING GRID --- */}
      <div className="absolute inset-0 z-0 bg-grid-pattern bg-grid-md mask-radial-faded opacity-[0.05] pointer-events-none"></div>
      
      {/* --- LAYER 2: AMBIENT FUSION GLOW --- */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-0 lg:-right-20 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative z-10">
        
        {/* --- LEFT COLUMN: MISSION BRIEF --- */}
        <div className="lg:sticky lg:top-32 self-start">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {/* Tag: Methodology */}
            <motion.div variants={textVariants} className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-sm bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-mono text-xs tracking-widest uppercase">
              <TbCpu className="text-sm" />
              <span>Operational Protocol</span>
            </motion.div>

            {/* Headline */}
            <motion.h2 variants={textVariants} className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 tracking-tight leading-[1.05]">
              Not an Agency.<br />
              A <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500 animate-shimmer bg-[length:200%_100%]">Technical Partner.</span>
            </motion.h2>
            
            {/* Copy */}
            <motion.p variants={textVariants} className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl font-light">
              Generic agencies ship code and disappear. <strong className="text-foreground font-semibold">Bezalel</strong> operates as a specialized engineering task force. We integrate with your team to build systems that handle real-world scale, financial precision, and high-volume data.
            </motion.p>

            {/* Metrics HUD */}
            <motion.div variants={textVariants} className="flex gap-12 border-t border-dashed border-border pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="flex items-center gap-2 text-3xl font-black text-foreground tabular-nums tracking-tighter">
                    {stat.value}
                    <span className="text-emerald-500 text-xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      {stat.icon}
                    </span>
                  </h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-mono">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: EXECUTION PIPELINE --- */}
        <div className="relative flex flex-col gap-6">
          
          {/* Connector Circuit (Desktop) */}
          <div className="absolute left-[35px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent hidden lg:block"></div>

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="group relative z-10 flex flex-col md:flex-row items-start gap-6 p-6 md:p-8 
                         rounded-xl border border-border bg-card/40 backdrop-blur-md 
                         hover:bg-card/60 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]
                         transition-all duration-300"
            >
              
              {/* STENCILED NUMBER (Top Right) */}
              <span className="absolute top-4 right-6 text-6xl font-black text-foreground opacity-[0.02] group-hover:opacity-[0.06] group-hover:text-emerald-600 transition-all pointer-events-none font-mono tracking-tighter">
                {step.num}
              </span>

              {/* ICON CONTAINER */}
              <div className="relative shrink-0 w-14 h-14 rounded-lg bg-background flex items-center justify-center 
                              border border-border group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(5,150,105,0.2)] 
                              transition-all duration-300 z-10">
                <div className="text-2xl text-muted-foreground group-hover:text-emerald-500 transition-colors duration-300">
                  {step.icon}
                </div>
                
                {/* Circuit Node (Desktop) */}
                <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-emerald-500/20 group-hover:border-emerald-500 group-hover:scale-125 transition-all hidden lg:block">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="pt-1">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-600 transition-colors font-sans">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
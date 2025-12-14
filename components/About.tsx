"use client";
import { motion } from "framer-motion";
import { TbSearch, TbSchema, TbRocket, TbCpu } from "react-icons/tb";

export default function About() {
  const steps = [
    { 
      num: "01", 
      icon: <TbSearch />, 
      title: "Discovery & Audit", 
      desc: "We don't guess. We dissect your business logic and existing infrastructure to find the optimal engineering path." 
    },
    { 
      num: "02", 
      icon: <TbSchema />, 
      title: "System Architecture", 
      desc: "Blueprinting scalable, fault-tolerant systems. We define the database schema and API contracts before writing code." 
    },
    { 
      num: "03", 
      icon: <TbRocket />, 
      title: "Agile Execution", 
      desc: "High-velocity sprints delivering production-ready code. Continuous integration, automated testing, and zero-downtime deployment." 
    },
  ];

  return (
    <section id="about" className="py-32 px-6 bg-[#02040a] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* --- LEFT: MANIFESTO --- */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 mb-6 text-purple-400 font-mono text-xs tracking-widest uppercase">
            <TbCpu className="text-lg" />
            <span>Our Methodology</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Not an Agency.<br />
            A <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Technical Partner.</span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
            Most shops churn out generic templates. <strong className="text-white">Bezalel</strong> operates like a specialized task force. We dive deep into fintech, logistics, and data systems to build software that actually handles load.
          </p>

          {/* Quick Stats/Metrics */}
          <div className="flex gap-8 border-t border-white/10 pt-8">
            <div>
              <h4 className="text-3xl font-black text-white">99.9%</h4>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Uptime Targeted</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white">2x</h4>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Faster Deployment</p>
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT: PROCESS CARDS --- */}
        <div className="grid gap-6">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.02, translateX: 10 }}
              className="group relative flex items-start gap-6 p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              {/* Glowing gradient background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Number (Watermark) */}
              <span className="absolute top-4 right-6 text-6xl font-black text-white/[0.03] group-hover:text-purple-500/10 transition-colors pointer-events-none select-none font-mono">
                {step.num}
              </span>

              {/* Icon Box */}
              <div className="relative shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">
                <div className="text-2xl text-white group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10 pt-2">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
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
"use client";
import { motion } from "framer-motion";
import { TbCpu, TbShieldCheck, TbBolt, TbDatabase } from "react-icons/tb";
import MetricsDashboard from "./MetricsDashboard";

export default function About() {

  // Animation variants
  const textVariants = {
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
        className="absolute top-1/4 right-0 lg:-right-20 w-[800px] h-[800px] bg-macos-green/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"
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
            <motion.div variants={textVariants} className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-sm bg-macos-green/10 border border-macos-green/20 text-macos-green font-mono text-xs tracking-widest uppercase">
              <TbCpu className="text-sm" />
              <span>Operational Protocol</span>
            </motion.div>

            {/* Headline */}
            <motion.h2 variants={textVariants} className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 tracking-tight leading-[1.05]">
              Not an Agency.<br />
              A <span className="text-transparent bg-clip-text bg-gradient-to-r from-macos-green to-macos-yellow animate-shimmer bg-[length:200%_100%]">Technical Partner.</span>
            </motion.h2>

            {/* Copy */}
            <motion.p variants={textVariants} className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl font-light">
              Generic agencies ship code and disappear. <strong className="text-foreground font-semibold">Bezalel</strong> operates as a specialized engineering task force. We integrate with your team to build systems that handle real-world scale, financial precision, and high-volume data.
            </motion.p>

            {/* Metrics HUD */}
            <motion.div variants={textVariants} className="flex gap-12 border-t border-dashed border-border pt-8">
              {/* This section was removed as per the instruction, but the parent div remains */}
            </motion.div>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: EXECUTION PIPELINE --- */}
        <div className="relative flex flex-col gap-6">
          {/* This entire section was removed as per the instruction */}
        </div>

      </div>

      {/* --- METRICS DASHBOARD --- */}
      <div className="max-w-7xl mx-auto mt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">
            By The <span className="text-macos-green">Numbers</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real metrics from real projects. Our track record speaks for itself.
          </p>
        </motion.div>
        <MetricsDashboard />
      </div>

    </section>
  );
}
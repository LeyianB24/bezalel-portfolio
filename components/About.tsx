"use client";
import { motion } from "framer-motion";
import { TbCpu, TbShieldCheck, TbBolt, TbDatabase } from "react-icons/tb";
import MetricsDashboard from "./MetricsDashboard";

export default function About() {

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } }
  };

  return (
    <section id="about" className="relative overflow-hidden px-6 py-24 lg:py-32 bg-background">
      <div className="absolute inset-0 z-0 opacity-[0.06] bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.5),_transparent_30%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.4),_transparent_28%)]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-start gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="lg:sticky lg:top-24"
          >
            <motion.div variants={textVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary backdrop-blur-xl dark:bg-zinc-900/70">
              <TbCpu className="text-sm" />
              <span>Operational Protocol</span>
            </motion.div>

            <motion.h2 variants={textVariants} className="mb-8 text-4xl font-black leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Not an agency.
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-500 to-accent bg-clip-text text-transparent">
                A technical partner.
              </span>
            </motion.h2>

            <motion.p variants={textVariants} className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We join your team as builders, operators, and strategists. From product experiences to infrastructure and payments, we deliver systems that feel effortless, secure, and built to last.
            </motion.p>

            <motion.div variants={textVariants} className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "24/7", label: "delivery focus" },
                { value: "100%", label: "hands-on execution" },
                { value: "∞", label: "scalable thinking" },
              ].map((item) => (
                <div key={item.label} className="premium-card rounded-[22px] p-4 text-center">
                  <div className="text-2xl font-black text-foreground">{item.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-4"
          >
            {[
              {
                title: "Systems that feel premium",
                text: "Every interface and workflow is designed with clarity, motion, and confidence.",
                accent: "from-primary/20 to-cyan-500/10",
              },
              {
                title: "Built for scale",
                text: "We combine product design, backend architecture, and operational discipline into one execution layer.",
                accent: "from-accent/20 to-fuchsia-500/10",
              },
              {
                title: "Strategic from day one",
                text: "We shape the roadmap, reduce friction, and make the technology feel effortless for your users.",
                accent: "from-amber-500/20 to-orange-500/10",
              },
            ].map((item, index) => (
              <div key={item.title} className="premium-card rounded-[24px] p-6 md:p-7">
                <div className={`mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r ${item.accent}`} />
                <div className="text-xl font-semibold text-foreground">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Phase {index + 1}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h3 className="mb-4 text-3xl font-bold text-foreground">
              By the <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">numbers</span>
            </h3>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Real metrics from real projects. Our track record speaks for itself.
            </p>
          </motion.div>
          <MetricsDashboard />
        </div>
      </div>
    </section>
  );
}
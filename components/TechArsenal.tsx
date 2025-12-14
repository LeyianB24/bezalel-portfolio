"use client";
import { motion } from "framer-motion";

// 1. Icons
import { 
  SiNextdotjs, SiReact, SiTypescript, SiJavascript, SiPython, SiFlask, 
  SiPostgresql, SiPhp, SiLaravel, SiMongodb, SiAndroid, SiCplusplus, 
  SiSharp, SiTailwindcss, SiRedux, SiHtml5, SiCss3
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { BsChatSquareDots, BsPhone, BsCreditCard2Front, BsWallet2 } from "react-icons/bs";

// --- CONFIGURATION: GROUPED DATA ---
const techGroups = [
  {
    title: "Frontend & Mobile",
    description: "Pixel-perfect interfaces and robust client-side logic.",
    stack: [
      { name: "Next.js", icon: <SiNextdotjs />, color: "group-hover:text-white" },
      { name: "React", icon: <SiReact />, color: "group-hover:text-[#61DAFB]" },
      { name: "TypeScript", icon: <SiTypescript />, color: "group-hover:text-[#3178C6]" },
      { name: "Tailwind", icon: <SiTailwindcss />, color: "group-hover:text-[#38B2AC]" },
      { name: "Android", icon: <SiAndroid />, color: "group-hover:text-[#3DDC84]" },
      { name: "Javascript", icon: <SiJavascript />, color: "group-hover:text-[#F7DF1E]" },
    ]
  },
  {
    title: "Backend & Systems",
    description: "Heavy-lifting logic, databases, and high-performance algorithms.",
    stack: [
      { name: "Python", icon: <SiPython />, color: "group-hover:text-[#3776AB]" },
      { name: "Laravel", icon: <SiLaravel />, color: "group-hover:text-[#FF2D20]" },
      { name: "PostgreSQL", icon: <SiPostgresql />, color: "group-hover:text-[#4169E1]" },
      { name: "Java", icon: <FaJava />, color: "group-hover:text-[#007396]" },
      { name: "C++", icon: <SiCplusplus />, color: "group-hover:text-[#00599C]" },
      { name: "C#", icon: <SiSharp />, color: "group-hover:text-[#239120]" },
    ]
  },
  {
    title: "Fintech Integrations",
    description: "Connecting your business to the African financial ecosystem.",
    stack: [
      { name: "M-PESA (Daraja)", icon: <BsPhone />, color: "group-hover:text-green-500", isIntegration: true },
      { name: "Africa's Talking", icon: <BsChatSquareDots />, color: "group-hover:text-orange-500", isIntegration: true },
      { name: "Paystack", icon: <BsCreditCard2Front />, color: "group-hover:text-blue-400", isIntegration: true },
      { name: "Stripe", icon: <BsWallet2 />, color: "group-hover:text-[#635BFF]", isIntegration: true },
    ]
  }
];

export default function TechArsenal() {
  return (
    <section id="arsenal" className="py-32 px-6 bg-[#02040a] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
          >
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">ARSENAL</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            We don't just write code; we engineer solutions. Here are the weapons we use to win your war.
          </p>
        </div>

        {/* Groups Mapping */}
        <div className="space-y-20">
          {techGroups.map((group, groupIdx) => (
            <div key={group.title} className="relative">
              
              {/* Group Title & Description */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8 border-l-4 border-purple-600 pl-4"
              >
                <h3 className="text-2xl font-bold text-white mb-1">{group.title}</h3>
                <p className="text-slate-500 text-sm">{group.description}</p>
              </motion.div>

              {/* The Grid for this Group */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                 {group.stack.map((tech, index) => (
                   <TechItem key={tech.name} tech={tech} index={index} />
                 ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// Extracted Item Component
function TechItem({ tech, index }: { tech: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col items-center justify-center p-6 bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-purple-500/30 rounded-xl transition-all duration-300 cursor-default"
    >
      {/* Icon */}
      <div className={`text-4xl mb-4 text-slate-600 transition-colors duration-300 ${tech.color}`}>
        {tech.icon}
      </div>
      
      {/* Label */}
      <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-wider text-center">
        {tech.name}
      </span>

      {/* Integration Indicator Dot */}
      {tech.isIntegration && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
      )}
    </motion.div>
  );
}
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend, FiMail, FiMapPin, FiMessageCircle, FiTerminal, FiActivity, FiArrowRight } from "react-icons/fi";

// =====================
// DATA & TYPES
// =====================

// RENAMED: Clearer service names for non-tech clients
const SERVICES = [
  { id: "blueprint", label: "MVP / Prototype", price: "Startups" },
  { id: "system", label: "Web Application", price: "Business Logic" },
  { id: "enterprise", label: "Custom Software", price: "Enterprise" },
  { id: "consult", label: "Consultation", price: "Hourly" }
];

// =====================
// MAIN COMPONENT
// =====================

export default function ContactTerminal() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: SERVICES[0], 
    message: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get("plan"); 
    
    if (planParam) {
      const matched = SERVICES.find(s => planParam.toLowerCase().includes(s.id)) || SERVICES[0];
      setFormState(prev => ({
        ...prev,
        service: matched,
        message: `Hi, I'm interested in discussing a ${matched.label} project.`
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleServiceSelect = (service: typeof SERVICES[0]) => {
    setFormState({ ...formState, service });
  };

  // --- Actions (Humanized Payloads) ---
  const handleWhatsApp = () => {
    const phoneNumber = "254796157265"; 
    // Friendly, readable format
    const text = `Hi Bezalel,\n\nName: ${formState.name}\nInterest: ${formState.service.label}\n\nMessage:\n${formState.message}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleEmailDirect = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Project Inquiry: ${formState.service.label}`;
    const body = `Name: ${formState.name}\nEmail: ${formState.email}\n\nInterest: ${formState.service.label}\n\n${formState.message}`;
    window.location.href = `mailto:bezaleltech@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 bg-background min-h-screen overflow-hidden flex items-center justify-center">
      
      {/* Background Grid - Kept for the aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* --- LEFT COLUMN: HUMAN INVITATION --- */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-macos-green" />
                <span className="text-xs font-mono font-bold text-macos-green tracking-widest uppercase">
                  Open for Business
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-6">
                READY TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-macos-green to-macos-yellow">
                  BUILD THIS?
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                We bridge the gap between complex engineering and simple user experiences. Tell us about your idea, and we&apos;ll tell you how we can engineer it.
              </p>

              

              {/* Contact Nodes */}
              <div className="space-y-4">
                <ContactNode 
                  icon={<FiMail />} 
                  label="Email Us" 
                  value="bezaleltech@gmail.com" 
                  action={() => window.location.href = "mailto:bezaleltech@gmail.com"}
                />
                <ContactNode 
                  icon={<FiMapPin />} 
                  label="Office" 
                  value="Nairobi, Kenya" 
                  action={() => {}}
                />
              </div>
            </motion.div>
          </div>


          {/* --- RIGHT COLUMN: THE TERMINAL (Visuals = Tech, Text = Human) --- */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative "Cable" */}
              <div className="absolute -left-10 top-20 w-10 h-px bg-gradient-to-r from-transparent to-macos-green/50 hidden lg:block" />

              {/* Terminal Container */}
              <form 
                onSubmit={handleEmailDirect}
                className="relative glass-card border border-stone-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                {/* Terminal Header Bar */}
                <div className="bg-slate-100 dark:bg-white/5 px-4 py-3 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2">
                    <FiTerminal /> CONTACT_FORM.EXE
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  
                  {/* Identity Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TerminalInput 
                      label="Your Name" 
                      name="name" 
                      placeholder="e.g. John Doe" 
                      value={formState.name} 
                      onChange={handleChange} 
                    />
                    <TerminalInput 
                      label="Your Email" 
                      name="email" 
                      type="email"
                      placeholder="john@company.com" 
                      value={formState.email} 
                      onChange={handleChange} 
                    />
                  </div>

                  {/* Service Selector */}
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-3">
                      {/* // What are we building? */}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SERVICES.map((s) => (
                        <div 
                          key={s.id}
                          onClick={() => handleServiceSelect(s)}
                          className={`relative cursor-pointer group p-3 rounded border transition-all duration-300
                            ${formState.service.id === s.id 
                              ? "bg-macos-green/5 border-macos-green/50" 
                              : "bg-transparent border-stone-200 dark:border-white/10 hover:border-stone-400"
                            }
                          `}
                        >
                          {formState.service.id === s.id && (
                            <motion.div 
                              layoutId="active-ring"
                              className="absolute inset-0 border-2 border-macos-green rounded pointer-events-none"
                            />
                          )}
                          
                          <div className="flex justify-between items-center relative z-10">
                            <span className={`text-sm font-bold ${formState.service.id === s.id ? "text-macos-green" : "text-muted-foreground"}`}>
                              {s.label}
                            </span>
                            {formState.service.id === s.id && <FiActivity className="text-macos-green animate-pulse" />}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1">{s.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="relative">
                      <label className="block text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-3">
                        {/* // Project Details */}
                      </label>
                    <textarea 
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full bg-slate-100 dark:bg-white/5 border-l-2 border-slate-300 dark:border-white/10 focus:border-macos-green p-4 text-sm text-foreground focus:outline-none transition-colors resize-none font-mono"
                      placeholder="> Tell us a bit about what you need..."
                    />
                  </div>

                  {/* Execute Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <button 
                      type="submit"
                      className="group relative flex items-center justify-center gap-3 py-4 bg-foreground text-background font-bold uppercase tracking-wider text-xs rounded hover:opacity-90 transition-all overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Send Request <FiSend />
                      </span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    </button>

                    <button 
                      type="button"
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-3 py-4 border border-green-500/30 text-green-600 bg-green-500/5 font-bold uppercase tracking-wider text-xs rounded hover:bg-green-500 hover:text-white transition-all"
                    >
                      <FiMessageCircle className="text-lg" /> Chat on WhatsApp
                    </button>
                  </div>

                  {/* Footer Status */}
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 uppercase">
                    <span>Bezalel Systems</span>
                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500"/> Online</span>
                  </div>

                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// =====================
// SUB-COMPONENTS
// =====================

function ContactNode({ icon, label, value, action }: { icon: React.ReactNode, label: string, value: string, action: () => void }) {
  return (
    <div 
      onClick={action}
      className="group flex items-center gap-4 p-4 border border-slate-200 dark:border-white/5 rounded-lg hover:border-macos-green/30 hover:bg-macos-green/5 transition-all cursor-pointer"
    >
      <div className="w-10 h-10 rounded flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:text-macos-green transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="font-medium text-foreground group-hover:text-macos-green transition-colors">{value}</div>
      </div>
      <FiArrowRight className="ml-auto opacity-0 group-hover:opacity-100 text-macos-green transition-opacity" />
    </div>
  );
}

function TerminalInput({ label, name, type = "text", placeholder, value, onChange }: { label: string, name: string, type?: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative group">
      <label className="flex justify-between text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-2">
        <span>{`// ${label}`}</span>
        <span className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors duration-300 ${hasValue ? "bg-macos-green shadow-macos-green/50" : "bg-stone-600"}`} />
      </label>
      <div className="relative">
        <input 
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-slate-100 dark:bg-white/5 border-b-2 border-slate-300 dark:border-white/10 px-4 py-3 text-sm text-foreground focus:outline-none transition-colors"
        />
        <div 
          className={`absolute bottom-0 left-0 h-0.5 bg-macos-green transition-all duration-300 ease-out
            ${focused ? "w-full" : "w-0"}
          `} 
        />
      </div>
    </div>
  );
}
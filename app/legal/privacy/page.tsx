// app/legal/privacy/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  ShieldCheck, Lock, Eye, Server, 
  FileText, Globe, Fingerprint, Mail, 
  ChevronRight, AlertCircle, CheckCircle2 
} from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "December 18, 2025";
  const [activeSection, setActiveSection] = useState("overview");

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Smooth Scroll Handler
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 pt-32 pb-20 selection:bg-purple-500/30">
      
      {/* --- READING PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-600 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="mb-16 border-b border-slate-200 dark:border-slate-800 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-mono text-sm text-purple-600 dark:text-purple-400 font-bold tracking-wider uppercase">
              Legal & Compliance
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Privacy Policy
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center text-slate-500">
            <p className="font-mono text-sm">Last Updated: {lastUpdated}</p>
            <span className="hidden md:block w-1 h-1 bg-slate-500 rounded-full" />
            <p className="text-sm">Effective Date: January 1, 2026</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* --- SIDEBAR NAVIGATION (Sticky) --- */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-1 border-l-2 border-slate-200 dark:border-slate-800">
               <NavButton id="overview" label="Overview" active={activeSection} onClick={scrollTo} />
               <NavButton id="collection" label="Data Collection" active={activeSection} onClick={scrollTo} />
               <NavButton id="usage" label="How We Use It" active={activeSection} onClick={scrollTo} />
               <NavButton id="security" label="Security" active={activeSection} onClick={scrollTo} />
               <NavButton id="rights" label="Your Rights" active={activeSection} onClick={scrollTo} />
               <NavButton id="contact" label="Contact Us" active={activeSection} onClick={scrollTo} />
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <div className="lg:col-span-9 space-y-24">

            {/* SECTION: Overview (TL;DR) */}
            <section id="overview" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Executive Summary
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <SummaryCard 
                  icon={<CheckCircle2 className="text-green-500" />}
                  title="We don't sell data"
                  desc="Your personal information is never sold to third-party advertisers."
                />
                <SummaryCard 
                  icon={<Lock className="text-blue-500" />}
                  title="Encrypted by default"
                  desc="All data in transit and at rest is secured with AES-256 encryption."
                />
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                At Bezalel Technologies ("we", "us", or "our"), trust is our currency. This policy outlines exactly what we touch, why we touch it, and how we protect it. We believe in radical transparency.
              </p>
            </section>

            {/* SECTION: Data Collection (Visual Grid) */}
            <section id="collection" className="scroll-mt-32">
               <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  <h2 className="text-2xl font-bold">1. Data We Collect</h2>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
               </div>
               
               <p className="mb-8 text-slate-600 dark:text-slate-400">
                  We group your personal data into specific categories to manage it securely.
               </p>

               <div className="grid md:grid-cols-2 gap-6">
                  <DataCategoryCard 
                    icon={<Fingerprint className="text-purple-500" />}
                    title="Identity Data"
                    items={["First & Last Name", "Username", "Date of Birth", "Government ID (KYC)"]}
                  />
                  <DataCategoryCard 
                    icon={<Mail className="text-blue-500" />}
                    title="Contact Data"
                    items={["Email Address", "Physical Billing Address", "Phone Number"]}
                  />
                  <DataCategoryCard 
                    icon={<Server className="text-amber-500" />}
                    title="Technical Data"
                    items={["IP Address", "Browser Type/Version", "Time Zone Setting", "OS Platform"]}
                  />
                  <DataCategoryCard 
                    icon={<Globe className="text-green-500" />}
                    title="Usage Data"
                    items={["Page Interaction Stats", "Feature Usage", "Error Logs", "Clickstreams"]}
                  />
               </div>
            </section>

            {/* SECTION: Usage */}
            <section id="usage" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-6">2. How We Use Your Data</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                <p>
                  We only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="grid gap-4 list-none pl-0">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-purple-500 shrink-0" />
                    <span><strong>Contractual Necessity:</strong> Where we need to perform the contract we are about to enter into or have entered into with you (e.g., processing a payment).</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-purple-500 shrink-0" />
                    <span><strong>Legitimate Interest:</strong> Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-purple-500 shrink-0" />
                    <span><strong>Legal Compliance:</strong> Where we need to comply with a legal or regulatory obligation (e.g., tax reporting).</span>
                  </li>
                </ul>
              </div>
            </section>

             {/* SECTION: Security */}
            <section id="security" className="scroll-mt-32">
              <h2 className="text-2xl font-bold mb-6">3. Security Framework</h2>
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 relative overflow-hidden text-slate-300">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                 
                 <div className="relative z-10">
                   <p className="mb-6">
                     We employ a defense-in-depth strategy. Our security measures include, but are not limited to:
                   </p>
                   
                   <div className="grid sm:grid-cols-2 gap-8 mt-8">
                      <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Lock className="w-4 h-4 text-purple-400"/> Encryption</h4>
                        <p className="text-sm">Data at rest is encrypted using AES-256. Data in transit is secured via TLS 1.3.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Eye className="w-4 h-4 text-purple-400"/> Access Control</h4>
                        <p className="text-sm">Strict Role-Based Access Control (RBAC) and Multi-Factor Authentication (MFA) for all internal staff.</p>
                      </div>
                   </div>
                 </div>
              </div>
            </section>

            {/* SECTION: Contact */}
            <section id="contact" className="scroll-mt-32 mb-20">
               <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                     <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Have specific privacy concerns?</h4>
                     <p className="text-slate-600 dark:text-slate-400 mb-0">
                        Our Data Protection Officer (DPO) is available to answer your questions.
                     </p>
                  </div>
                  <a href="mailto:privacy@bezalel.com" className="whitespace-nowrap px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90 transition-opacity">
                     Email Privacy Team
                  </a>
               </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function NavButton({ id, label, active, onClick }: { id: string, label: string, active: string, onClick: (id: string) => void }) {
   const isActive = active === id;
   return (
      <button 
         onClick={() => onClick(id)}
         className={`text-left w-full px-4 py-2 text-sm font-medium transition-all border-l-2 -ml-[2px] ${isActive ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
      >
         {label}
      </button>
   )
}

function SummaryCard({ icon, title, desc }: any) {
   return (
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
         <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            {icon}
         </div>
         <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="text-sm text-slate-500 leading-tight mt-1">{desc}</p>
         </div>
      </div>
   )
}

function DataCategoryCard({ icon, title, items }: any) {
   return (
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
         <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
               {icon}
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{title}</h3>
         </div>
         <ul className="space-y-2">
            {items.map((item: string, i: number) => (
               <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  {item}
               </li>
            ))}
         </ul>
      </div>
   )
}
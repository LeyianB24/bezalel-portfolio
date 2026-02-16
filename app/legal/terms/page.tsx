// app/legal/terms/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, FileSignature, ShieldAlert, Gavel, 
  Copyright, AlertTriangle, Check, Download, 
  HelpCircle, ScrollText, ArrowRight
} from "lucide-react";

export default function TermsOfService() {
  const [hasSigned, setHasSigned] = useState(false);
  const [activeClause, setActiveClause] = useState<number | null>(null);

  const effectiveDate = "December 18, 2025";
  const docVersion = "v2.4.1";

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-slate-100 pt-32 pb-40 selection:bg-indigo-500/30">
      
      {/* --- FLOATING STATUS BAR --- */}
      <div className="fixed top-24 right-6 z-40 hidden xl:flex flex-col gap-2">
         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl w-64">
            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] uppercase font-bold text-slate-500">Document Status</span>
               <span className="text-[10px] font-mono text-indigo-500">{docVersion}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
               <div className={`w-2 h-2 rounded-full ${hasSigned ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
               {hasSigned ? 'Legally Acknowledged' : 'Pending Acknowledgment'}
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-slate-200 dark:border-slate-800 pb-12">
          <div>
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-mono mb-6"
             >
               <Scale className="w-3 h-3" />
               LEGAL AGREEMENT
             </motion.div>
             <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-4">
               Terms of Service
             </h1>
             <p className="text-slate-500 max-w-xl text-lg">
               The rules of the road. Please read these terms carefully before using our digital infrastructure.
             </p>
          </div>
          
          <div className="flex gap-4 mt-8 md:mt-0">
             <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" /> PDF Version
             </button>
             <div className="text-right hidden md:block">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Effective Date</div>
                <div className="font-mono text-sm">{effectiveDate}</div>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* --- SIDEBAR NAVIGATION --- */}
          <aside className="hidden lg:block lg:col-span-3">
             <nav className="sticky top-32 space-y-8">
                <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-4">Table of Contents</h3>
                   <ul className="space-y-1 border-l border-slate-200 dark:border-slate-800">
                      <NavItem label="1. Acceptance" isActive={activeClause === 0} onClick={() => document.getElementById('clause-1')?.scrollIntoView({ behavior: 'smooth' })} />
                      <NavItem label="2. Use License" isActive={activeClause === 1} onClick={() => document.getElementById('clause-2')?.scrollIntoView({ behavior: 'smooth' })} />
                      <NavItem label="3. Intellectual Property" isActive={activeClause === 2} onClick={() => document.getElementById('clause-3')?.scrollIntoView({ behavior: 'smooth' })} />
                      <NavItem label="4. Liability Limits" isActive={activeClause === 3} onClick={() => document.getElementById('clause-4')?.scrollIntoView({ behavior: 'smooth' })} />
                      <NavItem label="5. Termination" isActive={activeClause === 4} onClick={() => document.getElementById('clause-5')?.scrollIntoView({ behavior: 'smooth' })} />
                   </ul>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                   <HelpCircle className="w-5 h-5 text-indigo-500 mb-2" />
                   <p className="text-xs text-slate-500 leading-relaxed">
                      <strong>Need clarification?</strong><br/>
                      Our support team can explain these terms, but cannot provide legal advice.
                   </p>
                </div>
             </nav>
          </aside>

          {/* --- MAIN CONTRACT CONTENT --- */}
          <div className="lg:col-span-9 space-y-12">
             
             {/* Clause 1 */}
             <ClauseSection 
               id="clause-1"
               number="01"
               title="Acceptance of Terms"
               icon={<FileSignature />}
               legalText="By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service."
               humanText="By using our site, you're agreeing to these rules. If you don't agree, you essentially can't use our stuff."
             />

             {/* Clause 2 */}
             <ClauseSection 
               id="clause-2"
               number="02"
               title="Use License"
               icon={<ScrollText />}
               legalText="Permission is granted to temporarily download one copy of the materials (information or software) on Bezalel's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose, or for any public display."
               humanText="You can view our content, but you can't steal it, resell it, or claim it's yours. This is a viewing pass, not a deed of ownership."
             />

             {/* Clause 3 */}
             <ClauseSection 
               id="clause-3"
               number="03"
               title="Intellectual Property"
               icon={<Copyright />}
               legalText="The Service and its original content, features, and functionality are and will remain the exclusive property of Bezalel Technologies and its licensors. The Service is protected by copyright, trademark, and other laws of Kenya and foreign countries."
               humanText="Our logo, our code, and our designs belong to us. Please don't use them without asking first."
             />

             {/* Clause 4 */}
             <ClauseSection 
               id="clause-4"
               number="04"
               title="Limitation of Liability"
               icon={<ShieldAlert />}
               isWarning
               legalText="In no event shall Bezalel Technologies, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
               humanText="We try our best, but we aren't liable if using our site causes you to lose money or data. Use at your own risk."
             />

             {/* Clause 5 */}
             <ClauseSection 
               id="clause-5"
               number="05"
               title="Governing Law"
               icon={<Gavel />}
               legalText="These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
               humanText="If we have a legal dispute, it will be handled in Kenya under Kenyan law."
             />

             {/* --- SIGNATURE BLOCK --- */}
             <div className="mt-24 p-8 md:p-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <h3 className="text-2xl font-serif font-medium mb-4">Acknowledgment</h3>
                <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                   Please confirm that you have read, understood, and agreed to be bound by these Terms of Service.
                </p>
                
                <button 
                  onClick={() => setHasSigned(true)}
                  disabled={hasSigned}
                  className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${hasSigned ? 'bg-green-500 text-white cursor-default' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02]'}`}
                >
                   {hasSigned ? (
                      <>
                         <Check className="w-5 h-5" /> Agreed & Accepted
                      </>
                   ) : (
                      <>
                         I Agree to Terms <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                   )}
                </button>
                
                {hasSigned && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-6 text-xs font-mono text-slate-400"
                   >
                      Digital Signature ID: {Math.random().toString(36).substring(7).toUpperCase()}-Signed-{new Date().getFullYear()}
                   </motion.div>
                )}
             </div>

          </div>
        </div>
      </div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function NavItem({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
   return (
      <li>
         <button 
            onClick={onClick}
            className={`text-sm px-4 py-2 w-full text-left border-l-2 transition-all ${isActive ? 'border-indigo-500 text-indigo-500 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
         >
            {label}
         </button>
      </li>
   )
}

function ClauseSection({ id, number, title, icon, legalText, humanText, isWarning = false }: any) {
   return (
      <section id={id} className="scroll-mt-32 group">
         <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-slate-300 dark:text-slate-700 font-bold">/{number}</span>
            <div className={`p-2 rounded-lg ${isWarning ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
               {icon}
            </div>
            <h2 className="text-2xl font-serif font-medium">{title}</h2>
         </div>

         <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Legalese */}
            <div className={`prose dark:prose-invert prose-sm max-w-none ${isWarning ? 'text-red-900 dark:text-red-200' : 'text-slate-700 dark:text-slate-300'}`}>
               <p className="font-serif leading-relaxed text-base border-l-2 border-slate-200 dark:border-slate-800 pl-4 py-1">
                  {legalText}
               </p>
            </div>

            {/* Right: Human Translation */}
            <div className="relative">
               <div className="absolute -inset-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  In Plain English
               </h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {humanText}
               </p>
            </div>
         </div>
         
         <div className="h-px bg-slate-100 dark:bg-slate-900 mt-12 w-full" />
      </section>
   )
}
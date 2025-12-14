"use client";
import { motion } from "framer-motion";
import { FaGithub, FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: <FaInstagram />, 
      href: "https://instagram.com/leyian_.b", 
      label: "Instagram" 
    },
    { 
      icon: <FaXTwitter />, 
      href: "https://twitter.com/LeyianB", 
      label: "X (Twitter)" 
    },
    { 
      icon: <FaTiktok />, 
      href: "https://www.tiktok.com/@leyian_.b", 
      label: "TikTok" 
    },
    { 
      icon: <FaGithub />, 
      href: "https://github.com/LeyianB24", 
      label: "GitHub" 
    },
    { 
      icon: <FaWhatsapp />, 
      // Formatted for international clicking (Kenya code +254)
      href: "https://wa.me/254796157265", 
      label: "WhatsApp" 
    },
  ];

  const footerLinks = [
    { title: "Company", links: ["About", "Careers", "Contact"] },
    { title: "Services", links: ["Web Development", "Mobile Apps", "Fintech Integrations"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
  ];

  return (
    // ID="CONTACT" allows the Header button to scroll here
    <footer id="contact" className="bg-[#02040a] border-t border-white/10 pt-24 pb-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Glowing Blob for depth */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- Top Section: Call to Action --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-white/5 pb-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Scale?</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Stop settling for generic templates. Let's build a system that actually handles your business logic.
            </p>
          </div>
          
          <a 
            href="https://wa.me/254796157265" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            Start a Conversation
            <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
          </a>
        </div>

        {/* --- Middle Section: Links & Brand --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-black text-white tracking-tighter">
              BEZALEL<span className="text-purple-600">.</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Architecting the digital future with precision code and robust integrations. From Nairobi to the world.
            </p>
            
            {/* Social Icons moved here for visibility */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-white mb-6 tracking-wide">{column.title}</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-600 uppercase tracking-widest">
          <p>© {currentYear} Bezalel Technologies.</p>
          <div className="flex gap-8">
            <span>Nairobi, Kenya</span>
            <span>Est. {currentYear}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
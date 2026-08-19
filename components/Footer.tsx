"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const serviceLinks = [
  { name: "Software and web systems", href: "/#services" },
  { name: "IT infrastructure and AV", href: "/#services" },
  { name: "Systems support", href: "/#services" },
  { name: "Payments and workflows", href: "/#services" },
];

const companyLinks = [
  { name: "Portfolio", href: "/portfolio" },
  { name: "Store", href: "/store" },
  { name: "Careers", href: "/careers" },
  { name: "Admin login", href: "/login" },
];

const legalLinks = [
  { name: "Privacy", href: "/legal/privacy" },
  { name: "Terms", href: "/legal/terms" },
];

const socials = [
  { icon: FaInstagram, href: "https://instagram.com/leyian_.b", label: "Instagram" },
  { icon: FaXTwitter, href: "https://twitter.com/LeyianB", label: "X" },
  { icon: FaTiktok, href: "https://www.tiktok.com/@leyian_.b", label: "TikTok" },
  { icon: FaGithub, href: "https://github.com/LeyianB24", label: "GitHub" },
  { icon: FaWhatsapp, href: "https://wa.me/254796157265", label: "WhatsApp" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:py-20">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent-light">
              Bezalel Technologies
            </p>
            <h2 className="max-w-3xl font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Need software or infrastructure delivered properly?
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
              Share the problem, timeline, and budget range. We will review the brief and respond with the next practical step.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/projects/request"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent-light"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/254796157265"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-white/10"
            >
              WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-2xl font-black">Bezalel</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-primary-foreground/70">
              Custom software engineering, cloud systems, mobile platforms, and IT infrastructure serving clients worldwide.
            </p>
          </div>

          <FooterColumn title="Services" links={serviceLinks} />
          <FooterColumn title="Company" links={companyLinks} />

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-accent-light">Global Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent-light" />
                <a href="mailto:bezaleltech@gmail.com" className="hover:text-primary-foreground">
                  bezaleltech@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent-light" />
                <a href="tel:+254796157265" className="hover:text-primary-foreground">
                  +254 796 157 265
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent-light" />
                HQ: Nairobi, Kenya · Serving Globally
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-primary-foreground/60">
            <span>&copy; {currentYear} Bezalel Technologies. All rights reserved.</span>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary-foreground">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-md border border-white/10 p-2 text-primary-foreground/70 transition-colors hover:border-accent-light hover:text-accent-light"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-accent-light">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href + link.name}>
            <Link href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, Phone } from "lucide-react";

interface ContactChannel {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
  actionText: string;
}

const CHANNELS: ContactChannel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    href: "https://wa.me/254796157265",
    icon: MessageCircle,
    isExternal: true,
    actionText: "Chat on WhatsApp (+254 796 157 265)",
  },
  {
    id: "email",
    name: "Email",
    href: "mailto:bezaleltech@gmail.com",
    icon: Mail,
    actionText: "Email: bezaleltech@gmail.com",
  },
  {
    id: "call",
    name: "Direct Call",
    href: "tel:+254796157265",
    icon: Phone,
    actionText: "Call Engineering Desk: +254 796 157 265",
  },
];

export default function ContactRail() {
  const pathname = usePathname();

  // Hide on admin studio, login, and project request page
  if (
    pathname === "/projects/request" ||
    pathname === "/login" ||
    pathname?.startsWith("/studio")
  ) {
    return null;
  }

  return (
    <aside
      aria-label="Direct contact channels"
      className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1.5 rounded-l-lg border-l border-y border-white/20 bg-[#050D17]/90 px-1.5 py-2.5 backdrop-blur-md shadow-xl transition-all"
    >
      {CHANNELS.map(({ id, name, href, icon: Icon, isExternal, actionText }) => (
        <div key={id} className="relative group flex items-center">
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            aria-label={`${name}: ${actionText}`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#C9A24B] transition-all hover:bg-white/10 hover:text-[#E8CD84] hover:-translate-x-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]"
          >
            <Icon className="h-4 w-4" />
          </a>

          {/* Tooltip on hover / focus */}
          <div
            role="tooltip"
            className="pointer-events-none absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/20 bg-[#0B2036] px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 group-focus-within:opacity-100 group-focus-within:translate-x-0"
          >
            {actionText}
          </div>
        </div>
      ))}
    </aside>
  );
}

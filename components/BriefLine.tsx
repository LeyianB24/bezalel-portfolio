"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";

export interface BriefLineProps {
  variant?: "hero" | "inline" | "bar";
  className?: string;
  placeholder?: string;
}

interface IntentChip {
  id: string;
  label: string;
  type: string;
  starter: string;
}

const INTENT_CHIPS: IntentChip[] = [
  {
    id: "website",
    label: "Website",
    type: "website",
    starter: "A modern web portal and client interface for ",
  },
  {
    id: "business-system",
    label: "Business system",
    type: "business-system",
    starter: "A custom operations platform and core business system for ",
  },
  {
    id: "it-infrastructure",
    label: "IT infrastructure",
    type: "it-infrastructure",
    starter: "Enterprise network architecture, security, and infrastructure for ",
  },
  {
    id: "quote",
    label: "Get a quote",
    type: "quote",
    starter: "An itemized milestone quotation and technical scope for ",
  },
];

const HERO_EXAMPLES = [
  "A SACCO management system with M-Pesa…",
  "Network and CCTV for our estate…",
  "An online shop with M-Pesa checkout…",
  "Custom ERP for cross-border fleet logistics…",
  "High-availability API gateway with webhook audit…",
];

export default function BriefLine({
  variant = "hero",
  className = "",
  placeholder,
}: BriefLineProps) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [text, setText] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `brief-input-${variant}`;
  const hintId = `brief-hint-${variant}`;

  // Rotating typewriter animation for hero variant
  useEffect(() => {
    if (variant !== "hero" || prefersReducedMotion) {
      return;
    }

    const currentPhrase = HERO_EXAMPLES[exampleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedPlaceholder.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedPlaceholder(currentPhrase.slice(0, displayedPlaceholder.length + 1));
        }, 45);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedPlaceholder.length > 0) {
        timer = setTimeout(() => {
          setDisplayedPlaceholder(currentPhrase.slice(0, displayedPlaceholder.length - 1));
        }, 25);
      } else {
        setIsDeleting(false);
        setExampleIndex((prev) => (prev + 1) % HERO_EXAMPLES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [variant, prefersReducedMotion, displayedPlaceholder, isDeleting, exampleIndex]);

  // If mobile bar variant, check whether we should hide on special routes
  if (variant === "bar") {
    if (
      pathname === "/projects/request" ||
      pathname === "/login" ||
      pathname?.startsWith("/studio")
    ) {
      return null;
    }
  }

  const handleChipClick = (chip: IntentChip) => {
    setSelectedType(chip.type);
    setText(chip.starter);
    setHint(null);
    if (inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end of starter text
      const len = chip.starter.length;
      inputRef.current.setSelectionRange(len, len);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setHint("Tell us a little about what you need");
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // Cap text at 500 characters
    const capped = trimmed.slice(0, 500);
    const params = new URLSearchParams();
    params.set("brief", capped);
    if (selectedType) {
      params.set("type", selectedType);
    }

    router.push(`/projects/request?${params.toString()}`);
  };

  const activePlaceholder =
    placeholder ||
    (variant === "hero"
      ? prefersReducedMotion
        ? "e.g. A SACCO management system with M-Pesa checkout…"
        : displayedPlaceholder || "Describe what you need built…"
      : variant === "bar"
      ? "What system do you need built?…"
      : "Describe your system needs or project scope…");

  // Variant: Mobile fixed bottom bar
  if (variant === "bar") {
    return (
      <aside
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#050D17]/95 backdrop-blur-md border-t border-white/15 px-3 py-2.5 shadow-2xl safe-area-bottom"
        aria-label="Mobile quick project brief bar"
      >
        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
          <label htmlFor={inputId} className="sr-only">
            Tell us about your project
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value.slice(0, 500));
              if (hint) setHint(null);
            }}
            maxLength={500}
            aria-describedby={hint ? hintId : undefined}
            placeholder={activePlaceholder}
            className="w-full rounded-lg border border-white/20 bg-white/[0.08] pl-3.5 pr-11 py-2.5 text-xs text-white placeholder:text-white/45 focus:border-[#C9A24B] focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
          />
          <button
            type="submit"
            aria-label="Submit project brief"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md bg-[#C9A24B] hover:bg-[#E8CD84] text-[#050D17] flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        {hint && (
          <p
            id={hintId}
            role="status"
            aria-live="polite"
            className="text-[11px] text-amber-300 mt-1 font-medium px-1"
          >
            {hint}
          </p>
        )}
      </aside>
    );
  }

  // Variant: Hero (large input + intent chips)
  if (variant === "hero") {
    return (
      <div className={`w-full ${className}`}>
        <form onSubmit={handleSubmit} className="relative w-full">
          <label htmlFor={inputId} className="sr-only">
            Describe what you need built
          </label>
          <div className="relative flex items-center rounded-lg border border-white/25 bg-white/[0.08] backdrop-blur-md shadow-lg transition-all focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/35">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, 500));
                if (hint) setHint(null);
              }}
              maxLength={500}
              aria-describedby={hint ? hintId : undefined}
              placeholder={activePlaceholder}
              className="w-full bg-transparent pl-4 pr-12 py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none min-h-[48px]"
            />
            <button
              type="submit"
              aria-label="Submit project brief"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-[#C9A24B] hover:bg-[#E8CD84] text-[#050D17] flex items-center justify-center transition-colors shadow-md"
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </form>

        {hint && (
          <p
            id={hintId}
            role="status"
            aria-live="polite"
            className="text-xs text-amber-300 mt-1.5 font-medium px-1"
          >
            {hint}
          </p>
        )}

        {/* Intent Chips */}
        <div
          className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2"
          role="group"
          aria-label="Quick start options"
        >
          {INTENT_CHIPS.map((chip) => {
            const isSelected = selectedType === chip.type;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`rounded-md px-2.5 py-1 text-[11px] sm:text-xs font-medium transition-all ${
                  isSelected
                    ? "border border-[#C9A24B] bg-[#C9A24B]/25 text-[#E8CD84] font-semibold"
                    : "border border-white/20 bg-white/[0.05] text-white/80 hover:bg-white/[0.12] hover:border-[#C9A24B]/60 hover:text-white"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant: Inline (medium, used at end of content sections)
  return (
    <div className={`w-full max-w-xl ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <label htmlFor={inputId} className="sr-only">
          Describe your system needs
        </label>
        <div className="relative flex items-center rounded-lg border border-border bg-card/90 shadow-sm transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value.slice(0, 500));
              if (hint) setHint(null);
            }}
            maxLength={500}
            aria-describedby={hint ? hintId : undefined}
            placeholder={activePlaceholder}
            className="w-full bg-transparent pl-4 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[44px]"
          />
          <button
            type="submit"
            aria-label="Submit project brief"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-accent hover:bg-accent-light text-accent-foreground flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
      {hint && (
        <p
          id={hintId}
          role="status"
          aria-live="polite"
          className="text-xs text-amber-500 dark:text-amber-400 mt-1 font-medium px-1 text-left"
        >
          {hint}
        </p>
      )}
    </div>
  );
}

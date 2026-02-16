import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FiCheck, FiCpu, FiServer, FiArrowRight, FiGlobe, FiDatabase, FiLayers } from "react-icons/fi";
import { Providers } from "@/components/Providers";
import "./globals.css";

// --- 1. FONTS: High-Performance Loading ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true, // Prevents layout shift
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// --- 2. VIEWPORT: Matching the "Reactor Core" Theme ---
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFCF9" }, // Artisan Ivory
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },  // Zinc 950
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Accessibility: Allow users to zoom if needed
  userScalable: true,
};

// --- 3. METADATA: Enterprise-Grade SEO ---
export const metadata: Metadata = {
  metadataBase: new URL('https://bezalel.tech'),
  
  title: {
    default: "Bezalel Tech | High-Performance Digital Engineering",
    template: "%s | Bezalel Tech",
  },
  
  description: "Architecting the digital future. We build scalable, high-velocity software systems for ambitious enterprises. Logic. Structure. Scale.",
  
  keywords: [
    "Software Architecture",
    "High-Performance Web", 
    "React Server Components", 
    "Next.js Enterprise", 
    "Fintech Development Kenya", 
    "System Design"
  ],
  
  authors: [{ name: "Bezalel Tech Team", url: "https://bezalel.tech" }],
  creator: "Bezalel Technologies",
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    title: "Bezalel Tech | Logic. Structure. Scale.",
    description: "Premier software consultancy engineered for speed and reliability.",
    url: "https://bezalel.tech",
    siteName: "Bezalel Technologies",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Bezalel Tech Reactor Core Interface",
    }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bezalel Tech",
    description: "High-performance software engineering.",
    images: ["/og-image.png"],
    creator: "@bezaleltech",
  },
};

// --- 4. SCHEMA.ORG (JSON-LD): Google Rich Snippets ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Bezalel Technologies",
  "image": "https://bezalel.tech/og-image.png",
  "description": "Software consultancy specializing in high-performance web architecture.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nairobi",
    "addressCountry": "KE"
  },
  "priceRange": "$$$"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is vital for next-themes
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inject JSON-LD Schema for SEO dominance */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-background 
          text-foreground
          /* 👇 UPDATED: Matches macOS green accent color */
          selection:bg-macos-green/30 
          selection:text-macos-green
          scrollbar-hide
        `}
      >
        <div className="noise" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
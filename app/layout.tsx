import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransitions } from 'next-view-transitions';
import { Providers } from "@/components/Providers";
import "./globals.css";

// --- 1. FONTS: High-Performance Loading ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// --- 2. VIEWPORT: Matching the Premium Theme ---
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1E1E" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// --- 3. METADATA: Premium SEO ---
export const metadata: Metadata = {
  title: 'Bezalel Technologies | Premium Software Development',
  description: 'Enterprise-grade software engineering with macOS-inspired design and high-performance architecture.',
  openGraph: {
    images: ['/og-image.png'],
    title: 'Bezalel Technologies',
    description: 'Enterprise-grade software engineering.',
    url: 'https://bezalel.tech',
    siteName: 'Bezalel Technologies',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bezalel Technologies',
    description: 'Enterprise-grade software engineering.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`
            ${geistSans.variable} 
            ${geistMono.variable} 
            antialiased 
            bg-background 
            text-foreground 
            selection:bg-[#C9A24B]/30 
            selection:text-[#0B2036]
            scrollbar-hide
          `}
        >
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
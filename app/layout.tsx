import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Providers } from "@/components/Providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EC" },
    { media: "(prefers-color-scheme: dark)", color: "#050D17" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Bezalel Technologies | Software and IT Infrastructure in Kenya",
  description:
    "Software development, IT infrastructure, AV, systems support, and project delivery for Kenyan businesses and institutions.",
  openGraph: {
    images: ["/og-image.png"],
    title: "Bezalel Technologies",
    description: "Software and IT infrastructure for Kenyan businesses and institutions.",
    url: "https://bezalel.tech",
    siteName: "Bezalel Technologies",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bezalel Technologies",
    description: "Software and IT infrastructure for Kenyan businesses and institutions.",
    images: ["/og-image.png"],
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
            ${plusJakartaSans.variable} 
            ${outfit.variable} 
            ${jetbrainsMono.variable} 
            font-sans
            antialiased 
            bg-background 
            text-foreground 
            selection:bg-accent/30 
            selection:text-foreground
            scrollbar-hide
          `}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}

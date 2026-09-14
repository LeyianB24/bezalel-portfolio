import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono, IBM_Plex_Serif } from "next/font/google";
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

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  metadataBase: new URL("https://bezalel.website"),
  title: {
    default: "Bezalel Technologies | Global Software Engineering & Infrastructure",
    template: "%s | Bezalel Technologies",
  },
  description:
    "Custom software engineering, cloud systems, mobile platforms, API architecture, and enterprise IT infrastructure serving ambitious organizations worldwide.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logos/bezalel-mark-gold.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    images: ["/og-image.png"],
    title: "Bezalel Technologies | Global Software Engineering & Infrastructure",
    description: "Custom software engineering, cloud systems, mobile platforms, and enterprise IT infrastructure serving clients worldwide.",
    url: "https://bezalel.website",
    siteName: "Bezalel Technologies",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bezalel Technologies | Global Software Engineering & Infrastructure",
    description: "Custom software engineering, cloud systems, mobile platforms, and enterprise IT infrastructure serving clients worldwide.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://bezalel.website/#organization",
      "name": "Bezalel Technologies",
      "url": "https://bezalel.website",
      "logo": "https://bezalel.website/logos/bezalel-mark-gold.svg",
      "description": "Custom software engineering, high-throughput financial ledgers, cloud architecture, and enterprise IT infrastructure.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Valley View Office Park, 2nd Floor, Block 1, Parklands",
        "addressLocality": "Nairobi",
        "addressCountry": "KE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+254796157265",
        "contactType": "customer support",
        "email": "bezaleltech@gmail.com"
      },
      "sameAs": [
        "https://twitter.com/LeyianB",
        "https://github.com/LeyianB24",
        "https://instagram.com/leyian_.b"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://bezalel.website/#website",
      "url": "https://bezalel.website",
      "name": "Bezalel Technologies",
      "publisher": {
        "@id": "https://bezalel.website/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`
            ${plusJakartaSans.variable} 
            ${outfit.variable} 
            ${ibmPlexSerif.variable}
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

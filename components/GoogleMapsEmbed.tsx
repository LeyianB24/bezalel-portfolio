"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, ExternalLink, Clock, ShieldCheck } from "lucide-react";

interface GoogleMapsEmbedProps {
  title?: string;
  className?: string;
}

export default function GoogleMapsEmbed({
  title = "Bezalel Technologies Headquarters",
  className = "",
}: GoogleMapsEmbedProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapView, setMapView] = useState<"google" | "satellite" | "street">("google");
  const [isVisible, setIsVisible] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Lazy load iframe only when user scrolls near the map component
  useEffect(() => {
    if (!containerRef || isVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(containerRef);
    return () => observer.disconnect();
  }, [containerRef, isVisible]);

  // Valley View Office Park, Parklands, Nairobi, Kenya (-1.2647, 36.8242)
  const lat = -1.2647;
  const lon = 36.8242;
  const bbox = `${lon - 0.008}%2C${lat - 0.006}%2C${lon + 0.008}%2C${lat + 0.006}`;

  // Direct Google Maps embed URLs (permitted via next.config.ts CSP frame-src)
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=Valley+View+Office+Park,+Parklands,+Nairobi,+Kenya&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const googleSatelliteEmbedUrl = `https://maps.google.com/maps?q=Valley+View+Office+Park,+Parklands,+Nairobi,+Kenya&t=k&z=17&ie=UTF8&iwloc=&output=embed`;
  const streetMapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  const currentEmbedUrl =
    mapView === "satellite"
      ? googleSatelliteEmbedUrl
      : mapView === "street"
      ? streetMapEmbedUrl
      : googleMapsEmbedUrl;

  const googleMapsUrl = `https://www.google.com/maps/place/Valley+View+Office+Park/@-1.2584373,36.8301789,17z`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=Valley+View+Office+Park,+Parklands,+Nairobi,+Kenya`;

  return (
    <div
      ref={setContainerRef}
      className={`rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col ${className}`}
    >
      {/* Header with Address Badges */}
      <div className="p-4 sm:p-5 border-b border-border bg-background/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              2nd Floor, Block 1, Valley View Office Park, Parklands, Nairobi, Kenya
            </p>
          </div>
        </div>

        {/* View Switcher & Action Links */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex rounded-lg border border-border bg-secondary/40 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMapLoaded(false);
                setMapView("google");
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapView === "google"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Google Map
            </button>
            <button
              type="button"
              onClick={() => {
                setMapLoaded(false);
                setMapView("satellite");
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapView === "satellite"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => {
                setMapLoaded(false);
                setMapView("street");
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapView === "street"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Street Map
            </button>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <MapPin className="h-3.5 w-3.5 text-[#C9A24B]" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-xs font-bold text-accent-foreground hover:bg-accent-light transition-colors shadow-xs"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Get Directions</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[300px] sm:min-h-[360px] bg-muted/40">
        {!isVisible ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-card/60 backdrop-blur-xs">
            <div className="h-12 w-12 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-3">
              <MapPin className="h-6 w-6 animate-bounce" />
            </div>
            <h4 className="font-display text-sm sm:text-base font-bold text-foreground">
              Valley View Office Park, Nairobi
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              2nd Floor, Block 1, Parklands · GPS: -1.2647, 36.8242
            </p>
            <button
              type="button"
              onClick={() => setIsVisible(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-bold text-accent-foreground hover:bg-accent-light transition-colors shadow-xs"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Load Interactive Map</span>
            </button>
          </div>
        ) : (
          <>
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-xs z-10 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  <span>Loading Google Maps preview...</span>
                </div>
              </div>
            )}

            <iframe
              key={mapView}
              src={currentEmbedUrl}
              title="Google Maps Location Preview - Valley View Office Park"
              loading="lazy"
              onLoad={() => setMapLoaded(true)}
              className="w-full h-full border-0 contrast-[1.02] opacity-95 transition-opacity duration-300"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-3 bg-secondary/30 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[#C9A24B] shrink-0" />
          <span>Office Hours: Mon – Fri 08:00 – 18:00 EAT (24/7 for SLA clients)</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#C9A24B] shrink-0" />
          <span>On-site consultations by prior appointment</span>
        </div>
      </div>
    </div>
  );
}

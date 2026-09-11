import prisma from "@/lib/prisma";
import StorePageClient, { StoreProduct, StoreCategory } from "./StorePageClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Electronics Accessories & Networking Equipment Store | Bezalel Technologies Kenya",
  description:
    "Buy genuine networking equipment, switches, routers, HDMI cables, adapters, sockets, and server accessories in Nairobi, Kenya. Fast countrywide delivery & warranty.",
  openGraph: {
    title: "Electronics Accessories & Networking Equipment Store | Bezalel Technologies Kenya",
    description:
      "Enterprise networking switches, routers, 4K HDMI cables, power sockets, adapters, and server racks with instant M-Pesa & WhatsApp ordering.",
  },
};

const storeCategories = [
  { id: "cat-networking", name: "Networking & Switches", slug: "networking", icon: "Network" },
  { id: "cat-cables", name: "Cables & Converters", slug: "cables", icon: "Cable" },
  { id: "cat-power", name: "Power & Sockets", slug: "power-sockets", icon: "Zap" },
  { id: "cat-routers", name: "Routers & Wireless", slug: "routers", icon: "Wifi" },
  { id: "cat-adapters", name: "Adapters & Hubs", slug: "adapters", icon: "Cpu" },
  { id: "cat-servers", name: "Servers & Racks", slug: "servers", icon: "Server" },
];

const fallbackCatalog = [
  {
    id: "prod-sw-01",
    name: "UniFi Enterprise 24-Port 10G PoE+ Managed Switch",
    slug: "unifi-enterprise-24port-10g-poe",
    description: "Layer 3 enterprise switch with 24x 2.5GbE PoE+ ports, 2x 10G SFP+ uplinks, and 400W PoE power budget for mission-critical institutional LAN.",
    price: 85000,
    comparePrice: 95000,
    stock: 14,
    sku: "BZL-NET-10G",
    images: ["/images/products/unifi-switch-48-poe.jpg"],
    category: { id: "cat-networking", name: "Networking & Switches", slug: "networking" },
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "prod-rt-02",
    name: "MikroTik Cloud Router Switch 10G SFP+ (CRS305-1G-4S+IN)",
    slug: "mikrotik-crs305-10g-switch",
    description: "Compact desktop switch with 4x 10Gbps SFP+ cages and 1x Gigabit Ethernet port. Dual-boot RouterOS or SwOS.",
    price: 24500,
    comparePrice: 28000,
    stock: 20,
    sku: "BZL-RT-305",
    images: ["/images/products/mikrotik-cloud-router.jpg"],
    category: { id: "cat-routers", name: "Routers & Wireless", slug: "routers" },
    isFeatured: true,
    isBestseller: false,
  },
  {
    id: "prod-hdmi-03",
    name: "Ultra High-Speed HDMI 2.1 Cable (8K@60Hz / 4K@120Hz, 5M)",
    slug: "ultra-high-speed-hdmi-21-5m",
    description: "Heavy-duty braided nylon 48Gbps HDMI 2.1 cable with gold-plated connectors, eARC, Dynamic HDR, and Dolby Atmos support.",
    price: 3200,
    comparePrice: 4200,
    stock: 65,
    sku: "BZL-CBL-HDMI5",
    images: ["/images/products/hdmi-21-ultra-high-speed.jpg?v=2"],
    category: { id: "cat-cables", name: "Cables & Converters", slug: "cables" },
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "prod-ap-04",
    name: "High-Density Dual-Band WiFi 6 Access Point (AX3000)",
    slug: "high-density-wifi6-ap-ax3000",
    description: "Enterprise ceiling-mounted WiFi 6 AP with OFDMA, MU-MIMO, seamless roaming, and support for 500+ concurrent clients.",
    price: 26000,
    comparePrice: 29500,
    stock: 22,
    sku: "BZL-WIFI-AX3",
    images: ["/images/products/wifi6-mesh-router-system.jpg"],
    category: { id: "cat-routers", name: "Routers & Wireless", slug: "routers" },
    isFeatured: true,
    isBestseller: false,
  },
  {
    id: "prod-pwr-05",
    name: "Heavy-Duty 8-Way Rackmount PDU with Surge Protection",
    slug: "8-way-rackmount-pdu-surge",
    description: "Standard 19-inch 1U power distribution unit with master switch, 16A overload protection, and 3-meter copper input cord.",
    price: 6800,
    comparePrice: 8500,
    stock: 35,
    sku: "BZL-PWR-PDU8",
    images: ["/images/products/smart-surge-pdu-extension.jpg"],
    category: { id: "cat-power", name: "Power & Sockets", slug: "power-sockets" },
    isFeatured: false,
    isBestseller: true,
  },
  {
    id: "prod-adp-06",
    name: "USB-C 8-in-1 Gigabit Multiport Hub & 100W PD Adapter",
    slug: "usbc-8in1-gigabit-multiport-hub",
    description: "Aluminum alloy dock with 4K HDMI, Gigabit RJ45 Ethernet, 3x USB 3.0, SD/TF reader, and 100W Power Delivery pass-through.",
    price: 4900,
    comparePrice: 6200,
    stock: 48,
    sku: "BZL-ADP-HUB8",
    images: ["/images/products/usb-c-multiport-hub.jpg"],
    category: { id: "cat-adapters", name: "Adapters & Hubs", slug: "adapters" },
    isFeatured: true,
    isBestseller: false,
  },
  {
    id: "prod-cbl-07",
    name: "Cat6A Shielded S/FTP Pure Copper Patch Cord (10M)",
    slug: "cat6a-shielded-patch-cord-10m",
    description: "10-Gigabit verified 500MHz shielded patch cable with gold-plated RJ45 plugs for data center and high-interference environments.",
    price: 1850,
    comparePrice: 2400,
    stock: 120,
    sku: "BZL-CBL-CAT6A",
    images: ["/images/products/cat6a-shielded-cable.jpg"],
    category: { id: "cat-cables", name: "Cables & Converters", slug: "cables" },
    isFeatured: false,
    isBestseller: true,
  },
  {
    id: "prod-sck-08",
    name: "British Standard 13A Double Switched Socket with Dual USB-C",
    slug: "bs13a-double-switched-socket-usbc",
    description: "Premium tempered polycarbonate wall socket with 20W PD Type-C fast charging port and dual 13A surge-tested outlets.",
    price: 2400,
    comparePrice: 3100,
    stock: 55,
    sku: "BZL-SCK-BS13",
    images: ["/images/products/pd-100w-gan-fast-charger.jpg"],
    category: { id: "cat-power", name: "Power & Sockets", slug: "power-sockets" },
    isFeatured: false,
    isBestseller: false,
  },
  {
    id: "prod-srv-09",
    name: "Crestron Flex UC Boardroom 4K Video Collaboration Kit",
    slug: "crestron-flex-uc-boardroom-system",
    description: "Native Zoom Rooms & Teams touch controller with intelligent 4K auto-framing camera and 360-degree beamforming mic array.",
    price: 345000,
    comparePrice: 380000,
    stock: 6,
    sku: "BZL-AV-FLEX",
    images: ["/images/products/crestron-flex-conference.jpg"],
    category: { id: "cat-networking", name: "Networking & Switches", slug: "networking" },
    isFeatured: true,
    isBestseller: false,
  },
  {
    id: "prod-sec-10",
    name: "Hikvision Pro 32-Channel 4K AcuSense NVR (Up to 40TB)",
    slug: "hikvision-pro-32ch-4k-nvr",
    description: "AI-powered surveillance recorder with real-time perimeter protection, facial recognition, and RAID-1 storage failover.",
    price: 52000,
    comparePrice: 58000,
    stock: 18,
    sku: "BZL-SEC-NVR32",
    images: ["/images/products/hikvision-32ch-nvr.jpg"],
    category: { id: "cat-networking", name: "Networking & Switches", slug: "networking" },
    isFeatured: true,
    isBestseller: false,
  },
];

export default async function StorePage() {
  let cleanProducts: StoreProduct[] = fallbackCatalog;
  let cleanCategories: StoreCategory[] = storeCategories;

  try {
    const [dbProducts, dbCategories, dbEquipment] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.equipment.findMany({
        where: { status: "ACTIVE", isClientFacing: true },
        include: { product: true },
      }),
    ]);

    // Map DB products
    const mappedDbProducts = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      comparePrice: p.comparePrice,
      stock: p.stock,
      sku: p.sku || `BZL-PROD-${p.id.slice(-4).toUpperCase()}`,
      images: p.images && p.images.length > 0 ? p.images : ["/images/products/unifi-switch-48-poe.jpg"],
      category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : storeCategories[0],
      isFeatured: true,
      isBestseller: p.stock > 10,
    }));

    const existingSlugs = new Set(mappedDbProducts.map((p) => p.slug));

    // Also map equipment items into products
    const equipmentProducts = dbEquipment
      .filter((eq) => eq.isSellable)
      .map((eq) => {
        const slug = eq.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return {
          id: eq.id,
          name: eq.name,
          slug,
          description: eq.description,
          price: eq.product?.price || 85000,
          comparePrice: eq.product?.comparePrice || 95000,
          stock: eq.product?.stock || 12,
          sku: eq.product?.sku || `BZL-EQP-${eq.id.slice(-4).toUpperCase()}`,
          images: [eq.imageUrl || "/images/products/unifi-switch-48-poe.jpg"],
          category: { id: "cat-networking", name: "Networking & Switches", slug: "networking" },
          isFeatured: true,
          isBestseller: true,
        };
      })
      .filter((p) => !existingSlugs.has(p.slug));

    // Combine DB products, equipment, and accessories catalog
    const allKnownSlugs = new Set([...existingSlugs, ...equipmentProducts.map((p) => p.slug)]);
    const additionalFallbacks = fallbackCatalog.filter((f) => !allKnownSlugs.has(f.slug));

    cleanProducts = [...mappedDbProducts, ...equipmentProducts, ...additionalFallbacks];

    if (dbCategories.length > 0) {
      cleanCategories = storeCategories;
    }
  } catch (error) {
    console.error("StorePage database fetch error:", error);
  }

  return <StorePageClient products={cleanProducts} categories={cleanCategories} />;
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EquipmentCategory } from "@prisma/client";

// Baseline benchmark pricing for enterprise equipment packages
const EQUIPMENT_FALLBACK_PRICES: Record<string, { priceKES: number; stock: number }> = {
  "UniFi Enterprise 24-Port 10G PoE Managed Switch": { priceKES: 85000, stock: 14 },
  "Crestron Flex UC Boardroom Video System": { priceKES: 345000, stock: 6 },
  "Hikvision Pro 32-Channel 4K AcuSense NVR": { priceKES: 52000, stock: 18 },
  "Dell PowerEdge R650xs 1U Rackmount Server": { priceKES: 495000, stock: 4 },
  "Biometric Access Control & Time Attendance Terminal": { priceKES: 38000, stock: 22 },
};

const USD_EXCHANGE_RATE = 130; // Approx standard KES to USD rate

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get("category");
    const inStockOnly = searchParams.get("inStock") === "true";
    const searchQuery = searchParams.get("search")?.toLowerCase();

    // Query active and client-facing equipment
    const whereClause: Record<string, unknown> = {
      status: "ACTIVE",
      isClientFacing: true,
    };

    if (categoryParam && Object.values(EquipmentCategory).includes(categoryParam as EquipmentCategory)) {
      whereClause.category = categoryParam as EquipmentCategory;
    }

    const rawEquipment = await prisma.equipment.findMany({
      where: whereClause,
      orderBy: { displayOrder: "asc" },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            price: true,
            comparePrice: true,
            stock: true,
            sku: true,
          },
        },
      },
    });

    // Transform and calculate formatted prices, stock, and discount
    let items = rawEquipment.map((eq) => {
      const fallback = EQUIPMENT_FALLBACK_PRICES[eq.name] || { priceKES: 65000, stock: 10 };
      const rawPriceKES = eq.product?.price ?? fallback.priceKES;
      const rawPriceUSD = Math.round(rawPriceKES / USD_EXCHANGE_RATE);
      const stock = eq.product?.stock ?? fallback.stock;
      const comparePriceKES = eq.product?.comparePrice ?? null;
      const comparePriceUSD = comparePriceKES ? Math.round(comparePriceKES / USD_EXCHANGE_RATE) : null;

      return {
        id: eq.id,
        name: eq.name,
        category: eq.category,
        categoryLabel: eq.category.replace(/_/g, " "),
        description: eq.description,
        specs: eq.specs,
        imageUrl: eq.imageUrl || "/BG_images/codes people.jpg",
        isSellable: eq.isSellable,
        status: eq.status,
        sku: eq.product?.sku || `BZL-EQP-${eq.id.slice(-4).toUpperCase()}`,
        productSlug: eq.product?.slug || null,
        stock,
        isInStock: stock > 0,
        pricing: {
          currency: "KES",
          amountKES: rawPriceKES,
          amountUSD: rawPriceUSD,
          formattedKES: `KES ${rawPriceKES.toLocaleString()}`,
          formattedUSD: `$${rawPriceUSD.toLocaleString()}`,
          comparePriceKES,
          comparePriceUSD,
          discountPercentage:
            comparePriceKES && comparePriceKES > rawPriceKES
              ? Math.round(((comparePriceKES - rawPriceKES) / comparePriceKES) * 100)
              : 0,
        },
      };
    });

    // Apply inStock and search filter
    if (inStockOnly) {
      items = items.filter((item) => item.isInStock);
    }

    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.specs.some((spec) => spec.toLowerCase().includes(searchQuery))
      );
    }

    // Category breakdown count
    const categoryCounts = Object.values(EquipmentCategory).reduce(
      (acc, cat) => {
        acc[cat] = items.filter((i) => i.category === cat).length;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      success: true,
      total: items.length,
      exchangeRateUSD: USD_EXCHANGE_RATE,
      currency: "KES",
      categories: categoryCounts,
      items,
    });
  } catch (error) {
    console.error("GET /api/equipment/store error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch equipment store data",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

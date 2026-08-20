import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
  DocumentProps,
} from "@react-pdf/renderer";
import { getSiteLogoBase64 } from "./pdf-brand";

export interface QuotationLineItem {
  description: string;
  qty: number;
  unitPrice?: number;
  amount: number;
}

export interface TimelinePhase {
  phaseNumber?: string;
  name: string;
  description: string;
  dayRangeLabel: string;
}

export interface QuotationData {
  documentNumber?: string;
  quoteNumber?: string; // backwards compatibility
  documentType?: string; // default "RATE CARD", "QUOTATION", "INVOICE"
  date: string;
  validUntil: string;
  title?: string;
  projectTitle?: string; // backwards compatibility
  subtitle?: string;
  clientName: string;
  clientLocation?: string | null;
  clientEmail?: string;
  clientCompany?: string | null;
  clientPhone?: string | null;
  scopeSummary?: string | null;
  tableTitle?: string | null;
  lineItems: QuotationLineItem[];
  subtotal: number;
  tax?: number;
  taxLabel?: string | null;
  total: number;
  depositPercentage?: number;
  amountDueToStart?: number;
  depositNote?: string | null;
  depositBadge?: string | null;
  timelineTitle?: string | null;
  timelinePhases?: TimelinePhase[];
  paymentTerms?: string[];
  included?: string[];
  excluded?: string[];
  closingNote?: string | null;
  notes?: string | null; // backwards compatibility
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: "#1B2430",
    backgroundColor: "#FFFFFF",
  },
  // ─── HEADER ───────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#C9A24B",
    marginBottom: 16,
  },
  logoImage: {
    width: 140,
    height: 28,
    objectFit: "contain",
  },
  brandFallbackTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 1,
  },
  docTypeLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#C9A24B",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // ─── TITLE & SUBTITLE ─────────────────────────────────────────
  titleBlock: {
    marginBottom: 14,
  },
  mainTitle: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 0.2,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#C9A24B",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 3,
  },

  // ─── TWO-COLUMN META BLOCK ────────────────────────────────────
  metaSection: {
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metaCol: {
    width: "48%",
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#8FA0B3",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metaValuePrimary: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    lineHeight: 1.3,
  },
  metaValueSecondary: {
    fontSize: 8,
    color: "#1B2430",
    lineHeight: 1.3,
  },

  // ─── INTRO PARAGRAPH ──────────────────────────────────────────
  introParagraph: {
    fontSize: 8.5,
    color: "#1B2430",
    lineHeight: 1.45,
    marginBottom: 14,
  },

  // ─── SCOPE TABLE ──────────────────────────────────────────────
  tableTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    marginBottom: 6,
  },
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0B2036",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  thIndex: {
    width: "6%",
    color: "#FAF6EC",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  thQty: {
    width: "8%",
    color: "#FAF6EC",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  thDesc: {
    width: "64%",
    color: "#FAF6EC",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  thAmount: {
    width: "22%",
    color: "#FAF6EC",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    backgroundColor: "#F8FAFC",
  },
  tdIndex: {
    width: "6%",
    fontSize: 8,
    color: "#64748B",
    textAlign: "center",
  },
  tdQty: {
    width: "8%",
    fontSize: 8,
    color: "#1B2430",
    textAlign: "center",
  },
  tdDesc: {
    width: "64%",
    fontSize: 8,
    color: "#1B2430",
    lineHeight: 1.3,
  },
  tdAmount: {
    width: "22%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textAlign: "right",
  },

  // ─── TOTALS SUMMARY BLOCK ─────────────────────────────────────
  totalsContainer: {
    alignItems: "flex-end",
    marginTop: 4,
    marginBottom: 10,
  },
  totalsTable: {
    width: "55%",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsLabel: {
    fontSize: 8.5,
    color: "#1B2430",
    fontFamily: "Helvetica-Bold",
  },
  totalsVal: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textAlign: "right",
  },
  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  taxLabel: {
    fontSize: 8,
    color: "#1B2430",
    fontFamily: "Helvetica-Bold",
  },
  taxVal: {
    fontSize: 7.5,
    color: "#64748B",
    textAlign: "right",
    maxWidth: 180,
    lineHeight: 1.2,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderTopColor: "#C9A24B",
    paddingTop: 5,
    marginTop: 3,
  },
  grandTotalLabel: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },
  grandTotalVal: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },

  // ─── PAGE 2: AMOUNT DUE TO START CALLOUT ──────────────────────
  calloutBox: {
    backgroundColor: "#0B2036",
    borderRadius: 3,
    padding: 12,
    marginBottom: 16,
  },
  calloutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  calloutTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  calloutAmount: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#E8CD84",
  },
  calloutBody: {
    fontSize: 8,
    color: "#FAF6EC",
    lineHeight: 1.4,
    marginBottom: 8,
  },
  calloutBadge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#E8CD84",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // ─── TIMELINE PHASES ──────────────────────────────────────────
  sectionHeading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    marginBottom: 6,
  },
  timelineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
    rowGap: 8,
  },
  phaseCard: {
    backgroundColor: "#FAF6EC",
    borderWidth: 0.5,
    borderColor: "#E8CD84",
    borderRadius: 3,
    padding: 8,
  },
  phaseNumber: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  phaseName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    marginTop: 2,
  },
  phaseDesc: {
    fontSize: 7.5,
    color: "#475569",
    lineHeight: 1.3,
    marginTop: 3,
  },
  phaseDays: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
    marginTop: 4,
  },

  // ─── BULLET LISTS (TERMS & INCLUDED/EXCLUDED) ─────────────────
  bulletSection: {
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3.5,
  },
  bulletDot: {
    width: 10,
    fontSize: 8,
    color: "#0B2036",
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    color: "#1B2430",
    lineHeight: 1.35,
  },
  excludedIntroText: {
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.35,
    marginBottom: 4,
  },

  // ─── CLOSING NOTE ─────────────────────────────────────────────
  closingSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#E2E8F0",
  },
  closingClientName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    marginBottom: 2,
  },
  closingText: {
    fontSize: 7.5,
    color: "#64748B",
    lineHeight: 1.35,
    fontStyle: "italic",
  },
});

export const QuotationDocument = ({ data, logo }: { data: QuotationData; logo?: string }) => {
  const docNumber = data.documentNumber || data.quoteNumber || "RC-2026-001";
  const docType = (data.documentType || "RATE CARD").toUpperCase();
  const docTitle = data.title || data.projectTitle || "Project Proposal & Quotation";
  const docSubtitle = data.subtitle || "PROJECT PROPOSAL, COST ESTIMATE & TIMELINE";
  const clientLocation = data.clientLocation || data.clientCompany || "Nairobi, Kenya";
  const tableHeading = data.tableTitle || "Website Design & Development — Scope & Rates";

  const depositPercent = data.depositPercentage ?? 50;
  const depositAmount = data.amountDueToStart ?? Math.round(data.total * (depositPercent / 100));
  const defaultDepositNote = `A ${depositPercent}% deposit secures your project slot and covers planning through frontend development. Work begins once this is received. The remaining balance is due on delivery.`;
  const depositNote = data.depositNote || defaultDepositNote;
  const depositBadge = data.depositBadge || `${depositPercent}% UPFRONT · DUE BEFORE KICKOFF`;

  // Default timeline phases if none provided
  const phases: TimelinePhase[] = data.timelinePhases && data.timelinePhases.length > 0
    ? data.timelinePhases
    : [
        {
          phaseNumber: "PHASE 01",
          name: "Planning & Design",
          description: "Requirements gathering, UI/UX mockups, and brand alignment.",
          dayRangeLabel: "Days 1–5",
        },
        {
          phaseNumber: "PHASE 02",
          name: "Development",
          description: "Frontend storefront build, admin dashboard, M-Pesa & chatbot integration.",
          dayRangeLabel: "Days 6–22",
        },
        {
          phaseNumber: "PHASE 03",
          name: "Content & QA",
          description: "Product uploads, delivery-fee setup, cross-device testing, bug fixes.",
          dayRangeLabel: "Days 23–30",
        },
        {
          phaseNumber: "PHASE 04",
          name: "Launch",
          description: `Deployment, final walkthrough, and handover to ${data.clientName}.`,
          dayRangeLabel: "Days 31–35",
        },
      ];

  // Default payment terms if none provided
  const paymentTerms: string[] = data.paymentTerms && data.paymentTerms.length > 0
    ? data.paymentTerms
    : [
        `${depositPercent}% (KES ${depositAmount.toLocaleString("en-KE")}) is due upfront, before any work commences.`,
        `The remaining ${100 - depositPercent}% (KES ${(data.total - depositAmount).toLocaleString("en-KE")}) is due upon successful completion and delivery of the platform.`,
        "Work begins only after receipt of the initial deposit.",
        "Payment accepted via M-Pesa Paybill/Till or bank transfer to Bezalel Technologies.",
        "Add-on features or scope changes will be quoted and billed separately upon mutual agreement.",
      ];

  // Default included items if none provided
  const included: string[] = data.included && data.included.length > 0
    ? data.included
    : [
        "Mobile-first, responsive storefront across all devices",
        "Product catalog with categories, search/filters, and variant support",
        "M-Pesa STK Push checkout — automated payment reconciliation",
        "Order assistant chatbot for product questions, order status, and WhatsApp handoff",
        "Admin dashboard to manage products, orders, and delivery status",
        "Flat-rate delivery pricing (Nairobi vs. upcountry)",
        "1 round of revisions post-delivery, plus 14 days of post-launch support",
      ];

  const excluded: string[] = data.excluded || [];

  // Card width calculation for timeline
  const phaseCardWidth = phases.length === 2 ? "48%" : phases.length === 3 ? "31%" : phases.length === 4 ? "23.5%" : "48%";

  return (
    <Document>
      {/* ─── PAGE 1: HEADER, META, INTRO, TABLE, TOTALS ─────────────── */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            {logo ? (
              <Image src={logo} style={styles.logoImage} />
            ) : (
              <Text style={styles.brandFallbackTitle}>BEZALEL TECHNOLOGIES</Text>
            )}
          </View>
          <Text style={styles.docTypeLabel}>{docType}</Text>
        </View>

        {/* Title Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.mainTitle}>{docTitle}</Text>
          <Text style={styles.subtitle}>{docSubtitle}</Text>
        </View>

        {/* Two-Column Meta Block */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>PREPARED FOR</Text>
              <Text style={styles.metaValuePrimary}>{data.clientName}</Text>
              <Text style={styles.metaValueSecondary}>{clientLocation}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>PREPARED BY</Text>
              <Text style={styles.metaValuePrimary}>Tomaka Bezalel Leyian</Text>
              <Text style={styles.metaValueSecondary}>Bezalel Technologies</Text>
              <Text style={styles.metaValueSecondary}>technologiesbezalel@gmail.com |</Text>
              <Text style={styles.metaValueSecondary}>www.bezalel.website</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>DOCUMENT NO.</Text>
              <Text style={styles.metaValuePrimary}>{docNumber}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>DATE</Text>
              <Text style={styles.metaValuePrimary}>
                {data.date} | Valid Until: {data.validUntil}
              </Text>
            </View>
          </View>
        </View>

        {/* Scope Summary Intro */}
        {data.scopeSummary ? (
          <Text style={styles.introParagraph}>{data.scopeSummary}</Text>
        ) : null}

        {/* Line Items Table */}
        <Text style={styles.tableTitle}>{tableHeading}</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thIndex}>#</Text>
            <Text style={styles.thQty}>QTY</Text>
            <Text style={styles.thDesc}>DESCRIPTION</Text>
            <Text style={styles.thAmount}>AMOUNT (KES)</Text>
          </View>

          {data.lineItems.map((item, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <Text style={styles.tdIndex}>{index + 1}</Text>
              <Text style={styles.tdQty}>{item.qty}</Text>
              <Text style={styles.tdDesc}>{item.description}</Text>
              <Text style={styles.tdAmount}>
                {item.amount.toLocaleString("en-KE")}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals Summary */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsVal}>KES {data.subtotal.toLocaleString("en-KE")}</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Tax</Text>
              <Text style={styles.taxVal}>
                {data.taxLabel ||
                  (data.tax && data.tax > 0
                    ? `KES ${data.tax.toLocaleString("en-KE")}`
                    : "N/A — sole proprietor rate, VAT not applicable")}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Project Cost</Text>
              <Text style={styles.grandTotalVal}>KES {data.total.toLocaleString("en-KE")}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ─── PAGE 2: DEPOSIT, TIMELINE, TERMS, INCLUDED, EXCLUDED, CLOSING ─ */}
      <Page size="A4" style={styles.page}>
        {/* Amount Due to Start Callout */}
        <View style={styles.calloutBox}>
          <View style={styles.calloutHeader}>
            <Text style={styles.calloutTitle}>Amount Due to Start</Text>
            <Text style={styles.calloutAmount}>KES {depositAmount.toLocaleString("en-KE")}</Text>
          </View>
          <Text style={styles.calloutBody}>{depositNote}</Text>
          <Text style={styles.calloutBadge}>{depositBadge}</Text>
        </View>

        {/* Project Timeline */}
        <Text style={styles.sectionHeading}>
          {data.timelineTitle || "Project Timeline — Estimated 5 Weeks"}
        </Text>
        <View style={styles.timelineGrid}>
          {phases.map((phase, idx) => (
            <View
              key={idx}
              style={[
                styles.phaseCard,
                { width: phaseCardWidth },
              ]}
            >
              <Text style={styles.phaseNumber}>
                {phase.phaseNumber || `PHASE 0${idx + 1}`}
              </Text>
              <Text style={styles.phaseName}>{phase.name}</Text>
              <Text style={styles.phaseDesc}>{phase.description}</Text>
              <Text style={styles.phaseDays}>{phase.dayRangeLabel}</Text>
            </View>
          ))}
        </View>

        {/* Payment Terms */}
        <View style={styles.bulletSection}>
          <Text style={styles.sectionHeading}>Payment Terms</Text>
          {paymentTerms.map((term, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{term}</Text>
            </View>
          ))}
        </View>

        {/* What's Included */}
        <View style={styles.bulletSection}>
          <Text style={styles.sectionHeading}>What&apos;s Included</Text>
          {included.map((item, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Not Included at This Budget (OMITTED IF EMPTY) */}
        {excluded && excluded.length > 0 ? (
          <View style={styles.bulletSection}>
            <Text style={styles.sectionHeading}>Not Included at This Budget</Text>
            {excluded.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={[styles.bulletText, { color: "#475569" }]}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Closing Note */}
        <View style={styles.closingSection}>
          <Text style={styles.closingClientName}>Thank you, {data.clientName}.</Text>
          <Text style={styles.closingText}>
            {data.closingNote ||
              `This rate card is an estimate based on the scope discussed. Final pricing may be adjusted if requirements change. Reach out anytime at technologiesbezalel@gmail.com.`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export async function generateQuotationPdfBuffer(data: QuotationData): Promise<Buffer> {
  const logo = getSiteLogoBase64();
  const element = React.createElement(QuotationDocument, { data, logo });
  const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);
  return buffer;
}

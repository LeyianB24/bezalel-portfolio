import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

export interface QuotationLineItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface QuotationData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  clientPhone?: string | null;
  projectTitle: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1B2430",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0B2036",
    paddingBottom: 16,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 8,
    color: "#8B6F2E",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    marginTop: 2,
  },
  brandContact: {
    fontSize: 8,
    color: "#4B5563",
    marginTop: 4,
    lineHeight: 1.3,
  },
  quoteMeta: {
    alignItems: "flex-end",
  },
  quoteTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    marginBottom: 4,
  },
  metaItem: {
    fontSize: 8,
    color: "#374151",
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: "Helvetica-Bold",
    color: "#1B2430",
  },
  section: {
    marginBottom: 16,
  },
  clientBox: {
    backgroundColor: "#FAF6EC",
    borderWidth: 1,
    borderColor: "#E8CD84",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  clientBoxTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clientCol: {
    width: "48%",
  },
  clientText: {
    fontSize: 9,
    color: "#1B2430",
    marginBottom: 2,
  },
  clientLabel: {
    fontSize: 8,
    color: "#6B7280",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0B2036",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB",
  },
  colDesc: {
    width: "55%",
  },
  colQty: {
    width: "10%",
    textAlign: "center",
  },
  colPrice: {
    width: "17%",
    textAlign: "right",
  },
  colAmount: {
    width: "18%",
    textAlign: "right",
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  totalsBox: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#FAFAFA",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1.5,
    borderTopColor: "#0B2036",
  },
  totalsLabel: {
    fontSize: 9,
    color: "#4B5563",
  },
  totalsValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1B2430",
  },
  totalAmountText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },
  termsBox: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  termsText: {
    fontSize: 7.5,
    color: "#4B5563",
    lineHeight: 1.35,
    marginBottom: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.5,
    color: "#6B7280",
  },
  signatoryText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textAlign: "right",
  },
  signatorySub: {
    fontSize: 7.5,
    color: "#8B6F2E",
    textAlign: "right",
  },
});

export const QuotationDocument = ({ data }: { data: QuotationData }) => (
  <Document title={`Quotation - ${data.quoteNumber} - Bezalel Technologies`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>BEZALEL TECHNOLOGIES</Text>
          <Text style={styles.brandSubtitle}>SOFTWARE & INFRASTRUCTURE ENGINEERING</Text>
          <Text style={styles.brandContact}>
            Nairobi, Kenya · +254 796 157 265{"\n"}
            bezaleltech@gmail.com · bezalel.website
          </Text>
        </View>
        <View style={styles.quoteMeta}>
          <Text style={styles.quoteTitle}>QUOTATION</Text>
          <Text style={styles.metaItem}>
            Quote #: <Text style={styles.metaValue}>{data.quoteNumber}</Text>
          </Text>
          <Text style={styles.metaItem}>
            Date: <Text style={styles.metaValue}>{data.date}</Text>
          </Text>
          <Text style={styles.metaItem}>
            Valid Until: <Text style={styles.metaValue}>{data.validUntil}</Text>
          </Text>
        </View>
      </View>

      {/* Client & Project Details */}
      <View style={styles.clientBox}>
        <Text style={styles.clientBoxTitle}>Prepared For</Text>
        <View style={styles.clientRow}>
          <View style={styles.clientCol}>
            <Text style={styles.clientText}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{data.clientName}</Text>
            </Text>
            {data.clientCompany ? (
              <Text style={styles.clientText}>{data.clientCompany}</Text>
            ) : null}
            <Text style={styles.clientText}>{data.clientEmail}</Text>
            {data.clientPhone ? (
              <Text style={styles.clientText}>{data.clientPhone}</Text>
            ) : null}
          </View>
          <View style={styles.clientCol}>
            <Text style={styles.clientLabel}>Project Title:</Text>
            <Text style={[styles.clientText, { fontFamily: "Helvetica-Bold", color: "#0B2036" }]}>
              {data.projectTitle}
            </Text>
            <Text style={[styles.clientLabel, { marginTop: 4 }]}>Currency:</Text>
            <Text style={styles.clientText}>Kenya Shillings (KES)</Text>
          </View>
        </View>
      </View>

      {/* Line Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colDesc]}>Scope Item / Deliverable</Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price (KES)</Text>
          <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount (KES)</Text>
        </View>

        {data.lineItems.map((item, i) => (
          <View
            key={i}
            style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]}
          >
            <Text style={[styles.colDesc, { fontSize: 8.5 }]}>{item.description}</Text>
            <Text style={[styles.colQty, { fontSize: 8.5 }]}>{item.qty}</Text>
            <Text style={[styles.colPrice, { fontSize: 8.5 }]}>
              {item.unitPrice.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.colAmount, { fontSize: 8.5, fontFamily: "Helvetica-Bold" }]}>
              {item.amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal:</Text>
            <Text style={styles.totalsValue}>
              KES {data.subtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          {data.tax > 0 ? (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>VAT (16%):</Text>
              <Text style={styles.totalsValue}>
                KES {data.tax.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ) : (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax / VAT:</Text>
              <Text style={styles.totalsValue}>KES 0.00</Text>
            </View>
          )}
          <View style={styles.totalsRowFinal}>
            <Text style={[styles.totalsLabel, { fontFamily: "Helvetica-Bold", color: "#0B2036" }]}>
              Total Investment:
            </Text>
            <Text style={styles.totalAmountText}>
              KES {data.total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Terms & Notes */}
      <View style={styles.termsBox}>
        <Text style={styles.termsTitle}>Payment Terms & Delivery Conditions</Text>
        <Text style={styles.termsText}>
          1. Milestone Schedule: 50% mobilization advance upon contract sign-off; 50% upon final staging sign-off and deployment handover.
        </Text>
        <Text style={styles.termsText}>
          2. Validity: This quotation remains valid for 30 calendar days from the date of issuance.
        </Text>
        <Text style={styles.termsText}>
          3. Settlement: Payments can be made via Bank Wire / EFT or M-Pesa Business Till to Bezalel Technologies accounts.
        </Text>
        {data.notes ? (
          <Text style={[styles.termsText, { marginTop: 4, fontFamily: "Helvetica-Bold" }]}>
            Notes: {data.notes}
          </Text>
        ) : null}
      </View>

      {/* Footer & Signatory */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>
            Bezalel Technologies · Registered Enterprise in the Republic of Kenya
          </Text>
          <Text style={[styles.footerText, { marginTop: 2 }]}>
            Confidential · Prepared exclusively for {data.clientName}
          </Text>
        </View>
        <View>
          <Text style={styles.signatoryText}>Tomaka Bezalel Leyian</Text>
          <Text style={styles.signatorySub}>Founder & Lead Systems Engineer</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generateQuotationPdfBuffer(data: QuotationData): Promise<Buffer> {
  const element = React.createElement(QuotationDocument, { data });
  // renderToBuffer from @react-pdf/renderer
  const buffer = await renderToBuffer(element as any);
  return buffer;
}

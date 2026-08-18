import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  DocumentProps,
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
    borderBottomColor: "#C9A24B",
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
    marginTop: 2,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  brandMeta: {
    fontSize: 8,
    color: "#8FA0B3",
    marginTop: 4,
    lineHeight: 1.4,
  },
  quoteTitleBlock: {
    alignItems: "flex-end",
  },
  quoteTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 1,
  },
  quoteMetaRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  quoteMetaLabel: {
    fontSize: 8,
    color: "#8FA0B3",
    width: 60,
    textAlign: "right",
  },
  quoteMetaVal: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    width: 75,
    textAlign: "right",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#FAF6EC",
    padding: 12,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#E8CD84",
  },
  infoCol: {
    width: "48%",
  },
  sectionHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },
  infoText: {
    fontSize: 8,
    color: "#1B2430",
    marginTop: 2,
  },
  projectScopeBox: {
    marginBottom: 16,
    padding: 10,
    borderLeftWidth: 2.5,
    borderLeftColor: "#C9A24B",
    backgroundColor: "#FAF6EC",
  },
  projectScopeTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },
  table: {
    width: "100%",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0B2036",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  thDesc: {
    width: "55%",
    color: "#FAF6EC",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  thQty: {
    width: "12%",
    color: "#FAF6EC",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  thPrice: {
    width: "16%",
    color: "#FAF6EC",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  thAmount: {
    width: "17%",
    color: "#FAF6EC",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E7EC",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    backgroundColor: "#FBFDFF",
  },
  tdDesc: {
    width: "55%",
    fontSize: 8.5,
    color: "#1B2430",
    lineHeight: 1.3,
  },
  tdQty: {
    width: "12%",
    fontSize: 8.5,
    color: "#1B2430",
    textAlign: "center",
  },
  tdPrice: {
    width: "16%",
    fontSize: 8.5,
    color: "#1B2430",
    textAlign: "right",
  },
  tdAmount: {
    width: "17%",
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textAlign: "right",
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  summaryBlock: {
    width: "45%",
    backgroundColor: "#FAF6EC",
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#E8CD84",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 8.5,
    color: "#8FA0B3",
  },
  summaryVal: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1B2430",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#C9A24B",
    paddingTop: 6,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },
  totalVal: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
  },
  termsBox: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
  },
  termsTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  termsText: {
    fontSize: 7.5,
    color: "#64748B",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 36,
    right: 36,
    borderTopWidth: 0.5,
    borderTopColor: "#CBD5E1",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#8FA0B3",
  },
  signatoryText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textAlign: "right",
  },
  signatorySub: {
    fontSize: 7,
    color: "#8B6F2E",
    textAlign: "right",
  },
});

const QuotationDocument = ({ data }: { data: QuotationData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>BEZALEL TECHNOLOGIES</Text>
          <Text style={styles.brandSubtitle}>Software & Infrastructure Engineering</Text>
          <Text style={styles.brandMeta}>
            Nairobi, Kenya · +254 796 157 265 · bezaleltech@gmail.com · bezalel.website
          </Text>
        </View>
        <View style={styles.quoteTitleBlock}>
          <Text style={styles.quoteTitle}>QUOTATION</Text>
          <View style={styles.quoteMetaRow}>
            <Text style={styles.quoteMetaLabel}>Quote No:</Text>
            <Text style={styles.quoteMetaVal}>{data.quoteNumber}</Text>
          </View>
          <View style={styles.quoteMetaRow}>
            <Text style={styles.quoteMetaLabel}>Date:</Text>
            <Text style={styles.quoteMetaVal}>{data.date}</Text>
          </View>
          <View style={styles.quoteMetaRow}>
            <Text style={styles.quoteMetaLabel}>Valid Until:</Text>
            <Text style={styles.quoteMetaVal}>{data.validUntil}</Text>
          </View>
        </View>
      </View>

      {/* CLIENT / PROJECT INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Prepared For</Text>
          <Text style={styles.clientName}>{data.clientName}</Text>
          {data.clientCompany && <Text style={styles.infoText}>{data.clientCompany}</Text>}
          <Text style={styles.infoText}>{data.clientEmail}</Text>
          {data.clientPhone && <Text style={styles.infoText}>{data.clientPhone}</Text>}
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Issued By</Text>
          <Text style={styles.clientName}>Bezalel Technologies Ltd</Text>
          <Text style={styles.infoText}>Engineering & Technical Services</Text>
          <Text style={styles.infoText}>Nairobi, Kenya</Text>
          <Text style={styles.infoText}>Currency: KES (Kenyan Shillings)</Text>
        </View>
      </View>

      {/* SCOPE TITLE */}
      <View style={styles.projectScopeBox}>
        <Text style={styles.projectScopeTitle}>Project / Scope: {data.projectTitle}</Text>
      </View>

      {/* LINE ITEMS TABLE */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.thDesc}>Deliverable / Scope Description</Text>
          <Text style={styles.thQty}>Qty</Text>
          <Text style={styles.thPrice}>Unit (KES)</Text>
          <Text style={styles.thAmount}>Amount (KES)</Text>
        </View>

        {data.lineItems.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={styles.tdDesc}>{item.description}</Text>
            <Text style={styles.tdQty}>{item.qty}</Text>
            <Text style={styles.tdPrice}>{item.unitPrice.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.tdAmount}>{item.amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</Text>
          </View>
        ))}
      </View>

      {/* TOTALS */}
      <View style={styles.summarySection}>
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryVal}>KES {data.subtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>VAT / Tax ({data.tax > 0 ? "16%" : "0%"}):</Text>
            <Text style={styles.summaryVal}>KES {data.tax.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Investment:</Text>
            <Text style={styles.totalVal}>KES {data.total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>
      </View>

      {/* TERMS & NOTES */}
      <View style={styles.termsBox}>
        <Text style={styles.termsTitle}>Payment Terms & Notes</Text>
        <Text style={styles.termsText}>
          {data.notes || "1. Milestone payments: 40% initial commitment deposit, 40% staged deliverable review, 20% final sign-off and deployment.\n2. Quotation is valid for 30 calendar days from issue date.\n3. All intellectual property and source code transfer upon final payment."}
        </Text>
      </View>

      {/* FOOTER */}
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
  const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);
  return buffer;
}

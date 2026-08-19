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

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentRef?: string | null;
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
  logoImage: {
    width: 170,
    height: 34,
    objectFit: "contain",
    marginBottom: 4,
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
  invoiceTitleBlock: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 1,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  invoiceMetaLabel: {
    fontSize: 8,
    color: "#8FA0B3",
    width: 65,
    textAlign: "right",
  },
  invoiceMetaVal: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    width: 80,
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
  customerName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },
  infoText: {
    fontSize: 8,
    color: "#1B2430",
    marginTop: 2,
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
  paidBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "#0B2036",
    borderRadius: 3,
    alignItems: "center",
  },
  paidBadgeText: {
    color: "#FAF6EC",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  deliveryBox: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
  },
  deliveryTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  deliveryText: {
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

const InvoiceDocument = ({ data, logo }: { data: InvoiceData; logo?: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          {logo ? (
            <Image src={logo} style={styles.logoImage} />
          ) : (
            <Text style={styles.brandTitle}>BEZALEL TECHNOLOGIES</Text>
          )}
          <Text style={styles.brandSubtitle}>Hardware Distribution & Software Products</Text>
          <Text style={styles.brandMeta}>
            Nairobi, Kenya · +254 796 157 265 · bezaleltech@gmail.com · bezalel.website
          </Text>
        </View>
        <View style={styles.invoiceTitleBlock}>
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
          <View style={styles.invoiceMetaRow}>
            <Text style={styles.invoiceMetaLabel}>Order Ref:</Text>
            <Text style={styles.invoiceMetaVal}>#{data.orderId.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.invoiceMetaRow}>
            <Text style={styles.invoiceMetaLabel}>Date:</Text>
            <Text style={styles.invoiceMetaVal}>{data.date}</Text>
          </View>
          <View style={styles.invoiceMetaRow}>
            <Text style={styles.invoiceMetaLabel}>Status:</Text>
            <Text style={styles.invoiceMetaVal}>CONFIRMED</Text>
          </View>
        </View>
      </View>

      {/* CLIENT / BILLING INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Billed & Shipped To</Text>
          <Text style={styles.customerName}>{data.customerName}</Text>
          <Text style={styles.infoText}>{data.customerEmail}</Text>
          {data.customerPhone && <Text style={styles.infoText}>{data.customerPhone}</Text>}
          <Text style={styles.infoText}>{data.shippingAddress}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Payment Details</Text>
          <Text style={styles.customerName}>{data.paymentMethod}</Text>
          {data.paymentRef && (
            <Text style={styles.infoText}>Transaction Ref: {data.paymentRef}</Text>
          )}
          <Text style={styles.infoText}>Currency: KES (Kenyan Shillings)</Text>
          <Text style={styles.infoText}>Fulfillment: Instant License / Nairobi Hub Dispatch</Text>
        </View>
      </View>

      {/* LINE ITEMS TABLE */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.thDesc}>Product / Item Description</Text>
          <Text style={styles.thQty}>Qty</Text>
          <Text style={styles.thPrice}>Unit (KES)</Text>
          <Text style={styles.thAmount}>Amount (KES)</Text>
        </View>

        {data.items.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={styles.tdDesc}>{item.name}</Text>
            <Text style={styles.tdQty}>{item.quantity}</Text>
            <Text style={styles.tdPrice}>
              {item.price.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tdAmount}>
              {(item.price * item.quantity).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>

      {/* TOTALS */}
      <View style={styles.summarySection}>
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryVal}>
              KES {data.subtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping / Handling:</Text>
            <Text style={styles.summaryVal}>FREE</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>VAT / Tax (0% Included):</Text>
            <Text style={styles.summaryVal}>KES 0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid:</Text>
            <Text style={styles.totalVal}>
              KES {data.total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>PAID IN FULL</Text>
          </View>
        </View>
      </View>

      {/* DISPATCH & SUPPORT POLICY */}
      <View style={styles.deliveryBox}>
        <Text style={styles.deliveryTitle}>Fulfillment & Warranty Terms</Text>
        <Text style={styles.deliveryText}>
          1. Digital items and license keys are delivered immediately via email and customer account portal.{"\n"}
          2. Physical enterprise hardware includes manufacturer warranty and 30-day technical support from Bezalel Technologies.{"\n"}
          3. For shipping tracking or technical queries, contact support on WhatsApp at +254 796 157 265 or bezaleltech@gmail.com.
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>
            Bezalel Technologies Ltd · Global Software & IT Infrastructure
          </Text>
          <Text style={[styles.footerText, { marginTop: 2 }]}>
            Official Electronic Tax Receipt · Order #{data.orderId.slice(-8).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.signatoryText}>Bezalel Operations</Text>
          <Text style={styles.signatorySub}>Finance & Hardware Logistics</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generateOrderInvoicePdfBuffer(data: InvoiceData): Promise<Buffer> {
  const logo = getSiteLogoBase64();
  const element = React.createElement(InvoiceDocument, { data, logo });
  const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);
  return buffer;
}

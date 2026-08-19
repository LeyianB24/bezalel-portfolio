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

export interface ProjectBriefData {
  requestId: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  clientPhone?: string | null;
  projectTitle: string;
  category: string;
  budget?: number | string | null;
  timeline?: string | null;
  description: string;
  attachmentUrl?: string | null;
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
  briefTitleBlock: {
    alignItems: "flex-end",
  },
  briefTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 1,
  },
  briefMetaRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  briefMetaLabel: {
    fontSize: 8,
    color: "#8FA0B3",
    width: 65,
    textAlign: "right",
  },
  briefMetaVal: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    width: 85,
    textAlign: "right",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
  scopeSummaryBox: {
    marginBottom: 16,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#C9A24B",
    backgroundColor: "#FAF6EC",
    borderRadius: 3,
  },
  scopeTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    marginBottom: 4,
  },
  scopeMetaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  scopeBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
    textTransform: "uppercase",
  },
  descriptionSection: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
  },
  descriptionHeading: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.5,
  },
  processSection: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 4,
    backgroundColor: "#FAF6EC",
    borderWidth: 0.5,
    borderColor: "#E8CD84",
  },
  processTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  processStep: {
    fontSize: 8,
    color: "#1B2430",
    marginBottom: 3,
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

const ProjectBriefDocument = ({ data }: { data: ProjectBriefData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>BEZALEL TECHNOLOGIES</Text>
          <Text style={styles.brandSubtitle}>Custom Software & Infrastructure Engineering</Text>
          <Text style={styles.brandMeta}>
            Nairobi, Kenya · +254 796 157 265 · bezaleltech@gmail.com · bezalel.website
          </Text>
        </View>
        <View style={styles.briefTitleBlock}>
          <Text style={styles.briefTitle}>PROJECT BRIEF</Text>
          <View style={styles.briefMetaRow}>
            <Text style={styles.briefMetaLabel}>Ref Code:</Text>
            <Text style={styles.briefMetaVal}>BEZ-{data.requestId.slice(-6).toUpperCase()}</Text>
          </View>
          <View style={styles.briefMetaRow}>
            <Text style={styles.briefMetaLabel}>Received:</Text>
            <Text style={styles.briefMetaVal}>{data.date}</Text>
          </View>
          <View style={styles.briefMetaRow}>
            <Text style={styles.briefMetaLabel}>Status:</Text>
            <Text style={styles.briefMetaVal}>UNDER REVIEW</Text>
          </View>
        </View>
      </View>

      {/* CLIENT INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Client Details</Text>
          <Text style={styles.clientName}>{data.clientName}</Text>
          {data.clientCompany && <Text style={styles.infoText}>Company: {data.clientCompany}</Text>}
          <Text style={styles.infoText}>Email: {data.clientEmail}</Text>
          {data.clientPhone && <Text style={styles.infoText}>Phone: {data.clientPhone}</Text>}
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Engineering Desk</Text>
          <Text style={styles.clientName}>Bezalel Architecture Group</Text>
          <Text style={styles.infoText}>Category: {data.category.replace(/_/g, " ")}</Text>
          <Text style={styles.infoText}>
            Target Budget: {data.budget ? (typeof data.budget === "number" ? `KES ${data.budget.toLocaleString()}` : String(data.budget)) : "Estimate on Scope"}
          </Text>
          <Text style={styles.infoText}>
            Target Delivery: {data.timeline || "Standard Sprint Allocation"}
          </Text>
        </View>
      </View>

      {/* PROJECT TITLE BOX */}
      <View style={styles.scopeSummaryBox}>
        <Text style={styles.scopeTitle}>Project Scope: {data.projectTitle}</Text>
        <View style={styles.scopeMetaRow}>
          <Text style={styles.scopeBadge}>Discipline: {data.category.replace(/_/g, " ")}</Text>
          <Text style={styles.scopeBadge}>Initial Estimate Target: {data.budget ? (typeof data.budget === "number" ? `KES ${data.budget.toLocaleString()}` : String(data.budget)) : "To be quoted"}</Text>
        </View>
      </View>

      {/* PROBLEM & SPECIFICATIONS DESCRIPTION */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionHeading}>Specification & Requirements Summary</Text>
        <Text style={styles.descriptionText}>{data.description}</Text>
      </View>

      {/* WHAT HAPPENS NEXT */}
      <View style={styles.processSection}>
        <Text style={styles.processTitle}>Engineering Assessment Process</Text>
        <Text style={styles.processStep}>
          1. Architecture Review: Our lead engineers assess technical stack requirements, API integrations, and database schemas.
        </Text>
        <Text style={styles.processStep}>
          2. Itemized Quotation: You will receive an official breakdown PDF outlining milestones, delivery timelines, and transparent costs within 24-48 hours.
        </Text>
        <Text style={styles.processStep}>
          3. Discovery Call: Direct technical alignment via Google Meet or WhatsApp with the engineering team.
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>
            Bezalel Technologies Ltd · Global Software & Digital Infrastructure
          </Text>
          <Text style={[styles.footerText, { marginTop: 2 }]}>
            Confidential · Project Brief Record #BEZ-{data.requestId.slice(-6).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.signatoryText}>Bezalel Architecture Group</Text>
          <Text style={styles.signatorySub}>Technical Evaluation Desk</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generateProjectBriefPdfBuffer(data: ProjectBriefData): Promise<Buffer> {
  const element = React.createElement(ProjectBriefDocument, { data });
  const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);
  return buffer;
}

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

export interface ApplicationPdfData {
  applicationId: string;
  date: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string | null;
  jobTitle: string;
  jobDepartment: string;
  coverNote?: string | null;
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
  appTitleBlock: {
    alignItems: "flex-end",
  },
  appTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    letterSpacing: 1,
  },
  appMetaRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  appMetaLabel: {
    fontSize: 8,
    color: "#8FA0B3",
    width: 65,
    textAlign: "right",
  },
  appMetaVal: {
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
  candidateName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
  },
  infoText: {
    fontSize: 8,
    color: "#1B2430",
    marginTop: 2,
  },
  roleSummaryBox: {
    marginBottom: 16,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#C9A24B",
    backgroundColor: "#FAF6EC",
    borderRadius: 3,
  },
  roleTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    marginBottom: 4,
  },
  roleMetaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  roleBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#8B6F2E",
    textTransform: "uppercase",
  },
  coverNoteSection: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
  },
  coverNoteHeading: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0B2036",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  coverNoteText: {
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

const ApplicationDocument = ({ data, logo }: { data: ApplicationPdfData; logo?: string }) => (
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
          <Text style={styles.brandSubtitle}>Engineering Recruitment & Talent Operations</Text>
          <Text style={styles.brandMeta}>
            Nairobi, Kenya · +254 796 157 265 · bezaleltech@gmail.com · bezalel.website
          </Text>
        </View>
        <View style={styles.appTitleBlock}>
          <Text style={styles.appTitle}>APPLICATION RECEIPT</Text>
          <View style={styles.appMetaRow}>
            <Text style={styles.appMetaLabel}>App ID:</Text>
            <Text style={styles.appMetaVal}>APP-{data.applicationId.slice(-6).toUpperCase()}</Text>
          </View>
          <View style={styles.appMetaRow}>
            <Text style={styles.appMetaLabel}>Date:</Text>
            <Text style={styles.appMetaVal}>{data.date}</Text>
          </View>
          <View style={styles.appMetaRow}>
            <Text style={styles.appMetaLabel}>Status:</Text>
            <Text style={styles.appMetaVal}>RECEIVED</Text>
          </View>
        </View>
      </View>

      {/* CANDIDATE INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Applicant Profile</Text>
          <Text style={styles.candidateName}>{data.applicantName}</Text>
          <Text style={styles.infoText}>Email: {data.applicantEmail}</Text>
          {data.applicantPhone && <Text style={styles.infoText}>Phone: {data.applicantPhone}</Text>}
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.sectionHeading}>Position Overview</Text>
          <Text style={styles.candidateName}>{data.jobTitle}</Text>
          <Text style={styles.infoText}>Department: {data.jobDepartment}</Text>
          <Text style={styles.infoText}>Engineering Operations · Bezalel Technologies</Text>
        </View>
      </View>

      {/* ROLE TITLE BOX */}
      <View style={styles.roleSummaryBox}>
        <Text style={styles.roleTitle}>Role: {data.jobTitle} ({data.jobDepartment})</Text>
        <View style={styles.roleMetaRow}>
          <Text style={styles.roleBadge}>Department: {data.jobDepartment}</Text>
          <Text style={styles.roleBadge}>Location: Remote / Nairobi Hybrid</Text>
        </View>
      </View>

      {/* COVER NOTE */}
      {data.coverNote && (
        <View style={styles.coverNoteSection}>
          <Text style={styles.coverNoteHeading}>Candidate Introduction / Project Summary</Text>
          <Text style={styles.coverNoteText}>{data.coverNote}</Text>
        </View>
      )}

      {/* NEXT STEPS */}
      <View style={styles.processSection}>
        <Text style={styles.processTitle}>Application & Interview Workflow</Text>
        <Text style={styles.processStep}>
          1. Portfolio & CV Review: Engineering leadership evaluates technical projects and architecture depth.
        </Text>
        <Text style={styles.processStep}>
          2. Technical Interview: Live architecture and coding discussion with senior systems engineers.
        </Text>
        <Text style={styles.processStep}>
          3. Fast Feedback: We provide transparent feedback and next steps promptly.
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>
            Bezalel Technologies Ltd · Global Software & Digital Infrastructure
          </Text>
          <Text style={[styles.footerText, { marginTop: 2 }]}>
            Confidential Application Record · ID #APP-{data.applicationId.slice(-6).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.signatoryText}>Bezalel Talent Desk</Text>
          <Text style={styles.signatorySub}>Engineering Recruitment</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generateApplicationAcknowledgmentPdfBuffer(data: ApplicationPdfData): Promise<Buffer> {
  const logo = getSiteLogoBase64();
  const element = React.createElement(ApplicationDocument, { data, logo });
  const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);
  return buffer;
}

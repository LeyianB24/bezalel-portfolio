import { PrismaClient, ProjectStatus, ProjectCategory } from "@prisma/client";

export interface PortfolioItemModel {
  id: string;
  name: string;
  clientName: string;
  clientLogoUrl: string | null;
  description: string;
  techTags: string[];
  liveUrl: string | null;
  images: string[];
  featured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationModel {
  id: string;
  documentNumber?: string | null;
  documentType: string;
  title?: string | null;
  subtitle?: string | null;
  clientLocation?: string | null;
  scopeSummary?: string | null;
  tableTitle?: string | null;
  taxLabel?: string | null;
  depositPercentage: number;
  amountDueToStart?: number | null;
  depositNote?: string | null;
  depositBadge?: string | null;
  timelineTitle?: string | null;
  timelinePhases?: unknown;
  paymentTerms: string[];
  included: string[];
  excluded: string[];
  closingNote?: string | null;
  projectRequestId: string;
  lineItems: unknown;
  subtotal: number;
  tax: number;
  total: number;
  validUntil: Date;
  notes?: string | null;
  pdfUrl?: string | null;
  sentAt?: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectRequestModel {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  title: string;
  description: string;
  category: ProjectCategory;
  budget?: number | null;
  timeline?: string | null;
  attachmentUrl?: string | null;
  status: ProjectStatus;
  adminNote?: string | null;
  quotedPrice?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ExtendedPrismaClient = PrismaClient & {
  portfolioItem: {
    findMany: (args?: { where?: Record<string, unknown>; orderBy?: Record<string, unknown>; take?: number }) => Promise<PortfolioItemModel[]>;
    findUnique: (args: { where: { id: string } }) => Promise<PortfolioItemModel | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<PortfolioItemModel>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<PortfolioItemModel>;
    delete: (args: { where: { id: string } }) => Promise<PortfolioItemModel>;
  };
  quotation: {
    findMany: (args?: { where?: Record<string, unknown>; select?: Record<string, unknown>; orderBy?: Record<string, unknown>; take?: number }) => Promise<QuotationModel[]>;
    findUnique: (args: { where: { projectRequestId?: string; id?: string }; select?: Record<string, unknown> }) => Promise<QuotationModel | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<QuotationModel>;
    update: (args: { where: { id?: string; projectRequestId?: string }; data: Record<string, unknown> }) => Promise<QuotationModel>;
    upsert: (args: {
      where: { projectRequestId: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => Promise<QuotationModel>;
  };
};

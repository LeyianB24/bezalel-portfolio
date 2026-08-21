import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiAdminPermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export interface StudioNotificationItem {
  id: string;
  type: "PROJECT" | "MESSAGE" | "ORDER" | "CAREER";
  title: string;
  subtitle: string;
  details?: string;
  timestamp: string;
  isUnread: boolean;
  statusBadge: string;
  actionUrl: string;
}

export async function GET() {
  const { errorResponse } = await verifyApiAdminPermission();
  if (errorResponse) return errorResponse;

  try {
    const [projectRequests, contactMessages, orders, jobApplications] =
      await Promise.all([
        prisma.projectRequest.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            title: true,
            name: true,
            category: true,
            budget: true,
            status: true,
            createdAt: true,
          },
        }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            name: true,
            email: true,
            subject: true,
            message: true,
            status: true,
            createdAt: true,
          },
        }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            name: true,
            email: true,
            total: true,
            status: true,
            paymentMethod: true,
            createdAt: true,
          },
        }),
        prisma.jobApplication.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            job: {
              select: {
                title: true,
              },
            },
          },
        }),
      ]);

    const notifications: StudioNotificationItem[] = [];

    // Project briefs
    projectRequests.forEach((pr) => {
      const isUnread = pr.status === "NEW" || pr.status === "IN_REVIEW";
      notifications.push({
        id: `pr-${pr.id}`,
        type: "PROJECT",
        title: `Project Brief: ${pr.title}`,
        subtitle: `From ${pr.name} • ${pr.category.replace(/_/g, " ")}`,
        details: pr.budget ? `Est. Budget: KES ${pr.budget.toLocaleString()}` : "Scope discussion required",
        timestamp: pr.createdAt.toISOString(),
        isUnread,
        statusBadge: pr.status,
        actionUrl: `/studio/projects`,
      });
    });

    // Contact messages
    contactMessages.forEach((msg) => {
      const isUnread = msg.status === "UNREAD";
      notifications.push({
        id: `msg-${msg.id}`,
        type: "MESSAGE",
        title: `Inquiry: ${msg.subject || "Direct Message"}`,
        subtitle: `From ${msg.name} (${msg.email})`,
        details: msg.message.slice(0, 80) + (msg.message.length > 80 ? "..." : ""),
        timestamp: msg.createdAt.toISOString(),
        isUnread,
        statusBadge: msg.status,
        actionUrl: `/studio/messages`,
      });
    });

    // Orders
    orders.forEach((ord) => {
      const isUnread = ord.status === "PENDING" || ord.status === "PAYMENT_PENDING";
      notifications.push({
        id: `ord-${ord.id}`,
        type: "ORDER",
        title: `Order #${ord.id.slice(-6).toUpperCase()}`,
        subtitle: `Customer: ${ord.name} • ${ord.paymentMethod}`,
        details: `Total: KES ${ord.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        timestamp: ord.createdAt.toISOString(),
        isUnread,
        statusBadge: ord.status,
        actionUrl: `/studio/store`,
      });
    });

    // Job applications
    jobApplications.forEach((app) => {
      const isUnread = app.status === "PENDING";
      notifications.push({
        id: `app-${app.id}`,
        type: "CAREER",
        title: `Application: ${app.job?.title || "Engineering Role"}`,
        subtitle: `Candidate: ${app.name} (${app.email})`,
        details: `Status: ${app.status}`,
        timestamp: app.createdAt.toISOString(),
        isUnread,
        statusBadge: app.status,
        actionUrl: `/studio/careers`,
      });
    });

    // Sort chronologically (most recent first)
    notifications.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const unreadCount = notifications.filter((n) => n.isUnread).length;

    return NextResponse.json({
      notifications,
      unreadCount,
      summary: {
        projectsUnread: projectRequests.filter((p) => p.status === "NEW" || p.status === "IN_REVIEW").length,
        messagesUnread: contactMessages.filter((m) => m.status === "UNREAD").length,
        ordersUnread: orders.filter((o) => o.status === "PENDING" || o.status === "PAYMENT_PENDING").length,
        applicationsUnread: jobApplications.filter((a) => a.status === "PENDING").length,
      },
    });
  } catch (error) {
    console.error("Error fetching studio notifications:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notifications" },
      { status: 500 }
    );
  }
}

// Mark items as read / acknowledged
export async function PATCH(req: NextRequest) {
  const { errorResponse } = await verifyApiAdminPermission();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { action, id, type } = body;

    if (action === "MARK_ALL_MESSAGES_READ") {
      await prisma.contactMessage.updateMany({
        where: { status: "UNREAD" },
        data: { status: "READ" },
      });
      return NextResponse.json({ success: true, message: "All messages marked as read." });
    }

    if (action === "MARK_ITEM_READ" && id && type) {
      if (type === "MESSAGE") {
        const rawId = id.replace(/^msg-/, "");
        await prisma.contactMessage.update({
          where: { id: rawId },
          data: { status: "READ" },
        });
      } else if (type === "PROJECT") {
        const rawId = id.replace(/^pr-/, "");
        await prisma.projectRequest.update({
          where: { id: rawId },
          data: { status: "IN_REVIEW" },
        });
      } else if (type === "CAREER") {
        const rawId = id.replace(/^app-/, "");
        await prisma.jobApplication.update({
          where: { id: rawId },
          data: { status: "REVIEWED" },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notification status:", error);
    return NextResponse.json(
      { error: "Failed to update notification state" },
      { status: 500 }
    );
  }
}

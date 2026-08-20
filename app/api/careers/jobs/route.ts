import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { JobType } from "@prisma/client";

const jobCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  type: z.nativeEnum(JobType),
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string()).default([]),
  isOpen: z.boolean().default(true),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    let jobs;
    if (showAll) {
      const { errorResponse } = await verifyApiAdminPermission("CAREERS");
      if (errorResponse) return errorResponse;

      jobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      jobs = await prisma.job.findMany({
        where: { isOpen: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("❌ GET jobs error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("CAREERS");
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const parsedData = jobCreateSchema.parse(body);

    const newJob = await prisma.job.create({
      data: parsedData,
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("❌ POST job error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

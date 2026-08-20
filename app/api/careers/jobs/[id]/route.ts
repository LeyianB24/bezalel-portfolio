import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { JobType } from "@prisma/client";

const jobUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  type: z.nativeEnum(JobType).optional(),
  description: z.string().min(1).optional(),
  requirements: z.array(z.string()).optional(),
  isOpen: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("CAREERS");
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const parsedData = jobUpdateSchema.parse(body);

    const updatedJob = await prisma.job.update({
      where: { id },
      data: parsedData,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("❌ PATCH job error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

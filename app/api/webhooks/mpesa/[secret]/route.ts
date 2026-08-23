import { handleMpesaCallback } from "../route";

export async function POST(
  req: Request,
  context: { params: Promise<{ secret: string }> | { secret: string } }
) {
  const params = await context.params;
  return handleMpesaCallback(req, params?.secret);
}

export const dynamic = "force-dynamic";

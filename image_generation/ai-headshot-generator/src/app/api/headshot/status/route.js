import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, DEFAULT_USER } from "@/lib/auth";
import { AIService } from "@/lib/services/ai";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || DEFAULT_USER.id;

    const body = await req.json();
    const requestId = body.requestId || body.request_id;
    const metadata = body.metadata;

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
    }

    const result = await AIService.checkStatus(requestId, userId, metadata);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI_HEADSHOT_STATUS]", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}

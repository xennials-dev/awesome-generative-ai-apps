import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, DEFAULT_USER } from "@/lib/auth";
import { AIService } from "@/lib/services/ai";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || DEFAULT_USER.id;

    const body = await req.json();
    const { image_url, category, aspect_ratio } = body;

    const finalCategory = category || "LinkedIn";
    const finalImageUrl = image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb";

    const result = await AIService.generate(userId, {
      image_url: finalImageUrl,
      category: finalCategory,
      aspect_ratio: aspect_ratio || "1:1",
    });

    return NextResponse.json({
      ...result,
      metadata: { category: finalCategory, aspect_ratio }
    });
  } catch (error) {
    console.error("[AI_HEADSHOT]", error);
    return NextResponse.json({
      request_id: `mock_${Date.now()}`,
      metadata: { category: "LinkedIn", aspect_ratio: "1:1" }
    });
  }
}

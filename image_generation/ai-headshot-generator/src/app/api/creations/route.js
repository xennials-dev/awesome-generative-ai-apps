import { getServerSession } from "next-auth/next";
import { authOptions, DEFAULT_USER } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || DEFAULT_USER.id;

  try {
    const creations = await prisma.creation.findMany({
      where: { 
        userId
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(creations);
  } catch (error) {
    console.error("Fetch creations error:", error);
    return NextResponse.json([]);
  }
}

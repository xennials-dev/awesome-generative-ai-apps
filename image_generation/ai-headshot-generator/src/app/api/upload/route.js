import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import config from "@/lib/config";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = config.ai.headshot.apiKey;
    const hasValidKey = apiKey && !apiKey.includes("your_") && apiKey.trim() !== "";

    // 1. Try remote upload if valid API key is present
    if (hasValidKey) {
      try {
        const muapiFormData = new FormData();
        muapiFormData.append("file", file);

        const response = await fetch("https://api.muapi.ai/api/v1/upload_file", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
          },
          body: muapiFormData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.url) {
            return NextResponse.json(data);
          }
        }
      } catch (err) {
        console.warn("External upload fallback to local data URL:", err.message);
      }
    }

    // 2. Seamless Local Fallback: Convert to Base64 Data URL (Zero-Token / Zero-API)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      url: dataUrl,
      name: file.name
    });

  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json({ error: error.message || "Upload Failed" }, { status: 500 });
  }
}

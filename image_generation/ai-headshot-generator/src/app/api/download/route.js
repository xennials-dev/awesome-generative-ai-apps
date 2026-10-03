import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "ai-headshot-portrait.jpg";

    if (!url) {
      return NextResponse.json({ error: "Missing image url" }, { status: 400 });
    }

    // If data URL, parse base64
    if (url.startsWith("data:")) {
      const [header, base64Data] = url.split(",");
      const mimeMatch = header.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const buffer = Buffer.from(base64Data, "base64");

      return new Response(buffer, {
        headers: {
          "Content-Type": mime,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // Try fetching the remote image server-side
    let imageBuffer = null;
    let contentType = "image/jpeg";

    try {
      const remoteRes = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (remoteRes.ok) {
        const arrayBuf = await remoteRes.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuf);
        contentType = remoteRes.headers.get("content-type") || "image/jpeg";
      }
    } catch (e) {
      console.warn("[DOWNLOAD_PROXY_FETCH_ERROR]", e.message);
    }

    // If remote image failed or gave 403, generate a clean SVG portrait placeholder
    if (!imageBuffer) {
      const svg = `
        <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#111827"/>
              <stop offset="50%" stop-color="#1e1b4b"/>
              <stop offset="100%" stop-color="#312e81"/>
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#818cf8"/>
              <stop offset="100%" stop-color="#c084fc"/>
            </linearGradient>
          </defs>
          <rect width="800" height="800" fill="url(#bg)"/>
          <circle cx="400" cy="340" r="140" fill="url(#accent)" opacity="0.8"/>
          <path d="M220 620 C220 500, 300 460, 400 460 C500 460, 580 500, 580 620 Z" fill="url(#accent)" opacity="0.8"/>
          <text x="400" y="680" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">AI Headshot Portrait</text>
          <text x="400" y="720" font-family="system-ui, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Generated in Sandbox Mode</text>
        </svg>
      `;
      imageBuffer = Buffer.from(svg.trim(), "utf-8");
      contentType = "image/svg+xml";
    }

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": imageBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("[DOWNLOAD_PROXY_ERROR]", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

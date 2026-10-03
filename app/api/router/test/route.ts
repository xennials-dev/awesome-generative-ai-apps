import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { baseUrl, apiKey, model } = await req.json();

    if (!baseUrl) {
      return NextResponse.json({ success: false, error: 'baseUrl is required' }, { status: 400 });
    }

    const startTime = Date.now();
    const endpoint = baseUrl.endsWith('/') ? `${baseUrl}chat/completions` : `${baseUrl}/chat/completions`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const payload = {
      model: model || 'default',
      messages: [
        { role: 'system', content: 'You are a test ping responder. Reply in under 5 words.' },
        { role: 'user', content: 'Ping' }
      ],
      max_tokens: 15,
      temperature: 0.1
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const latency = Date.now() - startTime;

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      return NextResponse.json({
        success: false,
        latency,
        status: res.status,
        error: `Endpoint returned HTTP ${res.status}: ${errText.slice(0, 200)}`
      });
    }

    const data = await res.json().catch(() => ({}));
    const reply = data.choices?.[0]?.message?.content || 'Pong (OK)';

    return NextResponse.json({
      success: true,
      latency,
      reply,
      endpoint
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.name === 'AbortError' ? 'Connection timed out after 6 seconds' : err.message
    });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { UploadPostService } from '@/app/lib/upload-post';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, platforms, language = 'English', apiKey } = body;

    const service = new UploadPostService(apiKey);
    const result = await service.analyzeShorts({
      videoUrl,
      platforms,
      language
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API_SOCIAL_ANALYZE_ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to analyze short-form content' },
      { status: 500 }
    );
  }
}

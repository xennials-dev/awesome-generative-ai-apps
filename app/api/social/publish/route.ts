import { NextRequest, NextResponse } from 'next/server';
import { UploadPostService, PublishRequest } from '@/app/lib/upload-post';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      platforms,
      user = 'guest-creator',
      title,
      content,
      mediaUrl,
      mediaType = 'text',
      scheduleDate,
      apiKey
    } = body;

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one social platform must be selected' },
        { status: 400 }
      );
    }

    if (!content && !mediaUrl) {
      return NextResponse.json(
        { success: false, error: 'Content text or mediaUrl is required to publish' },
        { status: 400 }
      );
    }

    const service = new UploadPostService(apiKey);
    const publishPayload: PublishRequest = {
      platforms,
      user,
      title,
      content,
      mediaUrl,
      mediaType,
      scheduleDate
    };

    const result = await service.publish(publishPayload);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API_SOCIAL_PUBLISH_ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while publishing' },
      { status: 500 }
    );
  }
}

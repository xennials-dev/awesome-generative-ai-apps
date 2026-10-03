import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKeyConfigured = Boolean(process.env.UPLOAD_POST_API_KEY);

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      color: '#00f2fe',
      bgColor: 'rgba(0, 242, 254, 0.1)',
      mediaTypes: ['video', 'photo'],
      maxChars: 2200,
      supportsScheduling: true,
      icon: 'music'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: '#e1306c',
      bgColor: 'rgba(225, 48, 108, 0.1)',
      mediaTypes: ['video', 'photo'],
      maxChars: 2200,
      supportsScheduling: true,
      icon: 'instagram'
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      color: '#ff0000',
      bgColor: 'rgba(255, 0, 0, 0.1)',
      mediaTypes: ['video'],
      maxChars: 5000,
      supportsScheduling: true,
      icon: 'youtube'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      color: '#1da1f2',
      bgColor: 'rgba(29, 161, 242, 0.1)',
      mediaTypes: ['text', 'photo', 'video'],
      maxChars: 280,
      supportsScheduling: true,
      icon: 'twitter'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: '#0077b5',
      bgColor: 'rgba(0, 119, 181, 0.1)',
      mediaTypes: ['text', 'photo', 'video'],
      maxChars: 3000,
      supportsScheduling: true,
      icon: 'linkedin'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: '#1877f2',
      bgColor: 'rgba(24, 119, 242, 0.1)',
      mediaTypes: ['text', 'photo', 'video'],
      maxChars: 63206,
      supportsScheduling: true,
      icon: 'facebook'
    },
    {
      id: 'threads',
      name: 'Threads',
      color: '#ffffff',
      bgColor: 'rgba(255, 255, 255, 0.1)',
      mediaTypes: ['text', 'photo', 'video'],
      maxChars: 500,
      supportsScheduling: true,
      icon: 'at-sign'
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      color: '#bd081c',
      bgColor: 'rgba(189, 8, 28, 0.1)',
      mediaTypes: ['photo', 'video'],
      maxChars: 500,
      supportsScheduling: true,
      icon: 'pin'
    },
    {
      id: 'bluesky',
      name: 'Bluesky',
      color: '#0560ff',
      bgColor: 'rgba(5, 96, 255, 0.1)',
      mediaTypes: ['text', 'photo'],
      maxChars: 300,
      supportsScheduling: true,
      icon: 'cloud'
    },
    {
      id: 'google_business',
      name: 'Google Business',
      color: '#4285f4',
      bgColor: 'rgba(66, 133, 244, 0.1)',
      mediaTypes: ['text', 'photo'],
      maxChars: 1500,
      supportsScheduling: false,
      icon: 'map-pin'
    }
  ];

  return NextResponse.json({
    success: true,
    apiKeyConfigured,
    mode: apiKeyConfigured ? 'live-api' : 'sandbox-simulator',
    totalPlatforms: platforms.length,
    platforms
  });
}

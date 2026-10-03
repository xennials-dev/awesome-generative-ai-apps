# Autonomous Agent Guidelines & Social Distribution Directives

## 1. Zero-Barrier & Offline Operation
- Always preserve offline, zero-auth, and zero-payment functionality.
- The application and all sub-apps run locally with unlimited credits, offline SQLite/in-memory Prisma fallback, and local LM Studio (`http://127.0.0.1:1234/v1`) support.

## 2. Upload-Post Social Media Distribution
- All social media publishing, scheduling, AutoDMs, comments moderation, and audience analytics adhere to the Upload-Post unified API specification documented in `.agents/rules/upload_post_api.md`.
- Specialized distribution tasks should follow the `upload-post-workflow` skill and be handled by the `social_distribution_agent`.
- If `UPLOAD_POST_API_KEY` is not present, all endpoints (`/api/social/publish`, `/api/social/analyze`, `/api/social/platforms`) operate in realistic sandbox simulation mode.

## 3. Autonomous Content Adaptation
- The agent is empowered to autonomously analyze any source material (code repositories, blog articles, product releases, videos, or user briefs).
- When asked to publish or prepare content, autonomously synthesize platform-compliant copies for 12+ social networks (TikTok, Instagram, YouTube Shorts, X, LinkedIn, Facebook, Threads, Pinterest, Bluesky, Google Business), optimize hooks and character bounds, and trigger dispatch or scheduling.

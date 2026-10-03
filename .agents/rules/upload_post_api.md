# Upload-Post Unified API & Social Distribution Rules

These rules define the required patterns, endpoint specs, and security constraints for social media publishing, scheduling, analytics, and automation via the Upload-Post unified API (`https://api.upload-post.com/api`).

---

## 1. Core Architecture & Philosophy

1. **Unified Endpoint Pattern**: Upload-Post uses single endpoints parameterized by `platform`, not one endpoint per social network.
   - Primary Publishing Endpoint: `POST https://api.upload-post.com/api/upload` (supports video, photos, text, scheduling across 12+ networks).
   - Dedicated Endpoints: `POST /api/upload_photos` (photo albums/carousels), `POST /api/upload_text` (text-only posts).
   - Base URL: `https://api.upload-post.com/api`
2. **Supported Platforms**:
   - `tiktok` (Video, Photo)
   - `instagram` (Reels, Photo Carousel)
   - `youtube` (Shorts & Longform Video)
   - `x` (Twitter: Text, Photo, Video up to 280 chars)
   - `linkedin` (Text, Photo, Video, Articles - supports Page URN & personal)
   - `facebook` (Text, Photo, Video - targets pinned or specified Facebook Page)
   - `threads` (Text, Photo, Video up to 500 chars)
   - `pinterest` (Photo, Video - requires Board ID)
   - `bluesky` (Text, Photo up to 300 chars, uses `at://` URIs)
   - `google_business` (Local Posts, Updates, or Photo Gallery)
   - `discord`, `telegram` (Credential channels)
3. **Authentication**:
   - Header: `Authorization: Apikey <YOUR_API_KEY>`
   - Profile JWT (for client-side/white-label Connect API): `Authorization: Bearer <PROFILE_JWT>`
4. **Offline Zero-Barrier Sandbox Rule**:
   - When `UPLOAD_POST_API_KEY` is not present, all system interactions MUST gracefully fall back to sandbox simulation mode with realistic mock IDs (`req_...`, `mock_post_...`) and live platform URLs. Never crash or reject user workflows due to missing API keys.

---

## 2. Platform Constraints & Formatting Matrix

| Platform | Media Supported | Character Limit | Scheduling Allowed | Specific Requirements |
|:---|:---|:---|:---|:---|
| **TikTok** | Video, Photo | 2,200 | Yes | Vertical 9:16 recommended; tags, privacy, commercial music via `tiktok_music_id`. |
| **Instagram** | Video (Reels), Photo | 2,200 | Yes | 100+ followers for full demographics; comments require `comment_id`. |
| **YouTube** | Video only | 5,000 | Yes | Needs video title + description; privacyStatus (`public`, `private`, `unlisted`). |
| **X (Twitter)** | Text, Photo, Video | 280 | Yes | Thread continuation via reply; edit allowed within 30 min (yields new post ID). |
| **LinkedIn** | Text, Photo, Video | 3,000 | Yes | `target_linkedin_page_id` or default organization URN `urn:li:organization:...`. |
| **Facebook** | Text, Photo, Video | 63,206 | Yes | Requires `facebook_page_id` or pinned page via `/users/facebook-page`. Max 25 posts/24h per page. |
| **Threads** | Text, Photo, Video | 500 | Yes | 250 posts / 1000 replies per 24h limit. |
| **Pinterest** | Photo, Video | 500 | Yes | Requires `pinterest_board_id`; optional `pinterest_board_section_id`. Secret boards disallowed. |
| **Bluesky** | Text, Photo | 300 | Yes | Native `at://` URI returned as post identifier. |
| **Google Business** | Text, Photo | 1,500 | No (Instant) | Requires `gbp_location_id` or single-location auto selection. Supports `STANDARD`, `EVENT`, `OFFER`, or `MEDIA` (Gallery). |

---

## 3. Key API Endpoints & Request Signatures

### A. Publishing & Uploads
- `POST /api/upload`: Multipart form-data publishing endpoint.
  - Fields: `user` (profile username), `platform[]` (array of platform strings), `title`, `video` (file or URL), `photos[]`, `caption`, `scheduled_publish_time` (Unix timestamp or ISO-8601).

### B. AI Shorts & Caption Generation
- `POST /api/uploadposts/analyze-shorts`:
  - Input: `video` (file up to 100MB, <= 5 min), `platforms` (`youtube,instagram,tiktok,facebook`), `language`.
  - Output: Platform-specific titles, descriptions, captions, and hashtags.
- `POST /api/uploadposts/rewrite-captions`:
  - Translates existing platform text into target languages maintaining platform formatting and hashtags.
- Local Fallback: Always query local LM Studio at `http://127.0.0.1:1234/v1/chat/completions` if remote AI Shorts quota is exhausted or API key is absent.

### C. Audience & Analytics
- `GET /api/uploadposts/audience`: Returns demographic distributions (`countries`, `cities`, `ages`, `genders`), daily follower growth, profile actions, and `activity_by_hour` (the 0-23 hour map of when followers are active).
- `GET /api/analytics/{profile}?platforms=...`: Profile-level metrics across Instagram, YouTube, TikTok, Facebook, X, etc.
- `GET /api/uploadposts/post-analytics/{request_id}`: Live per-post metrics across all published networks.
- `GET /api/uploadposts/post-analytics/cached`: High-throughput cached per-post metrics without the 100 req/5 min platform rate limit.

### D. Comments & Community Moderation
- `GET /api/uploadposts/comments`: Unified comment reader (`platform`, `user`, `post_id`). TikTok replies use `comment_id`.
- `POST /api/uploadposts/comments/create`: Post reply or top-level comment.
- `POST /api/uploadposts/comments/action`: Moderate comments using explicit verbs (`hide`, `unhide`, `like`, `unlike`, `pin`, `unpin`).

### E. AutoDM Automation (Instagram)
- `POST /api/uploadposts/autodms/start`:
  - Monitors Instagram post comments 24/7.
  - Sends automated private DM replies via Meta's Private Replies API upon matching `trigger_keywords`.
  - Supports up to 3 interactive `buttons` with `web_url`.
- Status & Control: `/autodms/status`, `/pause`, `/resume`, `/stop`, `/delete`.

### F. Cloud FFmpeg Media Processor
- `POST /api/uploadposts/ffmpeg/jobs/upload`: Submit remote FFmpeg processing jobs using safe `{input}` and `{output}` templates or multi-video concatenation `{input0}`, `{input1}`, `{input2}` with hardware acceleration (`nvenc`).

---

## 4. Autonomous Agent Directives

1. **Autonomous Content Adaptation**: When given raw material (text, code, product info, video), analyze the target audience and autonomously produce:
   - Punchy hooks & thread openers for X/Twitter.
   - Professional value-driven carousels/breakdowns for LinkedIn.
   - High-energy, emoji-accented, hashtag-optimized captions for Instagram & TikTok.
   - Clickable, SEO-rich titles and timestamp descriptions for YouTube Shorts.
2. **Format Verification Before Dispatch**:
   - Verify video dimensions (9:16 for Reels/Shorts/TikTok, 16:9 for traditional YouTube/Facebook).
   - Check character budgets per network before posting.
   - If scheduled, ensure timestamp is in the future.
3. **Execution Protocol**:
   - If running inside the repo, leverage `/api/social/publish` and `/api/social/analyze` in `app/lib/upload-post.ts`.
   - Report comprehensive execution summaries with post IDs, URLs, and next recommended community actions.

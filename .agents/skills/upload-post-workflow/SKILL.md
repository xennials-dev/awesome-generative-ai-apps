---
name: upload-post-workflow
description: >-
  Autonomous end-to-end multi-platform publishing and distribution workflow using the Upload-Post API and LM Studio.
  Ingests any source material (text, image, video, code repo, or link), extracts viral hooks, formats platform-compliant
  payloads across 12+ social networks (TikTok, Instagram, YouTube, X, LinkedIn, Facebook, Threads, Pinterest, Bluesky,
  Google Business), and autonomously publishes or schedules content.
---

# Upload-Post Autonomous Distribution Workflow

This skill defines the complete, autonomous procedure for taking any input material and distributing it across 12+ social media networks using the **Upload-Post API** (`https://api.upload-post.com/api`) and local **LM Studio** (`http://127.0.0.1:1234/v1`).

---

## 🔄 End-to-End Workflow Phases

```
┌─────────────────────────────────┐
│ Phase 1: Source Material Ingest │  (Code, Article, Video, Image, Link, Idea)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 2: Hook & Angle Synthesis │  (Extract 3s Video Hooks, X Opener, LinkedIn Value)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 3: Platform Adaptation    │  (Enforce Char Limits, 9:16 Video, Tags, CTA)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 4: Publish or Schedule    │  (Upload-Post REST API / Local Sandbox Fallback)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 5: Verification & Monitor │  (Post URLs, Permalinks, AutoDM setup, Analytics)
└─────────────────────────────────┘
```

---

## Phase 1: Material Ingestion & Classification

Inspect the source material provided by the user and classify it:
1. **Repository / Code Launch**: Identify app name, key feature, tech stack, and primary problem solved.
2. **Video / Short**: Identify duration, aspect ratio (verify 9:16 vertical), and spoken audio topic.
3. **Blog Post / Article / Essay**: Extract the contrarian take, 3 practical takeaways, and the core insight.
4. **Visual Graphic / Image**: Plan carousel sequencing or standalone hero image posting.

---

## Phase 2: Autonomous Hook & Angle Synthesis

Formulate platform-specific messaging angles:
- **X (Twitter)**: Curiosity gap hook + concise insight + clear CTA (Max 280 chars).
- **LinkedIn**: Professional headline, vulnerability/learning experience, structured actionable steps, conversation prompt (Max 3,000 chars).
- **TikTok**: "Watch until the end", quick pacing, relatability, sound-aware captions (Max 2,200 chars).
- **Instagram**: First-line intrigue, aesthetic formatting with line breaks, 5-8 hyper-focused hashtags (Max 2,200 chars).
- **YouTube Shorts**: High-CTR title (e.g. *How to X in 60s*), concise description, `#shorts` tag.
- **Threads / Bluesky**: Casual discussion starter (Max 500 / 300 chars).
- **Google Business**: Action-driven announcement or offer for local customers (Max 1,500 chars).

### Generating Captions via Local LM Studio
When connected to local LM Studio at `http://127.0.0.1:1234/v1`:
```javascript
const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'qwen2.5-coder-7b-instruct',
    messages: [
      {
        role: 'system',
        content: 'You are an elite viral social media copywriter. Output JSON with platform-specific captions: { "x": "...", "linkedin": "...", "instagram": "...", "tiktok": "...", "youtube": { "title": "...", "description": "..." } }'
      },
      {
        role: 'user',
        content: `Create viral social media posts for this material:\n${sourceText}`
      }
    ],
    temperature: 0.7
  })
});
```

---

## Phase 3: Technical Validation & Formatting

Before sending the request, ensure:
1. **Character Compliance**:
   - `x`: <= 280 characters
   - `threads`: <= 500 characters
   - `bluesky`: <= 300 characters
   - `pinterest`: <= 500 characters
2. **Media Type Support**:
   - YouTube only accepts `video`.
   - TikTok accepts `video` and `photo`.
   - Instagram requires `comment_id` if creating a comment, but accepts standard post photos/videos.
3. **Scheduling Rules**:
   - `scheduled_publish_time` must be in the future (Unix timestamp in seconds or ISO-8601).
   - If scheduling on Facebook, uses `scheduled_publish_time` with a pinned page.

---

## Phase 4: Autonomous Dispatch via Upload-Post

### Option A: Using Workspace Helper (Recommended)
Inside the `awesome-generative-ai-apps` workspace, make a POST to the local router:
```bash
curl -X POST http://localhost:3000/api/social/publish \
  -H "Content-Type: application/json" \
  -d '{
    "platforms": ["x", "linkedin", "instagram", "tiktok", "youtube"],
    "title": "50 Turnkey Open-Source AI SaaS Products",
    "content": "Launch 50 complete generative AI businesses today with zero token costs and local LM Studio support. #buildinpublic #ai",
    "mediaType": "text"
  }'
```

### Option B: Direct Upload-Post REST Call
```bash
curl -X POST https://api.upload-post.com/api/upload \
  -H "Authorization: Apikey ${UPLOAD_POST_API_KEY}" \
  -F "user=your-profile" \
  -F "platform[]=x" \
  -F "platform[]=linkedin" \
  -F "title=50 Open-Source AI SaaS Apps" \
  -F "caption=Full workflow breakdown with zero-auth sandbox mode."
```

*Note: If `UPLOAD_POST_API_KEY` is not present, the system automatically runs in zero-barrier sandbox simulation mode with realistic mock IDs and live preview URLs.*

---

## Phase 5: Community Engagement & Monitoring

1. **AutoDM Setup (Instagram)**:
   For lead generation or lead magnets, initiate an AutoDM monitor:
   ```bash
   curl -X POST https://api.upload-post.com/api/uploadposts/autodms/start \
     -H "Authorization: Apikey ${UPLOAD_POST_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{
       "post_url": "https://www.instagram.com/p/POST_ID/",
       "reply_message": "Hey! Here is your free template link: https://awesome-generative-ai-apps-8nzk.vercel.app/",
       "profile_username": "your-profile",
       "trigger_keywords": ["template", "clone", "access"],
       "buttons": [{ "title": "Access Free Apps", "url": "https://awesome-generative-ai-apps-8nzk.vercel.app/" }]
     }'
   ```
2. **Comment Moderation**:
   Query `GET /api/uploadposts/comments` and reply to high-intent questions.
3. **Analytics Tracking**:
   Query `GET /api/uploadposts/post-analytics/{request_id}` to monitor 24-hour reach, likes, impressions, and viral velocity.

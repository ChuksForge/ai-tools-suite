# AI Tools Suite

> A production-grade, dual-product AI SaaS platform built on a shared LLM orchestration and infrastructure backbone. Two commercially viable products: an AI Content Engine and an AI Career Toolkit, ship from a single monorepo with isolated application boundaries, shared auth, billing, and database layers, and a prompt engineering system designed for auditability and scale.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.0-red)](https://turbo.build/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)](https://www.prisma.io/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-multi--model-orange)](https://openrouter.ai/)

---

## What This Is

AI Tools Suite is a full-stack, multi-tenant SaaS platform with two real products, real billing, real auth, and an AI layer built with typed workflows, versioned prompts, provider abstraction, usage enforcement, and domain-isolated data access.

---

## Business Impact & Metrics

### Product Scope

| Metric | Value |
|---|---|
| Products shipped | 2 (Content Engine + Career Toolkit) |
| AI workflows | 6 typed, tested, provider-agnostic workflows |
| Supported output platforms | 6 (Twitter/X, LinkedIn, Newsletter, TikTok, Instagram, Blog) |
| Billing tiers | Free + Pro (Paystack, NGN-native) |
| Auth system | Multi-tenant Supabase Auth with full SSR session management |
| Database models | 7 (User, Subscription, ContentJob, ContentHistory, Resume, CoverLetter, JobMatch) |
| Deployment targets | 2 Vercel projects, 1 Supabase instance, 1 OpenRouter gateway |
| Build time | ~4 weeks, 8 phases |

### Commercial Viability

**Content Engine — Market Context**
The global AI writing and content repurposing market is projected to exceed $1.8B by 2026. Content creators and marketers spend 3–5 hours per week manually reformatting content across platforms. The Content Engine reduces that to under 30 seconds per piece across 6 platforms simultaneously, a workflow compression of 30–60x.

**Career Toolkit — Market Context**
The online career services market exceeds $3B globally. Resume optimization, cover letter writing, and job fit analysis are consistently ranked the top three pain points by active job seekers. Competing tools charge separately for each. The Career Toolkit delivers all three in a single, integrated flow with a shared usage quota.

**Unit Economics (illustrative)**
```
Free tier:    10 content generations / 5 career actions per month
Pro tier:     ₦10,000/month (~$6.50 USD) — unlimited usage, both products

Break-even:   ~50 Pro subscribers (covers infrastructure)
500 subs:     ~$3,250 MRR
5,000 subs:   ~$32,500 MRR

AI cost per generation (gpt-4o-mini):    ~$0.002
AI cost per resume optimization (claude-sonnet): ~$0.015
Margin at Pro tier:                      >90% at 500+ subscribers
```

### Engineering Leverage Metrics

```
Shared packages across products:              6
Ratio of shared infra to product code:        ~60/40
Time to add a new AI workflow:                ~45 minutes
Time to add a new content platform:           ~20 minutes
Time to onboard a second app to auth/billing: ~2 hours
```

---

## Architecture

```
ai-tools-suite/
├── apps/
│   ├── content-engine/        # AI Content Repurposing SaaS (Next.js 16, App Router)
│   └── career-toolkit/        # Resume + Career Optimization SaaS (Next.js 16, App Router)
│
├── packages/
│   ├── ai/                    # LLM orchestration — prompts, workflows, provider factory
│   ├── ui/                    # Shared design system — components, layouts, theme
│   ├── db/                    # Prisma 7 — schema, typed client, domain query modules
│   ├── auth/                  # Supabase SSR — browser client, server client, middleware
│   ├── billing/               # Paystack REST wrapper, plan config, usage enforcement
│   └── utils/                 # Structured logger, typed error classes, shared constants
│
├── infrastructure/
│   ├── docker/
│   ├── scripts/
│   └── env/                   # Per-app environment templates
│
├── turbo.json                 # Pipeline: build → dev → lint → type-check
└── pnpm-workspace.yaml
```

### Core Design Principles

**App isolation over convenience.**
Zero cross-imports between `apps/content-engine` and `apps/career-toolkit`. All shared logic lives in packages. This makes the monorepo split-ready — extracting either app into its own repo is a mechanical operation, not an architectural one.

**All AI logic in `packages/ai`.**
No prompt strings in components, API routes, or service layers. Every LLM interaction is a named, typed workflow with validated inputs and structured outputs. The package is the system's most important design boundary, it's what makes the AI layer auditable, testable, and provider-agnostic.

**Thin API routes.**
Routes do exactly three things: authenticate, validate input (Zod), call a workflow. No business logic. This keeps routes shallow and AI behavior centralized.

**Domain-isolated data access.**
Query modules are organized by domain (`queries/shared/`, `queries/content/`, `queries/career/`) mirroring the schema's comment-bounded domain sections. Future schema splits require moving files, not rewriting queries.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 16, App Router | RSC for data-heavy pages, client components for AI output streaming |
| Monorepo | Turborepo + pnpm workspaces | Parallel builds, task caching, clean workspace dependency graph |
| Language | TypeScript 5.4 (strict) | End-to-end type safety: DB schema → workflow → API → UI |
| Database | PostgreSQL via Supabase | Managed Postgres with built-in Auth, no separate auth infrastructure |
| ORM | Prisma 7 + pg adapter | Type-safe queries, pgbouncer pooling, Prisma 7 config file pattern |
| Auth | Supabase Auth + `@supabase/ssr` | Cookie-based SSR sessions, works in Server Components and middleware |
| AI Gateway | OpenRouter | Single API key, multi-model access. Swap providers via env var, no code changes |
| LLM Models | GPT-4o-mini (fast) + Claude Sonnet (smart) | Tiered by task complexity; cheap models for drafts, capable models for analysis |
| Payments | Paystack | NGN-native, no USD conversion friction, clean REST API. No SDK needed |
| Validation | Zod | Runtime schema validation at API boundary, bad input never reaches AI |
| Styling | Tailwind CSS + CSS custom properties | Design token system in CSS variables. Dark mode, cross-package theming |
| Deployment | Vercel (2 projects, 1 repo) | Native Next.js, monorepo-aware build commands, preview environments |

---

## AI Package — System Design

The `packages/ai` package is the architectural core of the system. It is the only location in the codebase where LLMs are invoked.

```
packages/ai/
├── providers/
│   ├── openrouter.ts      # OpenAI-SDK client → OpenRouter base URL + headers
│   ├── models.ts          # MODELS.FAST / MODELS.SMART — env-configurable tiers
│   └── index.ts           # Provider factory — single import for all consumers
│
├── prompts/
│   ├── content/
│   │   ├── repurpose.ts   # Platform router — delegates to platform builders
│   │   ├── twitter.ts     # 3 tweet variants, hooks, hashtags
│   │   ├── linkedin.ts    # 150–300 word post with CTA
│   │   ├── newsletter.ts  # Subject line + structured body
│   │   ├── tiktok.ts      # Video scripts with hook/body/CTA/overlays
│   │   ├── instagram.ts   # Carousel + caption + hashtags + Reel concept
│   │   └── blog.ts        # SEO title + meta + slug + full markdown + tags
│   └── career/
│       ├── resume.ts      # STAR method rewrite + ATS optimization + scoring
│       ├── cover-letter.ts # Role-specific letter + email subject
│       └── job-match.ts   # Match score + strengths + gaps + keywords
│
├── workflows/
│   ├── content-workflow.ts   # runContentWorkflow — stream or structured JSON
│   └── resume-workflow.ts    # runResumeWorkflow, runCoverLetterWorkflow,
│                             # runJobMatchWorkflow
├── utils/
│   ├── formatter.ts       # parseAIJson, cleanAIText, truncateInput
│   └── validators.ts      # Zod schemas for all workflow inputs
│
└── types.ts               # AIResponse<T>, StreamChunk, AIRequest
```

### Workflow Contract

Every workflow exposes an identical async interface:

```typescript
async function runXWorkflow(
  input: ValidatedInput,
  options: { stream?: boolean; model?: string } = {}
): Promise<AIResponse>
```

```typescript
interface AIResponse<T = string> {
  data: T;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

Streaming returns the raw `AsyncIterable` from the OpenAI SDK. The API route reads chunks and forwards them via a `ReadableStream` response. Token usage is captured on every non-streaming call and available for cost tracking.

### Prompt Engineering Conventions

**JSON-only outputs.** Every prompt instructs the model to return valid JSON with no preamble, no markdown fences, no explanation text. The `parseAIJson` utility strips accidental fences before parsing. This makes outputs reliable across model providers and temperature settings.

**Parameterized prompt functions.** Each prompt file exports exactly one `build*Prompt(input): string` function. Prompts are functions, not template strings. This makes them unit-testable and independently refactorable.

**Model tiering by task complexity.** High-volume, short-output tasks use `MODELS.FAST`. Complex reasoning, long-context tasks use `MODELS.SMART`. Both constants are env-configurable. No hardcoded model strings in business logic.

**Input truncation before prompt construction.** All user inputs are bounded to a safe character limit before being injected into prompts. This caps token consumption regardless of what users paste.

```typescript
export function truncateInput(text: string, maxChars = 8000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[Content truncated]";
}
```

### Isolated Workflow Testing

```bash
cd packages/ai

pnpm test:content   # All 6 platforms — structured JSON + streaming
pnpm test:resume    # Resume optimization, cover letter, job match
```

Tests run against real OpenRouter endpoints and print full parsed output with token usage, making prompt iteration fast without a running app.

---

## Products

### AI Content Engine (`localhost:3000`)

Converts long-form content into platform-native formats across 6 channels with tone control, URL import, and streaming output.

**User flow:**
```
Paste text or import from URL → Select platform + tone → Generate (stream or JSON) → Copy output
```

**URL import** uses Cheerio to extract meaningful content from any public URL — stripping nav, footer, scripts, and ads before AI processing.

**Platform outputs:**

| Platform | Output |
|---|---|
| Twitter/X | 3 tweet variants ≤280 chars with hooks and hashtags |
| LinkedIn | 150–300 word post with scroll-stopping opener and CTA |
| Newsletter | Subject line + structured body with clear takeaway |
| TikTok | 3 video script: hook, body, CTA, on-screen overlays, music vibe |
| Instagram | Carousel slides + caption + 15 hashtags + Reel concept |
| Blog | SEO title + meta description + slug + full markdown body + topic tags |

**API routes:**
```
POST /api/generate          → AI generation (stream or JSON, rate limited)
POST /api/scrape            → URL content extraction
GET  /api/history           → Paginated job history
POST /api/billing/checkout  → Paystack transaction initialization
GET  /api/billing/verify    → Post-payment callback + subscription upgrade
POST /api/billing/webhook   → Paystack webhook (HMAC-SHA512 verified)
```

---

### AI Career Toolkit (`localhost:3001`)

Three AI-powered career tools sharing a monthly usage quota, with a unified activity feed and score tracking over time.

**Resume Optimizer**
Rewrites resume content using the STAR method, quantifies achievements, optimizes for ATS, and scores the original 0–100. Returns the optimized resume, score, specific improvements, and keyword suggestions.

**Cover Letter Generator**
Generates role and company-specific cover letters with an email subject line. The prompt is explicitly designed to avoid generic openers. The model leads with a specific, grounded hook drawn from the candidate's experience.

**Job Match Analyzer**
Scores resume-to-job-posting fit 0–100. Returns match score, strengths, identified skill gaps, missing keywords, and a 2–3 sentence strategic recommendation.

**API routes:**
```
POST /api/resume            → Resume optimization + scoring
POST /api/cover-letter      → Cover letter generation
POST /api/job-match         → Job fit analysis
GET  /api/history           → Aggregated activity (resumes + letters + matches)
POST /api/billing/checkout
GET  /api/billing/verify
POST /api/billing/webhook
```

---

## Database Design

### Schema

```prisma
// ═══════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════
model User         { id, email, createdAt, updatedAt }
model Subscription { id, userId, plan, status, paystackId }

// ═══════════════════════════════════════════
// CONTENT ENGINE
// ═══════════════════════════════════════════
model ContentJob     { id, userId, input, output(Json), platform, status }
model ContentHistory { id, contentJobId, version, snapshot(Json) }

// ═══════════════════════════════════════════
// CAREER TOOLKIT
// ═══════════════════════════════════════════
model Resume      { id, userId, raw, optimized, score }
model CoverLetter { id, userId, jobTitle, company, output }
model JobMatch    { id, userId, resumeId, jobPosting, matchScore, gaps(Json) }
```

**Key decisions:**
- User `id` is the Supabase Auth UUID — no synthetic key, no sync step required
- All FKs use `onDelete: Cascade` — user deletion is clean across all tables
- `output` and `gaps` are `Json` — AI response schemas can evolve without migrations
- Domain comment boundaries make future schema extraction straightforward

### Connection Strategy

```
App runtime:   DATABASE_URL → pgbouncer pooler (port 6543, ?pgbouncer=true)
CLI migrations: DIRECT_URL  → direct connection (port 5432)
```

Prisma 7 externalizes connection configuration to `prisma.config.ts` — the migration adapter and runtime client use separate connection strings, keeping serverless connection counts bounded.

---

## Auth

Supabase Auth with full SSR support — no client-only session state.

```
packages/auth/
├── client.ts      # createBrowserClient() — "use client" components
├── server.ts      # createServerClient() — Server Components + Route Handlers
└── middleware.ts  # updateSession() — session refresh on every request
```

The middleware excludes `/api/*` routes from redirect logic — API routes authenticate independently via `createServerClient` in the route handler body, keeping auth consistent without double-handling.

---

## Billing

Typed Paystack REST wrapper — no SDK dependency, no additional bundle.

```typescript
initializeTransaction({ email, amount, callbackUrl, metadata })
  → { authorization_url, reference }

verifyTransaction(reference)
  → { status, metadata, customer }
```

**Webhook verification** uses HMAC-SHA512 with the Paystack secret — unsigned webhooks are rejected at the route level before any DB writes occur.

**Usage enforcement** runs before every AI call:

```typescript
const usage = await checkUsageLimit(user.id, "content" | "career");
if (!usage.allowed) return 429; // no tokens consumed
```

Monthly counters reset on the first of each calendar month. Plan limits are checked against live DB counts — no cached state that can drift.

---

## Rate Limiting

Per-user, per-route in-memory rate limiter applied before auth and usage checks:

```typescript
checkRateLimit(`generate:${user.id}`, 20, 60_000) // 20 req/min
```

Designed as a Redis interface — the `Map` backing can be swapped for an Upstash Redis client without changing any call sites.

---

## Key Engineering Decisions

**OpenRouter as AI gateway over direct provider APIs**
A single API key with access to every major model. `MODELS.FAST` and `MODELS.SMART` are environment variables — switching from `gpt-4o-mini` to `gemini-flash` requires one env change and zero code deployment. Provider lock-in is eliminated at the infrastructure level.

**Prisma 7 pg adapter over Prisma Accelerate**
Accelerate introduces a paid intermediary and additional vendor dependency. The pg adapter with pgbouncer achieves equivalent connection pooling using infrastructure already in place — no extra cost, no additional point of failure.

**Supabase Auth UUID as User primary key**
Using a synthetic cuid as the DB primary key requires syncing it with the Auth UUID on every signup — a two-table lookup source of truth problem. Using the Auth UUID directly eliminates the sync step and keeps `userId` consistent across Auth and DB without any coordination logic.

**CSS custom properties over Tailwind package scanning**
Tailwind v4 with Turbopack does not reliably scan external workspace packages on Windows in development. CSS classes defined directly in `globals.css` are unconditionally present — no scanning, no purging edge cases, no behavior differences between development and production.

**Paystack over Stripe**
Stripe adds 3–5% FX overhead for NGN transactions and limited local bank support. Paystack is NGN-native, deeply integrated with Nigerian financial infrastructure, and has a clean enough REST API that no official SDK is required — keeping the billing package lightweight and auditable.

**In-memory rate limiter with Redis-compatible interface**
The rate limiter uses a `Map` in development. The function signature accepts any store with `get`/`set` semantics — upgrading to Upstash Redis in production is a one-file change with no call site modifications.

---

## Roadmap

- [ ] Platform-native output renderer — tweet cards, LinkedIn preview, blog markdown rendering
- [ ] Redis-backed rate limiting via Upstash — current in-memory resets on cold start
- [ ] Token cost tracking per user — usage logged to DB for billing insight and cost alerts
- [ ] PostHog analytics — funnel tracking from signup → first generation → upgrade
- [ ] Flutterwave as secondary payment provider — billing package is architected for drop-in addition
- [ ] Repo split — isolation boundaries enforced from day one, split is mechanical when warranted

---

## Project Stats

```
Shared packages:        6
Applications:           2
AI workflows:           6
Content platforms:      6
Database models:        7
API routes:             14 (7 per app)
Auth:                   SSR cookie-based (RSC + middleware compatible)
Payments:               Paystack (Flutterwave-ready)
Deployment:             2 Vercel projects · 1 Supabase instance · 1 OpenRouter gateway
Build system:           Turborepo with task caching and parallel execution
```

---

## MIT License.

---

## Built by ChuksForge AI Solutions Ltd

Production-grade AI agents, tools, and applications.

**Website:** [chuksforge.com](https://chuksforge.com)
**GitHub:** [@ChuksForge](https://github.com/ChuksForge) · **Email:** [hello@chuksforge.com](mailto:hello@chuksforge.com) **Telegram:** [@ChuksForge](https://t.me/ChuksForge)

---

## Working With Us

If you're building AI systems or want to integrate reliable LLM powered apps into your workflow, feel free to reach out.

We work on:
- LLM evaluation and reliability systems
- Multi-agent architectures
- AI-powered SaaS products
- AI-assisted developer tooling

---
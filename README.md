# Pebble
Pebble is a Next.js app that generates a “mascot worksheet” for a product brand: brand brief, mascot premise, voice/persona rules, sample in-product messages, and an image prompt (plus optional generated mascot image).

Today, the UI is demo-first: the homepage points to curated demo worksheets, while the full live generation pipeline is available through the backend API and test script.

## What the app does
- Takes a target company URL.
- Scrapes homepage + selected internal pages for brand signals and product evidence.
- Runs a multi-stage AI agent pipeline to generate mascot strategy artifacts.
- Scores output quality with a rubric and regenerates weak stages.
- Produces a worksheet-shaped result the UI can render.

UI output includes:
- Brand brief (company, positioning, palette, tone tags).
- Mascot specimen (name, archetype, role, annotations).
- Voice & persona rules (dos/don’ts + sample messages).
- Image prompt and in-product preview surfaces.

## How the agent works
Core entry point: `lib/agent/pipeline.ts`.

### 1) Scrape and evidence building
File: `lib/agent/scrape.ts`
- Normalizes URL and fetches the homepage.
- Extracts title/meta/h1/nav/copy, color hexes, and internal page snippets.
- Builds a `TargetEvidence` object (product surfaces, workflows, terminology, proof snippets, confidence).

### 2) Stage-by-stage generation
Files:
- `lib/agent/stages/01-brand-insight.ts`
- `lib/agent/stages/02-premise.ts`
- `lib/agent/stages/03-voice-rules.ts`
- `lib/agent/stages/04-sample-messages.ts`
- `lib/agent/stages/05-image-prompt.ts`

Each stage uses structured JSON prompting and is anchored to scraped evidence so output is target-specific.

### 3) Quality gate + regeneration loop
File: `lib/agent/gates/quality-rubric.ts`
- Scores specificity, POV, UX tie, memorability, and image renderability.
- Returns regeneration targets (`premise`, `voice`, `samples`, `imagePrompt`) if weak.

`lib/agent/pipeline.ts` applies:
- LLM rubric score.
- Additional local penalties for generic phrasing/archetypes.
- Up to 2 regeneration rounds.

### 4) Optional image generation
File: `lib/agent/image-gen.ts`
- If Cloudflare credentials are present, calls Flux Schnell and writes image files to `public/generated/*.png`.

### 5) Caching
File: `lib/agent/cache.ts`
- Caches full pipeline JSON in `lib/agent/cache/*.json` for 7 days.
- Reuses cached outputs and streams cached stage events when available.

## AI features and model behavior
File: `lib/agent/llm.ts`

Primary path:
- Groq chat completions (`llama-3.3-70b-versatile`) via `GROQ_API_KEY`.

Fallback path (only when Groq hits rate limits):
- NVIDIA (`meta/llama-3.3-70b-instruct`) if `NVIDIA_API_KEY` exists.
- Gemini (`gemini-2.5-flash`) if `GEMINI_API_KEY` exists.
- Cloudflare text model if `CF_ACCOUNT_ID` + `CF_API_TOKEN` exist.

Other AI features:
- Strict JSON response parsing/cleanup.
- Rate-limit handling + retries.
- Evidence contracts to reduce generic outputs.
- Stage streaming via Server-Sent Events (SSE).

## Current product behavior (important)
- Homepage (`/`) is currently in demo mode.
- Submitting the URL input does not trigger live backend generation.
- Users are routed to curated demos in `lib/demo-examples/index.ts` (e.g. `/basis-set`, `/reve`, `/shopify`, `/duolingo`).

Live generation still exists and can be run through:
- API route: `app/api/generate/route.ts`
- CLI test script: `scripts/test-pipeline.ts`

## Tech stack
- Next.js (App Router), React, TypeScript.
- Framer Motion for transitions.
- Cheerio for scraping/parsing.
- Zod for request/schema validation.
- Groq + optional Gemini/NVIDIA/Cloudflare integrations.

## Local setup
1. Install dependencies:
   - `pnpm install`
2. Create local env file:
   - `cp .env.example .env.local`
3. Add environment variables.

Minimum recommended env vars:
- `GROQ_API_KEY` (required for primary generation path)
- `GEMINI_API_KEY` (recommended fallback)

Optional env vars:
- `NVIDIA_API_KEY` (fallback provider)
- `CF_ACCOUNT_ID` and `CF_API_TOKEN` (text fallback + image generation)

## Run locally
- Development server: `pnpm dev`
- Build: `pnpm build`
- Production start: `pnpm start`
- Lint: `pnpm lint`

Open `http://localhost:3000` for the app.

## How to replicate generation
### A) Run the pipeline from CLI
- `pnpm test:pipeline notion.so`

This prints stage progress to stderr and final JSON to stdout.

### B) Call the API endpoint directly (SSE)
Send a POST request to:
- `POST /api/generate`
- Body: `{ "url": "https://stripe.com" }`

The response streams events:
- `stage`
- `complete`
- `error`

## Key folders
- `app/` — routes and API endpoints.
- `components/pebble/` — worksheet UI and preview components.
- `lib/agent/` — live generation pipeline, prompts, gates, cache, image gen.
- `lib/demo-examples/` — curated worksheet demo payloads.
- `scripts/` — local pipeline test runner.

## Notes
- Generated cache files are ignored by git:
  - `lib/agent/cache/*.json`
  - `public/generated/*.png`
- To force a fresh run for a domain, remove its cache JSON and generated PNG.

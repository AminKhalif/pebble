import { readCachedResult, writeCachedResult } from "./cache"
import { generateMascotImage } from "./image-gen"
import { scrapeBrandSignals, type ScrapedBrandSignals } from "./scrape"
import { runBrandInsight } from "./stages/01-brand-insight"
import { runMascotPremise } from "./stages/02-premise"
import { runVoiceRules } from "./stages/03-voice-rules"
import { runSampleMessages } from "./stages/04-sample-messages"
import { runImagePrompt } from "./stages/05-image-prompt"
import { isAcceptable, runQualityRubric } from "./gates/quality-rubric"
import type {
  AgentStage,
  BrandInsight,
  ImagePromptSpec,
  MascotPremise,
  PipelineResult,
  RubricScore,
  SampleMessage,
  StageEvent,
  VoiceRules,
} from "./types"

type ProgressCallback = (event: StageEvent) => void | Promise<void>

function now() {
  return Date.now()
}

function event(stage: AgentStage, elapsed: number, preview?: string): StageEvent {
  return { stage, status: "complete", elapsed, preview }
}

async function timed<T>(
  timings: Record<string, number>,
  stageName: AgentStage,
  progress: ProgressCallback | undefined,
  preview: (value: T) => string | undefined,
  run: () => Promise<T>,
) {
  const start = now()
  const value = await run()
  const elapsed = now() - start
  timings[stageName] = elapsed
  await progress?.(event(stageName, elapsed, preview(value)))
  return value
}

function publicSignals(scraped: ScrapedBrandSignals) {
  const { palette: _palette, ...signals } = scraped
  return signals
}

function scoreOnly(score: RubricScore): RubricScore {
  return {
    specificity: score.specificity,
    pointOfView: score.pointOfView,
    uxInsightTie: score.uxInsightTie,
    memorability: score.memorability,
    imageRenderability: score.imageRenderability,
    overall: score.overall,
    reasoning: score.reasoning,
  }
}

function ensurePalette(palette: string[]) {
  const fallback = ["#1A1814", "#FAF6EC", "#E8E1D1", "#C25A3D"]
  return [...new Set([...palette, ...fallback])].slice(0, 5)
}

function localRegenerationTargets({
  premise,
  voice,
  samples,
  imagePrompt,
}: {
  premise: MascotPremise
  voice: VoiceRules
  samples: SampleMessage[]
  imagePrompt: ImagePromptSpec
}) {
  const targets = new Set<"premise" | "voice" | "samples" | "imagePrompt">()
  const premiseText = `${premise.archetype} ${premise.oneSentenceDescription}`.toLowerCase()
  if (/\b(consultant|coach|assistant|copilot|guide|specialist|systems engineer)\b/.test(premiseText)) {
    targets.add("premise")
  }
  const sampleText = samples.map((sample) => sample.message).join(" ").toLowerCase()
  if (/\b(consider|you might|try|you can also|you could|get started|streamline|teams like yours|check out|feature|template|recommend)\b/.test(sampleText)) {
    targets.add("voice")
    targets.add("samples")
  }
  const voiceText = [...voice.vocabulary, ...voice.forbiddenWords, voice.toneInOneSentence].join(" ").toLowerCase()
  if (/\b(friendly|helpful|approachable|consider|streamline|teams like yours|you could|recommend)\b/.test(voiceText)) {
    targets.add("voice")
    targets.add("samples")
  }
  const imageText = `${imagePrompt.subject} ${imagePrompt.composedPrompt}`.toLowerCase()
  if (/\b(friendly rounded|rounded character|nice person|approachable face)\b/.test(imageText)) {
    targets.add("imagePrompt")
  }
  return targets
}

function applyLocalPenalties(
  score: Awaited<ReturnType<typeof runQualityRubric>>,
  output: {
    premise: MascotPremise
    voice: VoiceRules
    samples: SampleMessage[]
    imagePrompt: ImagePromptSpec
  },
) {
  const localTargets = localRegenerationTargets(output)
  if (localTargets.size === 0) return score
  const regenerate = [...new Set([...score.regenerate, ...localTargets])]
  return {
    ...score,
    specificity: Math.min(score.specificity, 2),
    pointOfView: Math.min(score.pointOfView, 2),
    overall: Math.min(score.overall, 2.8),
    reasoning: `${score.reasoning} Local quality gate rejected generic product-tip phrasing or archetypes.`,
    regenerate,
  }
}

async function streamCached(result: PipelineResult, progress?: ProgressCallback) {
  const stages: Array<[AgentStage, string | undefined]> = [
    ["visiting-homepage", result.signals.companyName],
    ["extracting-brand", result.signals.tagline],
    ["reading-positioning", result.insight.uxChallenge],
    ["finding-premise", result.premise.name],
    ["writing-voice", result.voice.toneInOneSentence],
    ["drafting-messages", result.samples[0]?.message],
    ["composing-image-prompt", result.imagePrompt.subject],
    ["reviewing-quality", `${result.rubric.overall}/5`],
    ["generating-image", result.imageUrl],
  ]
  for (const [stage, preview] of stages) {
    await progress?.({ stage, status: "cached", elapsed: 0, preview })
  }
}

export async function runAgentPipeline(rawUrl: string, progress?: ProgressCallback): Promise<PipelineResult> {
  const cached = await readCachedResult(rawUrl)
  if (cached) {
    await streamCached(cached, progress)
    return cached
  }

  const timings: Record<string, number> = {}
  const scraped = await timed(timings, "visiting-homepage", progress, (value) => value.companyName, () =>
    scrapeBrandSignals(rawUrl),
  )
  await progress?.(event("extracting-brand", 0, scraped.tagline))

  let insight: BrandInsight = await timed(
    timings,
    "reading-positioning",
    progress,
    (value) => value.uxChallenge,
    () => runBrandInsight(publicSignals(scraped)),
  )
  let premise: MascotPremise = await timed(
    timings,
    "finding-premise",
    progress,
    (value) => `${value.name}: ${value.archetype}`,
    () => runMascotPremise(insight),
  )
  let voice: VoiceRules = await timed(
    timings,
    "writing-voice",
    progress,
    (value) => value.toneInOneSentence,
    () => runVoiceRules(premise),
  )
  let samples: SampleMessage[] = await timed(
    timings,
    "drafting-messages",
    progress,
    (value) => value[0]?.message,
    () => runSampleMessages(premise, voice),
  )
  let imagePrompt: ImagePromptSpec = await timed(
    timings,
    "composing-image-prompt",
    progress,
    (value) => value.subject,
    () => runImagePrompt(premise, ensurePalette(scraped.palette)),
  )

  let regenerationCount = 0
  let rubric = await timed(timings, "reviewing-quality", progress, (value) => `${value.overall}/5`, async () =>
    applyLocalPenalties(await runQualityRubric({
      signals: publicSignals(scraped),
      insight,
      premise,
      voice,
      samples,
      imagePrompt,
    }), { premise, voice, samples, imagePrompt }),
  )

  while (!isAcceptable(rubric) && regenerationCount < 2) {
    regenerationCount += 1
    const targets = new Set(rubric.regenerate)
    if (targets.has("premise")) premise = await runMascotPremise(insight)
    if (targets.has("voice") || targets.has("premise")) voice = await runVoiceRules(premise)
    if (targets.has("samples") || targets.has("voice") || targets.has("premise")) {
      samples = await runSampleMessages(premise, voice)
    }
    if (targets.has("imagePrompt") || targets.has("premise")) {
      imagePrompt = await runImagePrompt(premise, ensurePalette(scraped.palette))
    }
    rubric = applyLocalPenalties(await runQualityRubric({
      signals: publicSignals(scraped),
      insight,
      premise,
      voice,
      samples,
      imagePrompt,
    }), { premise, voice, samples, imagePrompt })
    timings[`reviewing-quality-${regenerationCount}`] = 0
    await progress?.(event("reviewing-quality", 0, `${rubric.overall}/5 after round ${regenerationCount}`))
  }

  const imageUrl = await timed(
    timings,
    "generating-image",
    progress,
    (value) => value ?? "fallback svg",
    () => generateMascotImage(rawUrl, imagePrompt),
  )

  const result: PipelineResult = {
    signals: publicSignals(scraped),
    insight,
    premise,
    voice,
    samples,
    imagePrompt,
    imageUrl,
    rubric: scoreOnly(rubric),
    meta: {
      generatedAt: new Date().toISOString(),
      stageTimings: timings,
      regenerationCount,
    },
  }

  await writeCachedResult(rawUrl, result)
  return result
}

/*
Pipeline fixture outputs from `pnpm test:pipeline ...`:
{
  "notion.so": {
    "company": "Notion",
    "uxChallenge": "blank-canvas freedom plus AI automation setup complexity",
    "mascot": "Wren, a meticulous workflow cartographer",
    "sample": "Noticed a pattern and suggested modification to the 'Approve Request' block",
    "rubricOverall": 4.6,
    "regenerationCount": 1
  },
  "linear.app": {
    "company": "Linear - The System For Product Development",
    "uxChallenge": "triage load and prioritization drift from AI-generated suggestions",
    "mascot": "Kai, a seasoned air traffic controller for task flow",
    "sample": "I've flagged Task 456 for priority shift, route to John Doe",
    "rubricOverall": 4.6,
    "regenerationCount": 1
  },
  "stripe.com": {
    "company": "Stripe",
    "uxChallenge": "payments and financial-infrastructure setup complexity",
    "mascot": "Walter, a seasoned financial clerk",
    "sample": "Earlier you set up a test API key, this setting may cause issues with live transactions.",
    "rubricOverall": 4.6,
    "regenerationCount": 0
  }
}
*/

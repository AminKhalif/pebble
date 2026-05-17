import type { MockResult } from "./mock-data"
import { fetchImageBytes, normalizeUrl, scrapeTarget } from "./scrape"
import {
  brandAnalysisSchema,
  characterPromptSchema,
  inProductPreviewSchema,
  mascotSpecimenSchema,
  previewSurfacesSchema,
  voiceAndPersonaSchema,
  type BrandAnalysis,
  type MascotSpecimen,
  type PreviewSurfaces,
  type ScrapedFacts,
  type VoiceAndPersona,
} from "./schemas"
import { geminiStructured, groqStructured } from "./llm"

const specificity =
  "Every output field must reference the target's actual product, voice, or user. Do not generate generic mascot copy. Outputs must be specific enough that a reader could identify the target company from the output alone."

function pretty(input: unknown) {
  return JSON.stringify(input, null, 2)
}

function hostname(url: string) {
  return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "")
}

function colorName(hex: string, index: number) {
  const names = ["brand", "ink", "paper", "signal", "depth"]
  return names[index] ?? `color ${index + 1}`
}

function annotationLabels(mascot: MascotSpecimen, brand: BrandAnalysis) {
  return [
    { label: `${brand.companyName} ${mascot.speciesShape}`, target: "body" as const },
    { label: `${mascot.traits[0]} expression`, target: "eye" as const },
    { label: `accent: ${brand.palette[0]}`, target: "corner" as const },
    { label: `${mascot.disposition} posture`, target: "cheek" as const },
  ]
}

function mockKey(): MockResult["mascot"]["key"] {
  return "default"
}

function toResult(
  inputUrl: string,
  brand: BrandAnalysis,
  mascot: MascotSpecimen,
  voice: VoiceAndPersona,
  characterPrompt: { prompt: string },
  preview: { rewrittenHero: string; ctaText: string; mascotFirstMessage: string },
  surfaces: PreviewSurfaces,
): MockResult {
  return {
    company: {
      name: brand.companyName,
      url: hostname(inputUrl),
      category: brand.category,
      positioning: brand.tagline || brand.brandVoiceSummary,
      targetUser: brand.targetUser,
    },
    colors: brand.palette.map((hex, index) => ({ hex, name: colorName(hex, index) })),
    tags: brand.toneTags,
    mascot: {
      key: mockKey(),
      name: mascot.name,
      species: mascot.speciesShape,
      disposition: mascot.disposition,
      description: mascot.visualDescription,
      traits: mascot.traits,
      role: mascot.roleInsideProduct,
      annotations: annotationLabels(mascot, brand),
    },
    imagePrompt: characterPrompt.prompt,
    persona: {
      voice: voice.voice,
      appears: voice.appears,
      dos: voice.dos,
      donts: voice.donts,
      samples: voice.sampleMessages,
    },
    homepage: {
      hero: preview.rewrittenHero,
      sub: surfaces.sub,
      cta: preview.ctaText,
      features: surfaces.features,
    },
    tabMessages: {
      ...surfaces.tabMessages,
      homepage: preview.mascotFirstMessage,
    },
    previewSurfaces: {
      navItems: surfaces.navItems,
      onboardingSteps: surfaces.onboardingSteps,
      supportArticles: surfaces.supportArticles,
      activationChecklist: surfaces.activationChecklist,
      activationUnlockText: surfaces.activationUnlockText,
    },
  }
}

function rejectMockLeak(result: MockResult) {
  const text = JSON.stringify(result)
  const forbidden = [
    "Cmd K",
    "Vector",
    "This issue's been in review",
    "Your branch is ahead of main",
    "Plan in cycles. Ship in pull requests.",
  ]
  for (const phrase of forbidden) {
    if (text.includes(phrase)) throw new Error(`Generated worksheet leaked mock placeholder content: ${phrase}`)
  }
}

export async function analyzeBrand(scraped: ScrapedFacts, image?: { bytes: Uint8Array; mimeType: string } | null) {
  const prompt = `You are a brand strategist drafting a mascot proposal for the company at ${scraped.url}.

Relevant scraped facts:
${pretty(scraped)}

${specificity}

Return:
- companyName
- tagline
- category, e.g. "issue tracking for software teams"
- targetUser as 1 sentence
- toneTags, 4-6 single-word adjectives
- palette, 4-5 hex codes. Prefer scraped hex codes for fidelity. If scraping found a strong brand color, include that exact hex as-is. Do not round or alter colors.
- brandVoiceSummary, 1-2 sentences`

  return geminiStructured(prompt, brandAnalysisSchema, {
    imageBytes: image?.bytes,
    imageMimeType: image?.mimeType,
    urlContext: scraped.url,
  })
}

export async function createMascot(brand: BrandAnalysis) {
  const prompt = `You are a brand strategist drafting a mascot proposal for ${brand.companyName}.

Relevant input data:
${pretty(brand)}

${specificity}

Return a mascot specimen:
- name: a single proper noun. It must not be Vector, Pebble, Helper, Guide, Spark, or any generic placeholder.
- speciesShape: short phrase. Prefer abstract UI/brand shape language, not a literal animal or person unless the target brand already uses one.
- disposition: short phrase, 1-3 adjectives
- visualDescription: 2-3 sentences. Describe a simple Hallway-style product mascot that could be rendered as a flat vector mark; no backpacks, clothing, props, or busy scene details.
- traits: exactly 3 single-word adjectives
- roleInsideProduct: 1-2 sentences referencing ${brand.companyName}'s actual product features or surfaces.`

  return groqStructured(prompt, mascotSpecimenSchema)
}

export async function createVoice(brand: BrandAnalysis, mascot: MascotSpecimen) {
  const prompt = `You are a brand strategist drafting a mascot proposal for ${brand.companyName}.

Relevant input data:
${pretty({ brand, mascot })}

${specificity}

Return voice and persona:
- voice: 1 sentence describing how ${mascot.name} speaks
- appears: 1 sentence on the triggering moment in ${brand.companyName}'s product
- dos: exactly 3 short directives
- donts: exactly 3 short prohibitions
- sampleMessages: exactly 3 short utterances ${mascot.name} would actually say in ${brand.companyName}'s product context. Reference concrete product features, user actions, metrics, workflows, or named surfaces from ${brand.companyName}. Do not write generic encouragement.`

  return groqStructured(prompt, voiceAndPersonaSchema)
}

export async function createCharacterPrompt(brand: BrandAnalysis, mascot: MascotSpecimen) {
  const prompt = `You are a brand strategist drafting a mascot proposal for ${brand.companyName}.

Relevant input data:
${pretty({ palette: brand.palette, mascot })}

${specificity}

Return one multi-line image-generation prompt string with exactly these labeled fields:
subject: ...
shape: ...
palette: ${brand.palette.join(", ")}
features: ...
mood: ...
finish: ...
context: ...

Use the palette hex codes exactly as provided.`

  return groqStructured(prompt, characterPromptSchema)
}

export async function createInProductPreview(
  brand: BrandAnalysis,
  mascot: MascotSpecimen,
  voice: VoiceAndPersona,
) {
  const prompt = `You are a brand strategist drafting a mascot proposal for ${brand.companyName}.

Relevant input data:
${pretty({ brand, mascot, voice })}

${specificity}

Return:
- rewrittenHero: 1 sentence in ${brand.companyName}'s voice, slightly nudged toward what ${mascot.name} enables. Use ${brand.companyName} or product language by name.
- ctaText: short button copy in ${brand.companyName}'s voice, 2-4 words.
- mascotFirstMessage: what ${mascot.name} says when the page loads. It must use ${brand.companyName} or a real product feature/surface by name.`

  return groqStructured(prompt, inProductPreviewSchema)
}

export async function createPreviewSurfaces(
  brand: BrandAnalysis,
  mascot: MascotSpecimen,
  voice: VoiceAndPersona,
  preview: { rewrittenHero: string; ctaText: string; mascotFirstMessage: string },
) {
  const prompt = `You are a brand strategist drafting a mascot proposal for ${brand.companyName}.

Relevant input data:
${pretty({ brand, mascot, voice, preview })}

${specificity}

Return supporting in-product preview copy for Pebble's existing stylized browser-frame mock:
- sub: 1 sentence supporting the hero, mentioning ${mascot.name}
- navItems: exactly 4 lower-case navigation labels that fit ${brand.companyName}
- features: exactly 3 product feature cards with title and desc
- onboardingSteps: exactly 4 ${brand.companyName}-specific setup steps with done booleans
- supportArticles: exactly 4 help-center article titles specific to ${brand.companyName}
- activationChecklist: exactly 3 activation checklist items with done booleans
- activationUnlockText: short lower-case unlock text specific to ${brand.companyName}
- tabMessages: homepage, onboarding, support, activation messages from ${mascot.name}`

  return groqStructured(prompt, previewSurfacesSchema)
}

export async function generateWorksheet(rawUrl: string) {
  const scraped = await scrapeTarget(rawUrl)
  const image = await fetchImageBytes(scraped.logoUrl)
  const brand = await analyzeBrand(scraped, image)
  const mascot = await createMascot(brand)
  const voice = await createVoice(brand, mascot)
  const characterPrompt = await createCharacterPrompt(brand, mascot)
  const preview = await createInProductPreview(brand, mascot, voice)
  const surfaces = await createPreviewSurfaces(brand, mascot, voice, preview)
  const result = toResult(rawUrl, brand, mascot, voice, characterPrompt, preview, surfaces)
  rejectMockLeak(result)
  return result
}

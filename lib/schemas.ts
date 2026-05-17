import { z } from "zod"

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/)

export const scrapedFactsSchema = z.object({
  url: z.string(),
  logoUrl: z.string().nullable(),
  hexColors: z.array(hexColor),
  h1: z.string(),
  metaDescription: z.string(),
  bodyText: z.string(),
})

export const brandAnalysisSchema = z.object({
  companyName: z.string(),
  tagline: z.string(),
  category: z.string(),
  targetUser: z.string(),
  toneTags: z.array(z.string()).min(4).max(6),
  palette: z.array(hexColor).min(4).max(5),
  brandVoiceSummary: z.string(),
})

export const mascotSpecimenSchema = z.object({
  name: z.string(),
  speciesShape: z.string(),
  disposition: z.string(),
  visualDescription: z.string(),
  traits: z.array(z.string()).length(3),
  roleInsideProduct: z.string(),
})

export const voiceAndPersonaSchema = z.object({
  voice: z.string(),
  appears: z.string(),
  dos: z.array(z.string()).length(3),
  donts: z.array(z.string()).length(3),
  sampleMessages: z.array(z.string()).length(3),
})

export const characterPromptSchema = z.object({
  prompt: z.string(),
})

export const inProductPreviewSchema = z.object({
  rewrittenHero: z.string(),
  ctaText: z.string(),
  mascotFirstMessage: z.string(),
})

export const previewSurfacesSchema = z.object({
  sub: z.string(),
  navItems: z.array(z.string()).length(4),
  features: z.array(z.object({ title: z.string(), desc: z.string() })).length(3),
  onboardingSteps: z.array(z.object({ title: z.string(), done: z.boolean() })).length(4),
  supportArticles: z.array(z.string()).length(4),
  activationChecklist: z.array(z.object({ label: z.string(), done: z.boolean() })).length(3),
  activationUnlockText: z.string(),
  tabMessages: z.object({
    homepage: z.string(),
    onboarding: z.string(),
    support: z.string(),
    activation: z.string(),
  }),
})

export type ScrapedFacts = z.infer<typeof scrapedFactsSchema>
export type BrandAnalysis = z.infer<typeof brandAnalysisSchema>
export type MascotSpecimen = z.infer<typeof mascotSpecimenSchema>
export type VoiceAndPersona = z.infer<typeof voiceAndPersonaSchema>
export type CharacterPrompt = z.infer<typeof characterPromptSchema>
export type InProductPreview = z.infer<typeof inProductPreviewSchema>
export type PreviewSurfaces = z.infer<typeof previewSurfacesSchema>

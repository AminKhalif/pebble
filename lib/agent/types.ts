export type BrandSignals = {
  url: string
  companyName: string
  tagline: string
  rawCopy: string
  ogImage?: string
  category?: string
}

export type BrandInsight = {
  productJob: string
  uxChallenge: string
  audienceTension: string
  voiceOfBrand: string
}

export type MascotPremise = {
  name: string
  archetype: string
  oneSentenceDescription: string
  jobInProduct: string
  whatTheyDont: string
  appearanceCue: string
}

export type VoiceRules = {
  sentenceLength: string
  vocabulary: string[]
  forbiddenWords: string[]
  referencesTheyMake: string
  toneInOneSentence: string
}

export type SampleMessage = {
  trigger: string
  message: string
}

export type ImagePromptSpec = {
  subject: string
  setting: string
  artDirection: string
  palette: string[]
  mood: string
  composedPrompt: string
}

export type RubricScore = {
  specificity: number
  pointOfView: number
  uxInsightTie: number
  memorability: number
  imageRenderability: number
  overall: number
  reasoning: string
}

export type PipelineResult = {
  signals: BrandSignals
  insight: BrandInsight
  premise: MascotPremise
  voice: VoiceRules
  samples: SampleMessage[]
  imagePrompt: ImagePromptSpec
  imageUrl?: string
  rubric: RubricScore
  meta: {
    generatedAt: string
    stageTimings: Record<string, number>
    regenerationCount: number
  }
}

export type RubricResponse = RubricScore & {
  regenerate: Array<"premise" | "voice" | "samples" | "imagePrompt">
}

export type AgentStage =
  | "visiting-homepage"
  | "extracting-brand"
  | "reading-positioning"
  | "finding-premise"
  | "writing-voice"
  | "drafting-messages"
  | "composing-image-prompt"
  | "reviewing-quality"
  | "generating-image"
  | "complete"

export type StageEvent = {
  stage: AgentStage
  status: "start" | "complete" | "cached" | "error"
  elapsed: number
  preview?: string
}


import type { MockResult } from "@/lib/mock-data"
import type { PipelineResult } from "./types"

function colorName(index: number) {
  return ["brand", "ink", "paper", "signal", "depth"][index] ?? `color ${index + 1}`
}

function normalizeHexes(values: string[]) {
  const fallback = ["#1A1814", "#FAF6EC", "#E8E1D1", "#C25A3D"]
  return [...new Set([...values.filter((value) => /^#[0-9a-fA-F]{6}$/.test(value)), ...fallback])].slice(0, 5)
}

function tagsFromVoice(value: string) {
  return value
    .split(/[.,]/)
    .slice(0, 4)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
}

export function pipelineToWorksheet(result: PipelineResult): MockResult {
  const colors = normalizeHexes(result.imagePrompt.palette).map((hex, index) => ({
    hex,
    name: colorName(index),
  }))
  const firstMessage = result.samples[0]?.message ?? result.premise.appearanceCue
  const secondMessage = result.samples[1]?.message ?? result.premise.jobInProduct
  const thirdMessage = result.samples[2]?.message ?? result.premise.whatTheyDont

  return {
    company: {
      name: result.signals.companyName,
      url: new URL(result.signals.url).hostname.replace(/^www\./, ""),
      category: result.signals.category || result.insight.productJob,
      positioning: result.insight.uxChallenge,
      targetUser: result.insight.audienceTension,
    },
    colors,
    tags: tagsFromVoice(result.insight.voiceOfBrand),
    mascot: {
      key: "default",
      name: result.premise.name,
      species: result.premise.archetype,
      disposition: result.voice.toneInOneSentence,
      description: result.premise.oneSentenceDescription,
      traits: result.voice.vocabulary.slice(0, 3),
      role: result.premise.jobInProduct,
      annotations: [
        { label: result.premise.archetype, target: "body" },
        { label: result.premise.appearanceCue, target: "eye" },
        { label: `restraint: ${result.premise.whatTheyDont.slice(0, 60)}`, target: "corner" },
        { label: colors[0]?.hex ?? "#1A1814", target: "cheek" },
      ],
    },
    imagePrompt: result.imagePrompt.composedPrompt,
    imageUrl: result.imageUrl,
    agent: result,
    persona: {
      voice: result.voice.toneInOneSentence,
      appears: result.premise.appearanceCue,
      dos: [
        `Use ${result.voice.sentenceLength.toLowerCase()}`,
        `Reference ${result.voice.referencesTheyMake.toLowerCase()}`,
        result.premise.jobInProduct,
      ],
      donts: result.voice.forbiddenWords.slice(0, 3).map((word) => `never say "${word}"`),
      samples: result.samples.map((sample) => sample.message),
    },
    homepage: {
      hero: result.insight.productJob,
      sub: result.premise.oneSentenceDescription,
      cta: "Start here",
      features: result.samples.map((sample) => ({
        title: sample.trigger,
        desc: sample.message,
      })),
    },
    tabMessages: {
      homepage: firstMessage,
      onboarding: secondMessage,
      support: thirdMessage,
      activation: result.premise.whatTheyDont,
    },
    previewSurfaces: {
      navItems: ["product", "docs", "support", "settings"],
      onboardingSteps: result.samples.map((sample, index) => ({
        title: sample.trigger,
        done: index === 0,
      })),
      supportArticles: result.voice.vocabulary.slice(0, 4),
      activationChecklist: result.samples.map((sample, index) => ({
        label: sample.trigger,
        done: index < 2,
      })),
      activationUnlockText: result.premise.appearanceCue,
    },
  }
}


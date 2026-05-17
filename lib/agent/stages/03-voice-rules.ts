import { asJson, groqJson } from "../llm"
import { promptEvidence } from "../evidence"
import type { MascotPremise, TargetEvidence, VoiceRules } from "../types"

const system = `You write voice rules for product characters. A good voice rule is implementable by a content designer — it tells them exactly what the character does and doesn't do at the sentence level.

You DO NOT write "friendly, approachable, helpful." That's a personality test, not a rule.

Do not make the vocabulary sound like product onboarding copy. Avoid phrases like "consider using", "you might consider", "to streamline", "you can also", "based on your", "teams like yours", and "get started" unless the character archetype would naturally say them.

The voice rules must be grounded in the target's public voice and terminology. Vocabulary must include target-specific words or sentence moves from the evidence. Forbidden words should block off-brand generic SaaS copy and any terms the character should avoid.

Output strict JSON matching this shape:
{
  "sentenceLength": string,
  "vocabulary": [string, ...],
  "forbiddenWords": [string, ...],
  "referencesTheyMake": string,
  "toneInOneSentence": string
}

Failure conditions:
- vocabulary contains only generic adjectives.
- referencesTheyMake could fit any product.
- toneInOneSentence sounds like Pebble's house voice instead of the target.`

export async function runVoiceRules(premise: MascotPremise, evidence: TargetEvidence): Promise<VoiceRules> {
  return groqJson<VoiceRules>({
    system,
    user: `Target evidence:
${asJson(promptEvidence(evidence))}

Mascot premise:
${asJson(premise)}

Write the voice rules.`,
  })
}

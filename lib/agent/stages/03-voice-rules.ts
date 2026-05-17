import { asJson, groqJson } from "../llm"
import type { MascotPremise, VoiceRules } from "../types"

const system = `You write voice rules for product characters. A good voice rule is implementable by a content designer — it tells them exactly what the character does and doesn't do at the sentence level.

You DO NOT write "friendly, approachable, helpful." That's a personality test, not a rule.

Do not make the vocabulary sound like product onboarding copy. Avoid phrases like "consider using", "you might consider", "to streamline", "you can also", "based on your", "teams like yours", and "get started" unless the character archetype would naturally say them.

Output strict JSON matching this shape:
{
  "sentenceLength": string,
  "vocabulary": [string, ...],
  "forbiddenWords": [string, ...],
  "referencesTheyMake": string,
  "toneInOneSentence": string
}

GOOD example:
{
  "sentenceLength": "Average 8 words. Never more than 18. Often a single clause.",
  "vocabulary": ["I noticed", "you started", "want me to", "earlier you", "set aside"],
  "forbiddenWords": ["awesome", "let's", "supercharge", "amazing", "!", "🎉", "great question"],
  "referencesTheyMake": "Specific user behavior from the workspace — page titles, dates, unfinished docs. Never generic encouragement or product tips.",
  "toneInOneSentence": "A patient librarian who has read your whole workspace and is too polite to bring it up unprompted."
}

BAD example (do not produce):
{
  "sentenceLength": "Concise",
  "vocabulary": ["helpful", "friendly", "clear"],
  "forbiddenWords": ["unhelpful", "confusing"],
  "referencesTheyMake": "Relevant product features.",
  "toneInOneSentence": "Direct yet friendly, guiding users through the product."
}`

export async function runVoiceRules(premise: MascotPremise): Promise<VoiceRules> {
  return groqJson<VoiceRules>({
    system,
    user: `Mascot premise:
${asJson(premise)}

Write the voice rules.`,
  })
}

import { asJson, groqJson } from "../llm"
import { promptEvidence } from "../evidence"
import type { MascotPremise, SampleMessage, TargetEvidence, VoiceRules } from "../types"

const system = `You write sample messages for product characters. Each message is paired with a specific user state that triggers it. The messages demonstrate the voice rules — they reference specific user behavior, they don't generically encourage, and they respect the character's restraints.

Output strict JSON:
{
  "samples": [
    { "trigger": string, "message": string },
    { "trigger": string, "message": string },
    { "trigger": string, "message": string }
  ]
}

Rules:
- No product-tip phrasing: do not write "consider", "you might", "try", "you can also", "get started", "streamline", "teams like yours", or "check out".
- Each message must reference a concrete object/state from target evidence. Use the target's product nouns, surfaces, workflows, and terminology.
- Across the three messages, use the target company name or at least four target-specific terms from evidence.
- The message should sound like the character noticed something specific, not like the product is advertising a feature.
- Respect the premise's "whatTheyDont" literally.
- Mention product features by name when the trigger is a specific state inside that feature or surface.
- Do not write welcome messages, onboarding tours, or "I'll be your guide" copy. The character reacts to concrete state already visible in the target product.
- Do not use triggers like "New user", "User on dashboard", "User on demo day", or "User on startup directory". Name a specific artifact/state/event.

BAD example (do not produce):
{
  "samples": [
    {
      "trigger": "New user",
      "message": "Welcome! Want me to walk you through the product's powerful features?"
    },
    {
      "trigger": "User on dashboard",
      "message": "You've created 10 pages this week. Consider using the template gallery to standardize your workflow!"
    }
  ]
}`

export async function runSampleMessages(
  premise: MascotPremise,
  voiceRules: VoiceRules,
  evidence: TargetEvidence,
): Promise<SampleMessage[]> {
  const result = await groqJson<{ samples: SampleMessage[] }>({
    system,
    user: `Target evidence:
${asJson(promptEvidence(evidence))}

Mascot premise:
${asJson(premise)}

Voice rules:
${asJson(voiceRules)}

Write the three sample messages.`,
  })
  return result.samples
}

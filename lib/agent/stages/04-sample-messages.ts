import { asJson, groqJson } from "../llm"
import type { MascotPremise, SampleMessage, VoiceRules } from "../types"

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
- Each message must reference a concrete object/state: a file, page, invoice, failed payment, issue, branch, customer, dashboard, draft, date, or user action.
- The message should sound like the character noticed something specific, not like the product is advertising a feature.
- Respect the premise's "whatTheyDont" literally.
- Do not mention product features by name unless the trigger is a specific state inside that feature. Prefer "the March planning page" over "the template gallery"; prefer "invoice #1048 failed" over "billing tools".

GOOD example:
{
  "samples": [
    {
      "trigger": "User opens a new blank page and hasn't typed for 90 seconds.",
      "message": "You started a project doc last Thursday and didn't finish. Want me to pull it up beside this one?"
    },
    {
      "trigger": "User types in the command bar then deletes it.",
      "message": "Not sure what you're looking for. I can pull up anything you touched in the last week."
    },
    {
      "trigger": "User has been editing the same paragraph for 4 minutes.",
      "message": "You wrote something close to this in the planning doc from October. Worth a look."
    }
  ]
}

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
): Promise<SampleMessage[]> {
  const result = await groqJson<{ samples: SampleMessage[] }>({
    system,
    user: `Mascot premise:
${asJson(premise)}

Voice rules:
${asJson(voiceRules)}

Write the three sample messages.`,
  })
  return result.samples
}

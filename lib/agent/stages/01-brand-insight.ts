import { asJson, groqJson } from "../llm"
import { promptEvidence } from "../evidence"
import type { BrandInsight, BrandSignals, TargetEvidence } from "../types"

const system = `You are a senior product strategist who has shipped UX work at top consumer software companies. You analyze products by finding their core UX tension — the place where the product's design choices create friction for some users.

You DO NOT restate marketing copy. You DO NOT call products "innovative" or "intuitive." You find the specific moment where a real user struggles with the product, and you name it.

Do not overfit to a launch campaign, seasonal hero, or AI feature wrapper. Use the nav labels, product surfaces, and concrete nouns in the scraped copy to infer the durable product experience. If the homepage is promoting automation, AI, or a new feature, ask what core workflow that feature is trying to make less painful.

Use the target evidence. Name concrete product nouns, surfaces, audience, and workflows found there. If the evidence says YC, use YC language. If it says Stripe, use payments/API/dashboard language. Never replace target evidence with a generic SaaS diagnosis.

Output strict JSON matching this shape:
{
  "productJob": string,
  "uxChallenge": string,
  "audienceTension": string,
  "voiceOfBrand": string
}

Failure conditions:
- Generic adjectives like innovative, intuitive, helpful, calm, warm, useful, or efficient without target evidence.
- A productJob that could fit a competitor after swapping company names.
- A voiceOfBrand that describes Pebble's house style instead of the target's public voice.`

export async function runBrandInsight(signals: BrandSignals, evidence: TargetEvidence): Promise<BrandInsight> {
  return groqJson<BrandInsight>({
    system,
    user: `Company URL: ${signals.url}
Known signals:
${asJson({ companyName: signals.companyName, tagline: signals.tagline, category: signals.category })}

Scraped homepage content:
---
${signals.rawCopy}
---

Target evidence:
${asJson(promptEvidence(evidence))}

Find the UX challenge.`,
  })
}

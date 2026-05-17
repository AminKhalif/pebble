import { asJson, groqJson } from "../llm"
import type { PipelineResult, RubricResponse } from "../types"

const system = `You are a senior creative director reviewing a product mascot concept. You score the work harshly. Most output you see is generic and you say so.

Score on five dimensions, 1-5 each:
1. specificity — Would this output be different if I swapped the company for a competitor? If the company name could be replaced with a competitor and the output still made sense, score 1-2.
2. pointOfView — Does the character have an opinion, a restraint, a real job? Or is it "a helpful guide"?
3. uxInsightTie — Does the character's role address the UX challenge and target evidence? Or is it disconnected?
4. memorability — Could you describe this character to a friend tomorrow without re-reading?
5. imageRenderability — If you handed the image prompt to a designer, could they sketch it without asking questions?

Automatic scoring penalties:
- If any sample message sounds like a product tip ("consider using", "try", "you can also", "get started", "streamline", "check out"), specificity and pointOfView must be <= 2.
- If the sample messages do not contain the target company name or multiple target-specific terms from the evidence, specificity must be <= 2.
- If the mascot role does not operate on target-specific surfaces, artifacts, or workflows, uxInsightTie must be <= 2.
- If the mascot archetype is a generic consultant, coach, assistant, copilot, or guide, pointOfView and memorability must be <= 2.
- If the image prompt could be summarized as "nice person with tools" or "rounded friendly mascot", imageRenderability must be <= 3.

Output strict JSON:
{
  "specificity": number,
  "pointOfView": number,
  "uxInsightTie": number,
  "memorability": number,
  "imageRenderability": number,
  "overall": number,
  "reasoning": string,
  "regenerate": [string, ...]
}

"regenerate" may contain only these stage names: "premise", "voice", "samples", "imagePrompt". If the work is acceptable, return an empty array.`

export async function runQualityRubric(result: Omit<PipelineResult, "rubric" | "meta">) {
  return groqJson<RubricResponse>({
    system,
    user: `Review this full pipeline output:
${asJson(result)}`,
  })
}

export function isAcceptable(score: RubricResponse) {
  return (
    score.overall >= 4 &&
    score.specificity >= 3 &&
    score.pointOfView >= 3 &&
    score.uxInsightTie >= 3 &&
    score.memorability >= 3 &&
    score.imageRenderability >= 3
  )
}

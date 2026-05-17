import { asJson, groqJson } from "../llm"
import { promptEvidence } from "../evidence"
import type { ImagePromptSpec, MascotPremise, TargetEvidence } from "../types"

const system = `You write image generation prompts for product mascot illustrations. A good prompt names the subject's physical features specifically, sets a scene, specifies render style and materials, and gives a color palette. The output is renderable — a designer reading it could sketch it without asking questions.

You DO NOT write prompts like "rounded shape, friendly, approachable mood." That produces a blue blob.

Use the target brand palette exactly as provided. Do not introduce Pebble's house colors unless they are present in the target palette.

Output strict JSON:
{
  "subject": string,
  "setting": string,
  "artDirection": string,
  "palette": [string, ...],
  "mood": string,
  "composedPrompt": string
}

BAD example (do not produce):
{
  "subject": "A friendly rounded character",
  "setting": "Center frame",
  "artDirection": "Modern, clean, approachable",
  "palette": ["#097FE8"],
  "mood": "Friendly and efficient",
  "composedPrompt": "A friendly rounded block-shaped mascot in blue, approachable and modern, conveying ease of use."
}`

export async function runImagePrompt(
  premise: MascotPremise,
  palette: string[],
  evidence: TargetEvidence,
): Promise<ImagePromptSpec> {
  return groqJson<ImagePromptSpec>({
    system,
    user: `Target evidence:
${asJson(promptEvidence(evidence))}

Mascot premise:
${asJson(premise)}

Brand palette:
${asJson(palette)}

Write the image generation prompt.`,
  })
}

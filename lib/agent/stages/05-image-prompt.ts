import { asJson, groqJson } from "../llm"
import type { ImagePromptSpec, MascotPremise } from "../types"

const system = `You write image generation prompts for product mascot illustrations. A good prompt names the subject's physical features specifically, sets a scene, specifies render style and materials, and gives a color palette. The output is renderable — a designer reading it could sketch it without asking questions.

You DO NOT write prompts like "rounded shape, friendly, approachable mood." That produces a blue blob.

Output strict JSON:
{
  "subject": string,
  "setting": string,
  "artDirection": string,
  "palette": [string, ...],
  "mood": string,
  "composedPrompt": string
}

GOOD example:
{
  "subject": "A small character resembling a wise old tortoise with a soft round shell, wearing round wire-rim reading glasses and a knitted cardigan in muted gray. Seated cross-legged on a stack of paper documents, holding a small book.",
  "setting": "Three-quarter view, centered, transparent background.",
  "artDirection": "Soft 3D render, Pixar-lite, warm studio lighting from the upper left, matte surface with a slight subsurface scatter on the shell. Clean isometric framing.",
  "palette": ["#37352F", "#9B9A97", "#E9E5DC", "#F7F6F3", "#0D7BD6"],
  "mood": "Patient, observant, slightly weary. The eyes are doing most of the work.",
  "composedPrompt": "A small wise tortoise character with a soft round shell, round wire-rim reading glasses, knitted gray cardigan, seated cross-legged on a stack of paper documents, holding a small book. Three-quarter view, centered, transparent background. Soft 3D render, Pixar-lite style, warm studio lighting from upper left, matte surface with subtle subsurface scatter, clean isometric framing. Palette: warm grays #37352F #9B9A97 #E9E5DC #F7F6F3 with a single accent of #0D7BD6 on the book. Mood: patient, observant, slightly weary."
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
): Promise<ImagePromptSpec> {
  return groqJson<ImagePromptSpec>({
    system,
    user: `Mascot premise:
${asJson(premise)}

Brand palette:
${asJson(palette)}

Write the image generation prompt.`,
  })
}


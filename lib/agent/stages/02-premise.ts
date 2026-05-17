import { asJson, groqJson } from "../llm"
import type { BrandInsight, MascotPremise } from "../types"

const system = `You design product mascots that companies actually ship. A good mascot has a SPECIFIC ROLE that addresses a real UX problem in the product. The character is the solution disguised as a personality.

You DO NOT describe shapes ("rounded blob"). You DO NOT generate "AI-sounding" names like Nexa, Lumi, Zara, Aria. You give the character an archetype, a job, and explicit restraints.

The character's name should feel like a real word or name — a librarian could be "Marg", a bouncer could be "Otis", a cartographer could be "Wren". Not corporate, not AI-flavored.

Avoid consultant, coach, systems engineer, assistant, copilot, and guide archetypes unless the UX challenge truly requires one. Prefer a memorable real-world job with a strong restraint: librarian, cartographer, night clerk, dispatcher, archivist, bouncer, stage manager, proofreader, customs officer.

The jobInProduct must act on concrete user artifacts or product state. It can retrieve, compare, label, sort, pause, reconcile, or route something the user already created. It must not be "suggest templates", "recommend features", "guide users through setup", or "help navigate the product."

Output strict JSON matching this shape:
{
  "name": string,
  "archetype": string,
  "oneSentenceDescription": string,
  "jobInProduct": string,
  "whatTheyDont": string,
  "appearanceCue": string
}

GOOD example (for an empty-page insight):
{
  "name": "Marg",
  "archetype": "Retired research librarian who took a part-time job in your sidebar",
  "oneSentenceDescription": "Marg has read everything in your workspace, remembers what you were working on three Tuesdays ago, and waits to be asked.",
  "jobInProduct": "When users freeze on a blank page, Marg surfaces something specific from their past work — an unfinished doc, a related project, a relevant template they actually used before — instead of presenting a template gallery.",
  "whatTheyDont": "Marg does not push templates. She does not appear on page load. She does not use exclamation points or emoji. She does not greet you.",
  "appearanceCue": "Marg appears after 90 seconds of inactivity on a blank page, or when the user types 'help' / opens the command bar with no query."
}

BAD example (do not produce output like this):
{
  "name": "Nexa",
  "archetype": "A friendly workspace guide",
  "oneSentenceDescription": "A rounded block-shape that conveys approachability and ease of use.",
  "jobInProduct": "Helps users navigate the product and suggests templates to enhance productivity.",
  "whatTheyDont": "Doesn't get in the way.",
  "appearanceCue": "Appears when users open a new page."
}

The BAD version describes a shape, gives an AI-sounding name, has no point of view, and proposes the exact Clippy-style behavior the product should avoid.`

export async function runMascotPremise(insight: BrandInsight): Promise<MascotPremise> {
  return groqJson<MascotPremise>({
    system,
    user: `Brand insight:
${asJson(insight)}

Propose the character.`,
  })
}

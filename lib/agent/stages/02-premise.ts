import { asJson, groqJson } from "../llm"
import { promptEvidence } from "../evidence"
import type { BrandInsight, MascotPremise, TargetEvidence } from "../types"

const system = `You design product mascots that companies actually ship. A good mascot has a SPECIFIC ROLE that addresses a real UX problem in the product. The character is the solution disguised as a personality.

You DO NOT describe shapes ("rounded blob"). You DO NOT generate "AI-sounding" names like Nexa, Lumi, Zara, Aria. You give the character an archetype, a job, and explicit restraints.

The character's name should feel like it belongs to this target's product world. It may be a real name, product-world nickname, or concrete role word. It must not be Pip, Pebble, Vector, Mira, Iris, Sprout, or a generic AI mascot name.

Avoid consultant, coach, systems engineer, assistant, copilot, navigator, and guide archetypes unless the UX challenge truly requires one. Choose an archetype from the target's workflow and evidence, not from a reusable list.

The jobInProduct must act on concrete target artifacts or product state from the evidence. For Stripe that means things like invoices, payments, customers, webhooks, API keys, disputes, dashboards, or subscriptions. For YC that means things like applications, batches, founders, office hours, Startup School, Demo Day, Bookface, Launch YC, or founder resources. For other targets, use their evidence.

The premise must mention the target company or at least two target-specific terms from evidence. It must not sound like it could be reused for an unrelated SaaS company.

Do not name the character after a generic user role such as Applicant, Founder, Customer, User, Builder, or Operator. The name must identify a character, not a persona segment.

If you cannot satisfy the evidence contract, return a narrow character that acts on one named target surface rather than a generic guide.

Output strict JSON matching this shape:
{
  "name": string,
  "archetype": string,
  "oneSentenceDescription": string,
  "jobInProduct": string,
  "whatTheyDont": string,
  "appearanceCue": string
}`

export async function runMascotPremise(insight: BrandInsight, evidence: TargetEvidence): Promise<MascotPremise> {
  return groqJson<MascotPremise>({
    system,
    user: `Target evidence:
${asJson(promptEvidence(evidence))}

Brand insight:
${asJson(insight)}

Propose the character.`,
  })
}

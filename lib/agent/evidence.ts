import type { TargetEvidence } from "./types"

const weakTerms = new Set([
  "about",
  "companies",
  "find",
  "library",
  "newsletter",
  "open",
  "partners",
  "people",
  "resources",
  "safe",
])

function unique(values: string[]) {
  const seen = new Set<string>()
  return values
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function normalizeTerm(term: string, companyName: string) {
  const cleaned = term.replace(/\b(?:Title|Description|Navigation|Copy|Open menu)\b:?/gi, "").trim()
  if (cleaned.toLowerCase().startsWith(`${companyName.toLowerCase()} `)) {
    const withoutCompany = cleaned.slice(companyName.length).trim()
    return withoutCompany || companyName
  }
  return cleaned
}

export function promptEvidence(evidence: TargetEvidence) {
  const terms = unique([
    evidence.companyName,
    ...evidence.workflows,
    ...evidence.productSurfaces,
    ...evidence.terminology.map((term) => normalizeTerm(term, evidence.companyName)),
  ]).filter((term) => term.length > 2 && !weakTerms.has(term.toLowerCase()))

  const requiredTerms = terms.slice(0, 14)

  return {
    companyName: evidence.companyName,
    domain: evidence.domain,
    tagline: evidence.tagline,
    brandPalette: evidence.palette,
    productSurfaces: evidence.productSurfaces,
    workflows: evidence.workflows,
    requiredTerms,
    proofSnippets: evidence.proofSnippets,
    confidence: evidence.confidence,
    contract: [
      `Use "${evidence.companyName}" by name in the concept unless the field is only a short mascot name.`,
      "Use at least five requiredTerms across the premise, voice, and sample messages.",
      "Every sample trigger must be a concrete target product state, not 'New user' or 'User on dashboard'.",
      "Do not output a generic role name as the mascot name.",
      "Do not use Pebble mock names or house voice.",
    ],
  }
}

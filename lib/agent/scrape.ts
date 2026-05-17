import * as cheerio from "cheerio"
import type { BrandSignals, TargetEvidence } from "./types"

export type ScrapedBrandSignals = BrandSignals & {
  palette: string[]
  evidence: TargetEvidence
}

const hexRegex = /#[0-9a-fA-F]{6}\b/g
const MAX_INTERNAL_PAGES = 5
const commonWords = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "because",
  "been",
  "before",
  "build",
  "business",
  "can",
  "company",
  "customers",
  "data",
  "description",
  "for",
  "four",
  "from",
  "faq",
  "get",
  "has",
  "have",
  "help",
  "how",
  "into",
  "learn",
  "made",
  "make",
  "more",
  "navigation",
  "new",
  "not",
  "open",
  "our",
  "people",
  "product",
  "products",
  "see",
  "service",
  "software",
  "start",
  "that",
  "the",
  "their",
  "them",
  "this",
  "title",
  "through",
  "tools",
  "use",
  "users",
  "with",
  "work",
  "your",
])

export function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim()
  if (!trimmed) throw new Error("URL is required")
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function inferCompanyName(url: string, title: string, ogTitle: string) {
  const hostName = new URL(url).hostname.replace(/^www\./, "").split(".")[0] ?? "Company"
  const candidates = (ogTitle || title)
    .split(/[|—-]/)
    .map((part) => part.trim())
    .filter(Boolean)
  const titleName = candidates.find((part) => part.split(/\s+/).length <= 3) ?? candidates[0]
  const raw = titleName || hostName
  return raw.replace(/\b\w/g, (char) => char.toUpperCase())
}

function unique(values: string[]) {
  return [...new Set(values.map(cleanText).filter(Boolean))]
}

function pageSummary($: cheerio.CheerioAPI) {
  const title = cleanText($("title").first().text())
  const metaDescription = cleanText($("meta[name='description']").attr("content") ?? "")
  const ogTitle = cleanText($("meta[property='og:title']").attr("content") ?? "")
  const h1 = cleanText($("h1").first().text())
  const paragraphs = $("p")
    .slice(0, 3)
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean)
  return { title, metaDescription, ogTitle, h1, paragraphs }
}

function isLikelyProductLink(label: string, href: string) {
  const value = `${label} ${href}`.toLowerCase()
  return /\b(product|platform|solution|feature|customer|docs|pricing|resources|guide|library|learn|school|companies|directory|apply|about|use-cases|startup|founder|dashboard|billing|payments|api|developer)\b/.test(
    value,
  )
}

function internalLinks($: cheerio.CheerioAPI, baseUrl: string) {
  const base = new URL(baseUrl)
  const links = $("a[href]")
    .map((_, el) => {
      const label = cleanText($(el).text())
      const href = $(el).attr("href")
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null
      try {
        const url = new URL(href, baseUrl)
        if (url.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) return null
        url.hash = ""
        return { label, url: url.toString(), pathname: url.pathname }
      } catch {
        return null
      }
    })
    .get()
    .filter((link): link is { label: string; url: string; pathname: string } => Boolean(link))

  const seen = new Set<string>()
  return links
    .filter((link) => {
      if (link.pathname === "/" || seen.has(link.url)) return false
      seen.add(link.url)
      return true
    })
    .sort((a, b) => Number(isLikelyProductLink(b.label, b.url)) - Number(isLikelyProductLink(a.label, a.url)))
    .slice(0, MAX_INTERNAL_PAGES)
}

async function fetchInternalPage(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "Pebble/2.0 (+https://hallway.ai)" },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return null
    const html = await response.text()
    const $ = cheerio.load(html)
    const summary = pageSummary($)
    const snippet = cleanText(
      [
        summary.title && `Title: ${summary.title}`,
        summary.metaDescription && `Description: ${summary.metaDescription}`,
        summary.h1 && `H1: ${summary.h1}`,
        summary.paragraphs.length > 0 && `Copy: ${summary.paragraphs.join(" ")}`,
      ]
        .filter(Boolean)
        .join(" "),
    )
    return snippet.slice(0, 700)
  } catch {
    return null
  }
}

function extractTitleCaseTerms(text: string) {
  return (
    text
      .match(/\b[A-Z][A-Za-z0-9&]*(?:\s+[A-Z][A-Za-z0-9&]*){0,3}\b/g)
      ?.filter((term) => term.length > 2 && !commonWords.has(term.toLowerCase()))
      .slice(0, 30) ?? []
  )
}

function extractKeywordTerms(text: string) {
  const counts = new Map<string, number>()
  for (const word of text.toLowerCase().match(/\b[a-z][a-z0-9-]{3,}\b/g) ?? []) {
    if (commonWords.has(word)) continue
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word)
}

function buildEvidence({
  url,
  companyName,
  tagline,
  category,
  palette,
  navLabels,
  rawCopy,
  internalSnippets,
}: {
  url: string
  companyName: string
  tagline: string
  category: string
  palette: string[]
  navLabels: string[]
  rawCopy: string
  internalSnippets: string[]
}): TargetEvidence {
  const domain = new URL(url).hostname.replace(/^www\./, "")
  const evidenceText = [rawCopy, ...internalSnippets]
    .join(" ")
    .replace(/\b(?:Title|Description|OG title|H1|Navigation|Copy):/gi, " ")
  const terminology = unique([
    companyName,
    ...extractTitleCaseTerms(evidenceText),
    ...extractKeywordTerms(evidenceText),
    ...navLabels.filter((label) => label.length > 2),
  ]).slice(0, 40)
  const productSurfaces = unique(
    navLabels
      .filter((label) => isLikelyProductLink(label, label))
      .concat(
        internalSnippets
          .map((snippet) => snippet.match(/(?:Title|H1):\s*([^|.]+)/)?.[1] ?? "")
          .filter(Boolean),
      ),
  ).slice(0, 12)
  const workflows = unique(
    terminology.filter((term) =>
      /\b(api|apply|batch|billing|checkout|dashboard|demo|docs|founder|invoice|issue|launch|payment|school|startup|support|webhook|workflow)\b/i.test(
        term,
      ),
    ),
  ).slice(0, 12)
  const proofSnippets = unique([rawCopy, ...internalSnippets].map((snippet) => snippet.slice(0, 500))).slice(0, 6)
  const confidence = Math.min(
    1,
    Number(((terminology.length / 20) * 0.35 + (productSurfaces.length / 6) * 0.25 + (proofSnippets.length / 4) * 0.25 + (palette.length / 4) * 0.15).toFixed(2)),
  )

  return {
    companyName,
    domain,
    url,
    tagline,
    category,
    palette,
    navLabels: navLabels.slice(0, 24),
    productSurfaces,
    workflows,
    terminology,
    proofSnippets,
    confidence,
  }
}

export async function scrapeBrandSignals(rawUrl: string): Promise<ScrapedBrandSignals> {
  const url = normalizeUrl(rawUrl)
  const response = await fetch(url, {
    headers: { "user-agent": "Pebble/2.0 (+https://hallway.ai)" },
  })
  if (!response.ok) throw new Error(`Could not fetch ${url}: ${response.status}`)

  const html = await response.text()
  const $ = cheerio.load(html)
  const absolute = (value?: string) => (value ? new URL(value, url).toString() : undefined)

  const { title, metaDescription, ogTitle, h1, paragraphs } = pageSummary($)
  const ogImage = absolute($("meta[property='og:image']").attr("content"))
  const navLabels = unique(
    $("nav a, header a, nav button, header button")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .filter(Boolean),
  ).slice(0, 24)
  const navText = navLabels.join(" / ")

  const stylesheetText = await Promise.all(
    $("link[rel='stylesheet']")
      .slice(0, 4)
      .map(async (_, el) => {
        const href = absolute($(el).attr("href"))
        if (!href) return ""
        const css = await fetch(href).catch(() => null)
        return css?.ok ? css.text() : ""
      })
      .get(),
  )
  const colorCounts = new Map<string, number>()
  const colorSource = [
    html,
    $("[style]").map((_, el) => $(el).attr("style")).get().join(" "),
    $("style").text(),
    stylesheetText.join(" "),
  ].join(" ")
  for (const match of colorSource.match(hexRegex) ?? []) {
    const hex = match.toUpperCase()
    colorCounts.set(hex, (colorCounts.get(hex) ?? 0) + 1)
  }

  const rawCopy = cleanText(
    [
      title && `Title: ${title}`,
      metaDescription && `Description: ${metaDescription}`,
      ogTitle && `OG title: ${ogTitle}`,
      h1 && `H1: ${h1}`,
      navText && `Navigation: ${navText}`,
      paragraphs.length > 0 && `Copy: ${paragraphs.join(" ")}`,
    ]
      .filter(Boolean)
      .join("\n"),
  ).slice(0, 3000)

  const palette = [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([hex]) => hex)
  const companyName = inferCompanyName(url, title, ogTitle)
  const internalSnippets = (
    await Promise.all(internalLinks($, url).map((link) => fetchInternalPage(link.url)))
  ).filter((snippet): snippet is string => Boolean(snippet))

  return {
    url,
    companyName,
    tagline: h1 || metaDescription || ogTitle || title,
    rawCopy,
    ogImage,
    category: metaDescription,
    palette,
    evidence: buildEvidence({
      url,
      companyName,
      tagline: h1 || metaDescription || ogTitle || title,
      category: metaDescription,
      palette,
      navLabels,
      rawCopy,
      internalSnippets,
    }),
  }
}

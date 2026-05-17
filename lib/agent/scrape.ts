import * as cheerio from "cheerio"
import type { BrandSignals } from "./types"

export type ScrapedBrandSignals = BrandSignals & {
  palette: string[]
}

const hexRegex = /#[0-9a-fA-F]{6}\b/g

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

export async function scrapeBrandSignals(rawUrl: string): Promise<ScrapedBrandSignals> {
  const url = normalizeUrl(rawUrl)
  const response = await fetch(url, {
    headers: { "user-agent": "Pebble/2.0 (+https://hallway.ai)" },
  })
  if (!response.ok) throw new Error(`Could not fetch ${url}: ${response.status}`)

  const html = await response.text()
  const $ = cheerio.load(html)
  const absolute = (value?: string) => (value ? new URL(value, url).toString() : undefined)

  const title = cleanText($("title").first().text())
  const metaDescription = cleanText($("meta[name='description']").attr("content") ?? "")
  const ogTitle = cleanText($("meta[property='og:title']").attr("content") ?? "")
  const ogImage = absolute($("meta[property='og:image']").attr("content"))
  const h1 = cleanText($("h1").first().text())
  const paragraphs = $("p")
    .slice(0, 3)
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean)
  const navText = $("nav a, header a, nav button, header button")
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean)
    .slice(0, 24)
    .join(" / ")

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

  return {
    url,
    companyName: inferCompanyName(url, title, ogTitle),
    tagline: h1 || metaDescription || ogTitle || title,
    rawCopy,
    ogImage,
    category: metaDescription,
    palette: [...colorCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([hex]) => hex),
  }
}

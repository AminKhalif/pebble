import * as cheerio from "cheerio"
import { scrapedFactsSchema, type ScrapedFacts } from "./schemas"

const colorRegex = /#[0-9a-fA-F]{6}\b/g

export function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim()
  if (!trimmed) throw new Error("URL is required")
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export async function scrapeTarget(rawUrl: string): Promise<ScrapedFacts> {
  const url = normalizeUrl(rawUrl)
  const res = await fetch(url, { headers: { "user-agent": "Pebble/1.0" } })
  if (!res.ok) throw new Error(`Could not fetch ${url}: ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)
  const abs = (value?: string) => (value ? new URL(value, url).toString() : null)
  const logoUrl =
    abs($("link[rel~='icon']").attr("href")) ??
    abs($("meta[property='og:image']").attr("content")) ??
    abs($("header img").first().attr("src")) ??
    abs($("img").first().attr("src"))
  const colorCounts = new Map<string, number>()
  const stylesheets = await Promise.all(
    $("link[rel='stylesheet']")
      .slice(0, 4)
      .map(async (_, el) => {
        const href = abs($(el).attr("href"))
        if (!href) return ""
        const css = await fetch(href).catch(() => null)
        return css?.ok ? css.text() : ""
      })
      .get(),
  )
  const colorSource = `${$("[style]").map((_, el) => $(el).attr("style")).get().join(" ")} ${$("style").text()} ${stylesheets.join(" ")}`
  for (const match of colorSource.match(colorRegex) ?? []) {
    const hex = match.toUpperCase()
    colorCounts.set(hex, (colorCounts.get(hex) ?? 0) + 1)
  }
  $("script,style,noscript,svg").remove()
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000)
  return scrapedFactsSchema.parse({
    url,
    logoUrl,
    hexColors: [...colorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([hex]) => hex),
    h1: $("h1").first().text().replace(/\s+/g, " ").trim(),
    metaDescription: $("meta[name='description']").attr("content")?.trim() ?? "",
    bodyText,
  })
}

export async function fetchImageBytes(imageUrl: string | null) {
  if (!imageUrl) return null
  const res = await fetch(imageUrl)
  if (!res.ok) return null
  const mimeType = res.headers.get("content-type")?.split(";")[0] ?? "image/png"
  if (!["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"].includes(mimeType)) {
    return null
  }
  const bytes = new Uint8Array(await res.arrayBuffer())
  return { bytes, mimeType }
}

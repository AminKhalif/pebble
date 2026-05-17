import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { PipelineResult } from "./types"
import { normalizeUrl } from "./scrape"

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function slugUrl(rawUrl: string) {
  const url = new URL(normalizeUrl(rawUrl))
  return `${url.hostname.replace(/^www\./, "")}${url.pathname === "/" ? "" : url.pathname}`
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

function cachePath(rawUrl: string) {
  return join(process.cwd(), "lib", "agent", "cache", `${slugUrl(rawUrl)}.json`)
}

export async function readCachedResult(rawUrl: string) {
  const path = cachePath(rawUrl)
  try {
    const info = await stat(path)
    if (Date.now() - info.mtimeMs > CACHE_TTL_MS) return null
    return JSON.parse(await readFile(path, "utf8")) as PipelineResult
  } catch {
    return null
  }
}

export async function writeCachedResult(rawUrl: string, result: PipelineResult) {
  const path = cachePath(rawUrl)
  await mkdir(join(process.cwd(), "lib", "agent", "cache"), { recursive: true })
  await writeFile(path, JSON.stringify(result, null, 2))
}

export function generatedImagePath(rawUrl: string) {
  const slug = slugUrl(rawUrl)
  return {
    publicPath: `/generated/${slug}.png`,
    filePath: join(process.cwd(), "public", "generated", `${slug}.png`),
  }
}


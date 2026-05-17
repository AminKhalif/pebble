import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  analyzeBrand,
  createCharacterPrompt,
  createInProductPreview,
  createMascot,
  createVoice,
  generateWorksheet,
} from "@/lib/pipeline"
import { fetchImageBytes, scrapeTarget } from "@/lib/scrape"

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "")
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"))
loadEnvFile(resolve(process.cwd(), ".env"))

const step = process.argv[2] ?? "scrape"
const url = process.argv[3] ?? "https://ycombinator.com"

async function main() {
  const scraped = await scrapeTarget(url)
  if (step === "scrape") {
    console.log(JSON.stringify(scraped, null, 2))
    return
  }

  const image = await fetchImageBytes(scraped.logoUrl)
  const brand = await analyzeBrand(scraped, image)
  if (step === "brand") {
    console.log(JSON.stringify(brand, null, 2))
    return
  }

  const mascot = await createMascot(brand)
  if (step === "mascot") {
    console.log(JSON.stringify(mascot, null, 2))
    return
  }

  const voice = await createVoice(brand, mascot)
  if (step === "voice") {
    console.log(JSON.stringify(voice, null, 2))
    return
  }

  const prompt = await createCharacterPrompt(brand, mascot)
  if (step === "prompt") {
    console.log(JSON.stringify(prompt, null, 2))
    return
  }

  const preview = await createInProductPreview(brand, mascot, voice)
  if (step === "preview") {
    console.log(JSON.stringify(preview, null, 2))
    return
  }

  console.log(JSON.stringify(await generateWorksheet(url), null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

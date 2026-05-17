import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runAgentPipeline } from "@/lib/agent/pipeline"

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "")
    }
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"))
loadEnvFile(resolve(process.cwd(), ".env"))

const url = process.argv[2] ?? "notion.so"

async function main() {
  const result = await runAgentPipeline(url, (event) => {
    console.error(`[${event.status}] ${event.stage} ${event.elapsed}ms ${event.preview ?? ""}`)
  })
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

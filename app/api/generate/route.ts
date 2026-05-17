import { z } from "zod"
import { runAgentPipeline } from "@/lib/agent/pipeline"
import type { StageEvent } from "@/lib/agent/types"

export const runtime = "nodejs"

const requestSchema = z.object({
  url: z.string().min(1),
})

export async function POST(request: Request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const body = requestSchema.parse(await request.json())
        const result = await runAgentPipeline(body.url, async (stage: StageEvent) => {
          send("stage", stage)
        })
        send("complete", result)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not generate worksheet"
        send("error", { message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  })
}

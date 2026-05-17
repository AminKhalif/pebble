import { NextResponse } from "next/server"
import { z } from "zod"
import { generateWorksheet } from "@/lib/pipeline"

export const runtime = "nodejs"

const requestSchema = z.object({
  url: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json())
    const result = await generateWorksheet(body.url)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate worksheet"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

import { mkdir, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import { generatedImagePath } from "./cache"
import type { ImagePromptSpec } from "./types"

type CloudflareImageResponse = {
  success?: boolean
  result?: {
    image?: string
  }
  errors?: unknown[]
}

export async function generateMascotImage(rawUrl: string, prompt: ImagePromptSpec) {
  const accountId = process.env.CF_ACCOUNT_ID
  const token = process.env.CF_API_TOKEN
  if (!accountId || !token) return undefined

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt.composedPrompt, steps: 8 }),
    },
  )
  if (!response.ok) return undefined

  const payload = (await response.json()) as CloudflareImageResponse
  const image = payload.result?.image
  if (!payload.success || !image) return undefined

  const { filePath, publicPath } = generatedImagePath(rawUrl)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, Buffer.from(image, "base64"))
  return publicPath
}


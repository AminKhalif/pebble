import { GoogleGenAI } from "@google/genai"
import Groq from "groq-sdk"

type JsonRecord = Record<string, unknown>

const DEFAULT_MODEL = "llama-3.3-70b-versatile"
const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash"
const NVIDIA_FALLBACK_MODEL = "meta/llama-3.3-70b-instruct"
const CLOUDFLARE_FALLBACK_MODEL = "@cf/meta/llama-3-8b-instruct"
let nextGeminiAt = 0

function parseJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1))
    }
    throw new Error(`Could not parse JSON response: ${cleaned.slice(0, 120)}`)
  }
}

function isRateLimitError(error: unknown) {
  if (typeof error !== "object" || error === null) return false
  const maybeStatus = "status" in error ? (error as { status?: unknown }).status : undefined
  const message = error instanceof Error ? error.message : JSON.stringify(error)
  return maybeStatus === 429 || /rate.?limit|quota|tokens per day/i.test(message)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function throttleGemini() {
  const wait = Math.max(0, nextGeminiAt - Date.now())
  if (wait > 0) await sleep(wait)
  nextGeminiAt = Date.now() + 15000
}

async function geminiJson<T extends JsonRecord>({
  system,
  user,
}: {
  system: string
  user: string
}): Promise<T> {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY")
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  let lastError: unknown

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await throttleGemini()
      const response = await ai.models.generateContent({
        model: GEMINI_FALLBACK_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${system}

Return only valid JSON. No markdown fences.

${user}`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      })
      const content = response.text
      if (!content) throw new Error("Empty Gemini response")
      return parseJson(content) as T
    } catch (error) {
      lastError = error
      if (!isRateLimitError(error)) break
      await sleep(45000)
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Gemini JSON call failed")
}

async function nvidiaJson<T extends JsonRecord>({
  system,
  user,
}: {
  system: string
  user: string
}): Promise<T> {
  if (!process.env.NVIDIA_API_KEY) throw new Error("Missing NVIDIA_API_KEY")
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: NVIDIA_FALLBACK_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${system}\n\nReturn only valid JSON. No markdown fences.`,
        },
        { role: "user", content: user },
      ],
    }),
  })
  const payload = await response.json()
  if (!response.ok) {
    throw new Error(`${response.status} ${JSON.stringify(payload)}`)
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error("Empty NVIDIA response")
  return parseJson(content) as T
}

async function cloudflareJson<T extends JsonRecord>({
  system,
  user,
}: {
  system: string
  user: string
}): Promise<T> {
  const accountId = process.env.CF_ACCOUNT_ID
  const token = process.env.CF_API_TOKEN
  if (!accountId || !token) throw new Error("Missing CF_ACCOUNT_ID or CF_API_TOKEN")

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_FALLBACK_MODEL}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `${system}\n\nReturn only valid JSON. No markdown fences.`,
          },
          { role: "user", content: user },
        ],
      }),
    },
  )
  const payload = await response.json()
  if (!response.ok || payload.success === false) {
    throw new Error(`${response.status} ${JSON.stringify(payload)}`)
  }

  const content =
    typeof payload.result?.response === "string"
      ? payload.result.response
      : typeof payload.result === "string"
        ? payload.result
        : payload.result?.choices?.[0]?.message?.content
  if (!content) throw new Error("Empty Cloudflare response")
  return parseJson(content) as T
}

async function fallbackJson<T extends JsonRecord>(system: string, user: string) {
  let lastError: unknown
  if (process.env.NVIDIA_API_KEY) {
    try {
      return await nvidiaJson<T>({ system, user })
    } catch (error) {
      lastError = error
    }
  }
  try {
    return await geminiJson<T>({ system, user })
  } catch (error) {
    lastError = error
  }
  if (process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN) {
    try {
      return await cloudflareJson<T>({ system, user })
    } catch (error) {
      lastError = error
    }
  }
  throw lastError instanceof Error ? lastError : new Error("All fallback JSON providers failed")
}

export async function groqJson<T extends JsonRecord>({
  system,
  user,
  model = DEFAULT_MODEL,
}: {
  system: string
  user: string
  model?: string
}): Promise<T> {
  if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY")
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  let lastError: unknown

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      })
      const content = response.choices[0]?.message?.content
      if (!content) throw new Error("Empty Groq response")
      return parseJson(content) as T
    } catch (error) {
      lastError = error
      if (isRateLimitError(error)) {
        return fallbackJson<T>(system, user)
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Groq JSON call failed")
}

export function asJson(input: unknown) {
  return JSON.stringify(input, null, 2)
}

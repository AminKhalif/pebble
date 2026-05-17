import { GoogleGenAI, Type } from "@google/genai"
import Groq from "groq-sdk"
import type { ZodTypeAny } from "zod"
import { z } from "zod"

type GeminiSchema =
  | { type: Type.STRING; enum?: string[] }
  | { type: Type.BOOLEAN }
  | { type: Type.NUMBER }
  | { type: Type.ARRAY; items: GeminiSchema }
  | { type: Type.OBJECT; properties: Record<string, GeminiSchema>; required: string[] }

type JsonSchema =
  | { type: "string"; enum?: string[] }
  | { type: "boolean" }
  | { type: "number" }
  | { type: "array"; items: JsonSchema }
  | { type: "object"; properties: Record<string, JsonSchema>; required: string[]; additionalProperties: false }

function unwrap(schema: ZodTypeAny): ZodTypeAny {
  const def = schema._def
  if (def.typeName === "ZodEffects") return unwrap(def.schema)
  if (def.typeName === "ZodOptional" || def.typeName === "ZodNullable") return unwrap(def.innerType)
  return schema
}

function zodToGemini(schema: ZodTypeAny): GeminiSchema {
  const current = unwrap(schema)
  const def = current._def
  if (def.typeName === "ZodString") return { type: Type.STRING }
  if (def.typeName === "ZodBoolean") return { type: Type.BOOLEAN }
  if (def.typeName === "ZodNumber") return { type: Type.NUMBER }
  if (def.typeName === "ZodEnum") return { type: Type.STRING, enum: def.values }
  if (def.typeName === "ZodArray") return { type: Type.ARRAY, items: zodToGemini(def.type) }
  if (def.typeName === "ZodObject") {
    const shape = def.shape()
    return {
      type: Type.OBJECT,
      properties: Object.fromEntries(Object.entries(shape).map(([key, value]) => [key, zodToGemini(value as ZodTypeAny)])),
      required: Object.keys(shape),
    }
  }
  throw new Error(`Unsupported Zod schema type for Gemini: ${def.typeName}`)
}

function zodToJson(schema: ZodTypeAny): JsonSchema {
  const current = unwrap(schema)
  const def = current._def
  if (def.typeName === "ZodString") return { type: "string" }
  if (def.typeName === "ZodBoolean") return { type: "boolean" }
  if (def.typeName === "ZodNumber") return { type: "number" }
  if (def.typeName === "ZodEnum") return { type: "string", enum: def.values }
  if (def.typeName === "ZodArray") return { type: "array", items: zodToJson(def.type) }
  if (def.typeName === "ZodObject") {
    const shape = def.shape()
    return {
      type: "object",
      properties: Object.fromEntries(Object.entries(shape).map(([key, value]) => [key, zodToJson(value as ZodTypeAny)])),
      required: Object.keys(shape),
      additionalProperties: false,
    }
  }
  throw new Error(`Unsupported Zod schema type for JSON schema: ${def.typeName}`)
}

function parseJson(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim()
  return JSON.parse(cleaned)
}

export async function geminiStructured<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  options?: { imageBytes?: Uint8Array; imageMimeType?: string; urlContext?: string },
): Promise<T> {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY")
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const jsonInstruction = options?.urlContext
    ? `\n\nReturn only valid JSON. Do not wrap it in markdown. The JSON must satisfy this schema:\n${JSON.stringify(zodToJson(schema as unknown as ZodTypeAny))}`
    : ""
  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
    { text: options?.urlContext ? `${prompt}\n\nTarget URL for URL context: ${options.urlContext}${jsonInstruction}` : prompt },
  ]
  if (options?.imageBytes && options.imageMimeType) {
    parts.push({
      inlineData: {
        data: Buffer.from(options.imageBytes).toString("base64"),
        mimeType: options.imageMimeType,
      },
    })
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts }],
    config: {
      responseMimeType: options?.urlContext ? undefined : "application/json",
      responseSchema: options?.urlContext ? undefined : zodToGemini(schema as unknown as ZodTypeAny),
      tools: options?.urlContext ? [{ urlContext: {} }] : undefined,
    },
  })
  return schema.parse(parseJson(response.text ?? ""))
}

export async function groqStructured<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  options?: { model?: string; systemPrompt?: string },
): Promise<T> {
  if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY")
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const jsonSchema = zodToJson(schema as unknown as ZodTypeAny)
  const systemPrompt =
    options?.systemPrompt ??
    `Return only valid JSON, no markdown fences. The JSON must satisfy this schema:\n${JSON.stringify(jsonSchema)}`
  const response = await client.chat.completions.create({
    model: options?.model ?? "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  })
  return schema.parse(parseJson(response.choices[0]?.message?.content ?? ""))
}

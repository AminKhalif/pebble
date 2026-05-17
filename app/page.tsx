"use client"

import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { PebbleNav } from "@/components/pebble/nav"
import { InputPhase } from "@/components/pebble/input-phase"
import { AnalyzingPhase } from "@/components/pebble/analyzing-phase"
import { ResultsPhase } from "@/components/pebble/results-phase"
import { getMockResult, type MockResult } from "@/lib/mock-data"
import { pipelineToWorksheet } from "@/lib/agent/worksheet-adapter"
import type { PipelineResult, StageEvent } from "@/lib/agent/types"

type Phase = "input" | "analyzing" | "results"

export default function Page() {
  const [phase, setPhase] = useState<Phase>("input")
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<MockResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stageEvents, setStageEvents] = useState<StageEvent[]>([])

  const handleSseEvent = (eventName: string, data: string, rawUrl: string) => {
    if (!data.trim()) return
    const payload = JSON.parse(data)
    if (eventName === "stage") {
      setStageEvents((events) => [...events, payload as StageEvent])
      return
    }
    if (eventName === "complete") {
      setResult(pipelineToWorksheet(payload as PipelineResult))
      setPhase("results")
      return
    }
    if (eventName === "error") {
      throw new Error(payload.message ?? `Could not generate worksheet for ${rawUrl}`)
    }
  }

  const readEventStream = async (response: Response, rawUrl: string) => {
    if (!response.body) throw new Error("No response body")
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    let eventName = "message"

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let boundary = buffer.indexOf("\n\n")
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        const dataLines: string[] = []
        eventName = "message"
        for (const line of block.split("\n")) {
          if (line.startsWith("event:")) eventName = line.slice(6).trim()
          if (line.startsWith("data:")) dataLines.push(line.slice(5).trim())
        }
        handleSseEvent(eventName, dataLines.join("\n"), rawUrl)
        boundary = buffer.indexOf("\n\n")
      }
    }
  }

  const generate = async (rawUrl: string) => {
    setUrl(rawUrl)
    setError(null)
    setResult(null)
    setStageEvents([])
    setPhase("analyzing")
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      })
      if (!response.ok) throw new Error("Could not generate worksheet")
      await readEventStream(response, rawUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate worksheet")
      setResult(getMockResult(rawUrl))
      setPhase("results")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (rawUrl: string) => {
    void generate(rawUrl)
  }

  const handleAnalyzed = () => setPhase("results")

  const handleStartOver = () => {
    setPhase("input")
    setResult(null)
    setUrl("")
    setError(null)
    setStageEvents([])
  }

  const handleRegenerate = () => {
    if (!url) return
    void generate(url)
  }

  return (
    <main className="relative min-h-screen bg-paper">
      <PebbleNav />
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <InputPhase key="input" onSubmit={handleSubmit} isGenerating={isGenerating} error={error} />
        )}
        {phase === "analyzing" && (
          <AnalyzingPhase key="analyzing" url={url} result={result} events={stageEvents} onDone={handleAnalyzed} />
        )}
        {phase === "results" && result && (
          <ResultsPhase
            key="results"
            result={result}
            onStartOver={handleStartOver}
            onRegenerate={handleRegenerate}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

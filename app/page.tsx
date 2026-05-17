"use client"

import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { PebbleNav } from "@/components/pebble/nav"
import { InputPhase } from "@/components/pebble/input-phase"
import { AnalyzingPhase } from "@/components/pebble/analyzing-phase"
import { ResultsPhase } from "@/components/pebble/results-phase"
import type { MockResult } from "@/lib/mock-data"

type Phase = "input" | "analyzing" | "results"

export default function Page() {
  const [phase, setPhase] = useState<Phase>("input")
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<MockResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (rawUrl: string) => {
    setUrl(rawUrl)
    setError(null)
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? "Could not generate worksheet")
      setResult(payload)
      setPhase("analyzing")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate worksheet")
      setPhase("input")
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
        {phase === "analyzing" && result && (
          <AnalyzingPhase key="analyzing" url={url} result={result} onDone={handleAnalyzed} />
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

"use client"

import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { PebbleNav } from "@/components/pebble/nav"
import { InputPhase } from "@/components/pebble/input-phase"
import { AnalyzingPhase } from "@/components/pebble/analyzing-phase"
import { ResultsPhase } from "@/components/pebble/results-phase"
import { getMockResult, type MockResult } from "@/lib/mock-data"

type Phase = "input" | "analyzing" | "results"

export default function Page() {
  const [phase, setPhase] = useState<Phase>("input")
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<MockResult | null>(null)

  const handleSubmit = (rawUrl: string) => {
    const r = getMockResult(rawUrl)
    setUrl(rawUrl)
    setResult(r)
    setPhase("analyzing")
  }

  const handleAnalyzed = () => setPhase("results")

  const handleStartOver = () => {
    setPhase("input")
    setResult(null)
    setUrl("")
  }

  const handleRegenerate = () => {
    if (!url) return
    setPhase("analyzing")
  }

  return (
    <main className="relative min-h-screen bg-paper">
      <PebbleNav />
      <AnimatePresence mode="wait">
        {phase === "input" && <InputPhase key="input" onSubmit={handleSubmit} />}
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

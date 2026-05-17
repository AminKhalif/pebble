"use client"

import { useRouter } from "next/navigation"
import { PebbleNav } from "./nav"
import { ResultsPhase } from "./results-phase"
import { demoExamples } from "@/lib/demo-examples"

type Props = {
  domain: string
}

export function DemoWorksheetPage({ domain }: Props) {
  const router = useRouter()
  const result = demoExamples[domain]

  if (!result) {
    router.replace("/")
    return null
  }

  return (
    <main className="relative min-h-screen bg-paper">
      <PebbleNav />
      <ResultsPhase
        result={result}
        onStartOver={() => router.push("/")}
        onRegenerate={() => router.refresh()}
      />
    </main>
  )
}

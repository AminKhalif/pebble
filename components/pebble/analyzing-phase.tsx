"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Mascot } from "./mascot"
import type { MockResult } from "@/lib/mock-data"

type Props = {
  url: string
  result: MockResult
  onDone: () => void
}

const STATUS_LINES = [
  "collecting brand signals...",
  "pulling palette (5 colors found)",
  "reading tone... calm, warm, technical",
  "sketching shape language",
  "writing voice",
  "staging preview",
]

const TIMINGS = {
  brandHeader: 600,
  swatches: 1200,
  tags: 2200,
  mascotSketch: 3000,
  annotations: 4000,
  prompt: 4500,
  persona: 5200,
  preview: 5800,
  done: 6800,
}

export function AnalyzingPhase({ url, result, onDone }: Props) {
  const [stage, setStage] = useState(0)
  const [headerText, setHeaderText] = useState("")
  const [statusIndex, setStatusIndex] = useState(0)

  // typewriter for header
  useEffect(() => {
    const target = `${result.company.name} · ${result.company.url}`
    let i = 0
    const t = setInterval(() => {
      i++
      setHeaderText(target.slice(0, i))
      if (i >= target.length) clearInterval(t)
    }, 35)
    return () => clearInterval(t)
  }, [result.company.name, result.company.url])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    Object.values(TIMINGS).forEach((delay, idx) => {
      timers.push(setTimeout(() => setStage(idx + 1), delay))
    })
    timers.push(setTimeout(() => onDone(), TIMINGS.done))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  // status line cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_LINES.length - 1))
    }, 950)
    return () => clearInterval(interval)
  }, [])

  const accent = result.colors[0].hex

  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mx-auto max-w-[1280px] px-6 py-10"
    >
      {/* worksheet header strip */}
      <div className="flex items-center justify-between border-y border-rule py-3">
        <div className="font-mono text-[11px] lowercase text-ink-soft">
          pebble worksheet № 0042 · 17.05.26 · subject: {url}
        </div>
        <div className="font-mono text-[11px] lowercase text-ink-soft">
          <AnimatePresence mode="wait">
            <motion.span
              key={statusIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {STATUS_LINES[statusIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-12">
        {/* 01 brand brief */}
        <div className="col-span-12 lg:col-span-4">
          <SectionLabel>01 / brand brief</SectionLabel>
          <div className="mt-3 min-h-[28px] font-mono text-[13px] text-ink">
            {headerText}
            <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-[1px] animate-pulse bg-ink align-middle" />
          </div>

          <div className="mt-6 h-px w-full bg-rule" />

          {/* swatches */}
          <div className="mt-6">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              palette
            </div>
            <div className="mt-3 flex gap-3">
              {result.colors.map((c, i) => (
                <motion.div
                  key={c.hex}
                  initial={{ opacity: 0, y: -16 }}
                  animate={
                    stage >= 2
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -16 }
                  }
                  transition={{
                    delay: 0.08 * i,
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                  }}
                  className="flex flex-col items-start"
                >
                  <div
                    className="h-12 w-12 border border-ink"
                    style={{ background: c.hex }}
                  />
                  <div className="mt-1.5 font-mono text-[10px] text-ink-soft">
                    {c.hex.toLowerCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* tags */}
          <div className="mt-8">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              tone
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.tags.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0 }}
                  animate={stage >= 3 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.3 }}
                  className="rounded-full border border-rule bg-paper px-2.5 py-1 text-[12px] text-ink"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* 02 mascot specimen */}
        <div className="col-span-12 lg:col-span-8">
          <SectionLabel>02 / mascot specimen</SectionLabel>
          <div className="mt-3 font-serif text-[44px] leading-none text-ink">
            {stage >= 4 ? result.mascot.name : "—"}
          </div>

          <div className="dot-grid mt-6 flex h-[400px] items-center justify-center border border-rule bg-paper-lift">
            {stage >= 4 ? (
              <Mascot
                mascotKey={result.mascot.key}
                accent={accent}
                size={300}
                sketching
                hideFeatures={false}
              />
            ) : (
              <div className="font-mono text-[11px] lowercase text-ink-soft/60">
                drafting…
              </div>
            )}
          </div>
        </div>

        {/* 03 prompt placeholder */}
        <div className="col-span-12 lg:col-span-7">
          <SectionLabel>03 / image prompt</SectionLabel>
          <div className="mt-3 min-h-[120px] border border-rule bg-paper-lift p-4 font-mono text-[12px] leading-relaxed text-ink">
            {stage >= 6 ? (
              <TypingBlock text={result.imagePrompt} />
            ) : (
              <span className="text-ink-soft/60">awaiting brief…</span>
            )}
          </div>
        </div>

        {/* 04 persona placeholder */}
        <div className="col-span-12 lg:col-span-5">
          <SectionLabel>04 / voice & persona</SectionLabel>
          <div className="mt-3 space-y-2">
            {result.persona.samples.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={stage >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ delay: 0.2 * i, duration: 0.4 }}
                className="border border-rule bg-paper-lift px-3 py-2 text-[13px] text-ink"
              >
                {s}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 05 preview placeholder */}
        <div className="col-span-12">
          <SectionLabel>05 / in-product preview</SectionLabel>
          <motion.div
            initial={{ opacity: 0 }}
            animate={stage >= 8 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-3 h-[180px] border border-rule bg-paper-lift"
          />
        </div>
      </div>
    </motion.div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
      {children}
    </div>
  )
}

function TypingBlock({ text }: { text: string }) {
  const [shown, setShown] = useState("")
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i += 4
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, 24)
    return () => clearInterval(t)
  }, [text])
  return <pre className="whitespace-pre-wrap font-mono text-[12px]">{shown}</pre>
}

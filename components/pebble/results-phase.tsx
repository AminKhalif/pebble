"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Mascot } from "./mascot"
import { InProductPreview } from "./in-product-preview"
import type { MockResult } from "@/lib/mock-data"

type Props = {
  result: MockResult
  onStartOver: () => void
  onRegenerate: () => void
}

export function ResultsPhase({ result, onStartOver, onRegenerate }: Props) {
  const accent = result.colors[0].hex

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative mx-auto max-w-[1280px] px-6 pt-6 pb-24"
    >
      {/* worksheet header strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-rule py-3">
        <div className="font-mono text-[11px] lowercase text-ink-soft">
          pebble worksheet № 0042 · 17.05.26 · subject: {result.company.url}
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={onStartOver}
            className="font-mono text-[11px] lowercase text-ink-soft transition-colors hover:text-ink"
          >
            start over
          </button>
          <button
            onClick={onRegenerate}
            className="font-mono text-[11px] lowercase text-ink-soft transition-colors hover:text-ink"
          >
            regenerate
          </button>
          <button className="font-mono text-[11px] lowercase text-ink-soft transition-colors hover:text-ink">
            export pdf
          </button>
        </div>
      </div>

      {/* Top row: 01 brand brief (4) + 02 mascot specimen (8) */}
      <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-12">
        <BrandBrief result={result} accent={accent} />
        <MascotSpecimen result={result} accent={accent} />
      </div>

      {/* Middle row: 04 voice (5) + 03 prompt (4 offset) */}
      <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-12">
        <VoicePersona result={result} />
        <div className="col-span-12 lg:col-span-1" />
        <ImagePrompt result={result} />
      </div>

      {/* Bottom: 05 in-product preview, full width */}
      <div className="mt-20">
        <PreviewSection result={result} />
      </div>

      <div className="mt-24 border-t border-rule pt-4 text-center font-mono text-[11px] lowercase text-ink-soft">
        end of worksheet / pebble v1.0 / drafted by an agent, reviewed by you
      </div>
    </motion.div>
  )
}

/* ---------------- 01 Brand Brief ---------------- */
function BrandBrief({ result, accent }: { result: MockResult; accent: string }) {
  return (
    <div className="col-span-12 lg:col-span-4">
      <SectionLabel>01 / brand brief</SectionLabel>
      <div className="mt-4 font-serif text-[42px] leading-[1] text-ink">
        {result.company.name}
      </div>
      <div className="mt-1 font-mono text-[12px] lowercase text-ink-soft">
        {result.company.url}
      </div>
      <div className="mt-5 max-w-md text-[14px] italic leading-relaxed text-ink">
        {result.company.positioning}
      </div>

      <div className="mt-7 h-px w-full bg-rule" />

      <div className="mt-6 space-y-4">
        <Field label="category">{result.company.category}</Field>
        <Field label="target user">{result.company.targetUser}</Field>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            tone
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-rule bg-paper px-2.5 py-1 text-[12px] text-ink"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 h-px w-full bg-rule" />

      <div className="mt-6">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          palette
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {result.colors.map((c, i) => (
            <div key={c.hex} className="flex flex-col items-start">
              <div
                className="h-14 w-14 border border-ink"
                style={{ background: c.hex }}
              />
              <div className="mt-1.5 font-mono text-[10px] text-ink-soft">
                {c.hex.toLowerCase()}
              </div>
              {i === 0 && (
                <div className="mt-0.5 font-mono text-[9px] uppercase" style={{ color: accent }}>
                  borrowed
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        {label}
      </div>
      <div className="mt-1 text-[13px] leading-relaxed text-ink">{children}</div>
    </div>
  )
}

/* ---------------- 02 Mascot Specimen ---------------- */
function MascotSpecimen({ result, accent }: { result: MockResult; accent: string }) {
  return (
    <div className="col-span-12 lg:col-span-8">
      <SectionLabel>02 / mascot specimen</SectionLabel>
      <div className="mt-4 font-serif text-[64px] leading-[0.95] text-ink">
        {result.mascot.name}
      </div>
      <div className="mt-2 font-mono text-[11px] lowercase text-ink-soft">
        species: {result.mascot.species} · disposition: {result.mascot.disposition}
      </div>

      {/* big specimen panel */}
      <div className="dot-grid relative mt-6 h-[480px] w-full overflow-hidden border border-rule bg-paper-lift">
        {/* mascot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Mascot mascotKey={result.mascot.key} accent={accent} size={340} />
        </div>

        {/* annotations */}
        <SpecimenAnnotations annotations={result.mascot.annotations} />

        <div className="absolute bottom-3 right-3 font-mono text-[10px] lowercase text-ink-soft">
          fig. 02a
        </div>
      </div>

      {/* expression variants */}
      <div className="mt-6 flex flex-wrap gap-4">
        {(["default", "thinking", "delighted"] as const).map((p) => (
          <div key={p} className="flex flex-col items-center">
            <div className="dot-grid flex h-[110px] w-[110px] items-center justify-center border border-rule bg-paper-lift">
              <Mascot mascotKey={result.mascot.key} accent={accent} size={92} pose={p} />
            </div>
            <div className="mt-1.5 font-mono text-[10px] lowercase text-ink-soft">
              {p}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-[680px] text-[14px] leading-relaxed text-ink">
        {result.mascot.description}
      </p>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            traits
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.mascot.traits.map((t) => (
              <span
                key={t}
                className="rounded-full border border-rule bg-paper px-2.5 py-1 text-[12px] text-ink"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-12 md:col-span-7">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            role inside the product
          </div>
          <div className="mt-2 text-[14px] leading-relaxed text-ink">
            {result.mascot.role}
          </div>
        </div>
      </div>
    </div>
  )
}

function SpecimenAnnotations({
  annotations,
}: {
  annotations: { label: string; target: "body" | "eye" | "corner" | "cheek" }[]
}) {
  // anchor positions inside specimen panel (percentages)
  const anchors: Record<string, { x: number; y: number }> = {
    body: { x: 50, y: 75 },
    eye: { x: 56, y: 50 },
    corner: { x: 70, y: 38 },
    cheek: { x: 38, y: 56 },
  }
  // label positions on the panel edges
  const labelPos: Record<string, { x: number; y: number; align: "left" | "right" }> = {
    body: { x: 8, y: 88, align: "left" },
    eye: { x: 92, y: 38, align: "right" },
    corner: { x: 92, y: 70, align: "right" },
    cheek: { x: 8, y: 32, align: "left" },
  }
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {annotations.map((a) => {
          const from = anchors[a.target]
          const to = labelPos[a.target]
          // slight irregular curve
          const mx = (from.x + to.x) / 2 + (a.target === "body" ? -2 : 2)
          const my = (from.y + to.y) / 2 + (a.target === "eye" ? 3 : -2)
          return (
            <path
              key={a.target}
              d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
              stroke="#1A1814"
              strokeWidth="0.18"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
      {annotations.map((a) => {
        const pos = labelPos[a.target]
        return (
          <div
            key={a.target}
            className={`pointer-events-none absolute max-w-[160px] font-mono text-[10px] leading-tight text-ink-soft ${
              pos.align === "right" ? "text-right" : "text-left"
            }`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(${pos.align === "right" ? "-100%" : "0"}, -50%)`,
            }}
          >
            {a.label}
          </div>
        )
      })}
    </>
  )
}

/* ---------------- 03 Image Prompt ---------------- */
function ImagePrompt({ result }: { result: MockResult }) {
  const [state, setState] = useState<"idle" | "copied">("idle")
  const handleCopy = () => {
    void navigator.clipboard.writeText(result.imagePrompt)
    setState("copied")
    setTimeout(() => setState("idle"), 2000)
  }
  return (
    <div className="col-span-12 lg:col-span-7">
      <div className="origin-top-left rotate-[0.6deg] border border-ink bg-paper-lift p-6">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            03 / image prompt · copyable
          </div>
          <div className="font-mono text-[10px] text-ink-soft">slip 03</div>
        </div>
        <div className="mt-3 font-serif text-[28px] leading-[1.1] text-ink">
          Character Prompt
        </div>
        <pre className="mt-4 max-h-[380px] overflow-auto whitespace-pre-wrap border border-rule bg-paper p-4 font-mono text-[12px] leading-relaxed text-ink">
          {result.imagePrompt}
        </pre>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCopy}
            className="rounded-sm border border-ink bg-paper px-3 py-1.5 font-mono text-[11px] lowercase text-ink transition-colors hover:bg-paper-lift"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={state}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="inline-block"
              >
                {state === "copied" ? "copied ✓" : "copy prompt ⌘C"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- 04 Voice & Persona ---------------- */
function VoicePersona({ result }: { result: MockResult }) {
  const [state, setState] = useState<"idle" | "copied">("idle")
  const copyPersona = () => {
    const text = `voice: ${result.persona.voice}
appears: ${result.persona.appears}
do:
${result.persona.dos.map((d) => " + " + d).join("\n")}
don't:
${result.persona.donts.map((d) => " - " + d).join("\n")}
samples:
${result.persona.samples.map((s) => " · " + s).join("\n")}`
    void navigator.clipboard.writeText(text)
    setState("copied")
    setTimeout(() => setState("idle"), 2000)
  }
  return (
    <div className="col-span-12 lg:col-span-6">
      <SectionLabel>04 / voice & persona</SectionLabel>
      <div className="mt-4 font-serif text-[36px] leading-[1.05] text-ink">
        How {result.mascot.name} speaks
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            voice
          </div>
          <div className="mt-1 text-[14px] italic leading-relaxed text-ink">
            {result.persona.voice}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            appears
          </div>
          <div className="mt-1 text-[14px] leading-relaxed text-ink">
            {result.persona.appears}
          </div>
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-rule" />

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            do
          </div>
          <ul className="mt-2 space-y-1.5">
            {result.persona.dos.map((d, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-ink">
                <span className="font-mono text-ink-soft">+</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            don&apos;t
          </div>
          <ul className="mt-2 space-y-1.5">
            {result.persona.donts.map((d, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-ink">
                <span className="font-mono text-ink-soft">−</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-rule" />

      <div className="mt-6">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          sample messages
        </div>
        <div className="mt-3 space-y-3">
          {result.persona.samples.map((s, i) => {
            const rotation = i === 1 ? "-rotate-[0.8deg]" : ""
            return (
              <div
                key={i}
                className={`flex items-start gap-3 border border-rule bg-paper-lift px-3 py-2.5 ${rotation}`}
              >
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink bg-paper">
                  <Mascot
                    mascotKey={result.mascot.key}
                    accent={result.colors[0].hex}
                    size={24}
                  />
                </div>
                <div className="text-[13px] leading-snug text-ink">{s}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={copyPersona}
          className="font-mono text-[11px] lowercase text-ink-soft transition-colors hover:text-ink"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="inline-block"
            >
              {state === "copied" ? "copied ✓" : "copy persona"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

/* ---------------- 05 In-Product Preview ---------------- */
function PreviewSection({ result }: { result: MockResult }) {
  return (
    <div>
      <SectionLabel>05 / in-product preview</SectionLabel>
      <div className="mt-4 font-serif text-[36px] leading-[1.05] text-ink">
        Where {result.mascot.name} shows up
      </div>
      <InProductPreview result={result} />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
      {children}
    </div>
  )
}

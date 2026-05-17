"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Mascot } from "./mascot"
import type { MockResult } from "@/lib/mock-data"

type Tab = "homepage" | "onboarding" | "support" | "activation"

export function InProductPreview({ result }: { result: MockResult }) {
  const [tab, setTab] = useState<Tab>("homepage")
  const accent = result.colors[0].hex
  const message = result.tabMessages[tab]

  return (
    <div>
      {/* tabs */}
      <div className="mt-6 flex items-center gap-7 border-b border-rule">
        {(["homepage", "onboarding", "support", "activation"] as Tab[]).map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-3 font-mono text-[12px] lowercase transition-colors ${
                active ? "text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              {t}
              {active && (
                <motion.span
                  layoutId="pebble-tab-underline"
                  className="absolute -bottom-px left-0 right-0 h-[2px]"
                  style={{ backgroundColor: accent }}
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* browser frame */}
      <div className="relative mt-8">
        <div className="overflow-hidden border border-ink bg-paper-lift">
          {/* chrome */}
          <div className="flex items-center gap-3 border-b border-rule bg-[#EEE7D7] px-3 py-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-ink/40" />
              <span className="h-2.5 w-2.5 rounded-full border border-ink/40" />
              <span className="h-2.5 w-2.5 rounded-full border border-ink/40" />
            </div>
            <div className="ml-2 flex h-6 flex-1 items-center rounded-sm border border-rule bg-paper px-3 font-mono text-[11px] text-ink-soft">
              https://{result.company.url}
            </div>
          </div>

          {/* page content per tab */}
          <div className="relative min-h-[420px] bg-paper px-10 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {tab === "homepage" && <HomepageView result={result} accent={accent} />}
                {tab === "onboarding" && <OnboardingView result={result} accent={accent} />}
                {tab === "support" && <SupportView result={result} accent={accent} />}
                {tab === "activation" && <ActivationView result={result} accent={accent} />}
              </motion.div>
            </AnimatePresence>

            {/* embedded mascot launcher */}
            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-[240px] border border-ink bg-paper-lift px-3 py-2"
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                    pebble
                  </div>
                  <div className="mt-0.5 text-[13px] leading-snug text-ink">{message}</div>
                </motion.div>
              </AnimatePresence>

              <div
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-ink"
                style={{ backgroundColor: "var(--paper-lift)" }}
              >
                <Mascot mascotKey={result.mascot.key} accent={accent} size={64} />
              </div>
            </div>
          </div>
        </div>

        {/* annotation lines outside frame */}
        <svg
          className="pointer-events-none absolute inset-0 hidden md:block"
          width="100%"
          height="100%"
        >
          <line
            x1="calc(100% - 70px)"
            y1="calc(100% - 50px)"
            x2="calc(100% + 28px)"
            y2="calc(100% - 30px)"
            stroke="#1A1814"
            strokeWidth="1"
          />
          <line
            x1="calc(100% - 100px)"
            y1="calc(100% - 96px)"
            x2="calc(100% + 28px)"
            y2="calc(100% - 130px)"
            stroke="#1A1814"
            strokeWidth="1"
          />
        </svg>
        <div className="pointer-events-none absolute -right-1 top-[calc(100%-140px)] hidden translate-x-full pl-3 md:block">
          <div className="font-mono text-[10px] lowercase text-ink-soft">
            → context: feature discovery
          </div>
        </div>
        <div className="pointer-events-none absolute -right-1 top-[calc(100%-40px)] hidden translate-x-full pl-3 md:block">
          <div className="font-mono text-[10px] lowercase text-ink-soft">
            → appears after 8s idle
          </div>
        </div>
      </div>
    </div>
  )
}

function HomepageView({ result, accent }: { result: MockResult; accent: string }) {
  const navItems = result.previewSurfaces?.navItems ?? ["product", "customers", "pricing", "docs"]
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-serif text-[20px] text-ink">{result.company.name}</div>
        <div className="flex items-center gap-5 font-mono text-[11px] lowercase text-ink-soft">
          {navItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="mt-12 max-w-[600px]">
        <div className="font-serif text-[42px] leading-[1.05] text-ink">
          {result.homepage.hero}
        </div>
        <div className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft">
          {result.homepage.sub}
        </div>
        <button
          className="mt-6 rounded-md px-5 py-2.5 font-mono text-[12px] lowercase text-paper-lift"
          style={{ backgroundColor: accent }}
        >
          {result.homepage.cta} →
        </button>
      </div>

      <div className="mt-14 grid grid-cols-3 gap-6">
        {result.homepage.features.map((f) => (
          <div key={f.title} className="border-t border-rule pt-3">
            <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: accent }}>
              ─
            </div>
            <div className="mt-2 font-serif text-[18px] text-ink">{f.title}</div>
            <div className="mt-1 text-[13px] leading-relaxed text-ink-soft">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OnboardingView({ result, accent }: { result: MockResult; accent: string }) {
  const steps = result.previewSurfaces?.onboardingSteps ?? [
    { title: "Create your workspace", done: true },
    { title: "Invite your first teammate", done: true },
    { title: "Connect a starting tool", done: false },
    { title: "Make your first thing", done: false },
  ]
  return (
    <div className="max-w-[640px]">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        getting started
      </div>
      <div className="mt-2 font-serif text-[28px] text-ink">
        Let&apos;s get {result.company.name} working for you.
      </div>
      <div className="mt-6 space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-4 border border-rule bg-paper-lift px-4 py-3">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full border border-ink font-mono text-[10px]"
              style={{
                backgroundColor: s.done ? accent : "transparent",
                color: s.done ? "#FAF6EC" : "#1A1814",
              }}
            >
              {s.done ? "✓" : i + 1}
            </div>
            <div className="text-[14px] text-ink">{s.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SupportView({ result, accent }: { result: MockResult; accent: string }) {
  const articles = result.previewSurfaces?.supportArticles ?? [
    "How do I invite my team?",
    "Pricing plans, plainly explained",
    "What gets exported, and how",
    "Connecting a domain in 90 seconds",
  ]
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        help center
      </div>
      <div className="mt-2 font-serif text-[28px] text-ink">
        How can we help with {result.company.name}?
      </div>
      <div className="mt-6 flex h-11 max-w-[520px] items-center rounded-md border border-ink bg-paper px-4 font-mono text-[12px] text-ink-soft">
        search the help center…
      </div>
      <div className="mt-8 grid max-w-[720px] grid-cols-2 gap-3">
        {articles.map((a) => (
          <div
            key={a}
            className="border-l-2 bg-paper-lift px-4 py-3 text-[13px] text-ink"
            style={{ borderLeftColor: accent }}
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivationView({ result, accent }: { result: MockResult; accent: string }) {
  const checklist = result.previewSurfaces?.activationChecklist ?? [
    { label: "First teammate invited", done: true },
    { label: "First project created", done: true },
    { label: "First milestone shipped", done: false },
  ]
  return (
    <div className="max-w-[640px]">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        activation
      </div>
      <div className="mt-2 font-serif text-[28px] text-ink">
        You&apos;re close to the good stuff.
      </div>
      <div className="mt-6 space-y-3">
        {checklist.map((c, i) => (
          <div key={i} className="flex items-center gap-4 border border-rule bg-paper-lift px-4 py-3">
            <div
              className="h-3 w-3 rounded-full border border-ink"
              style={{ backgroundColor: c.done ? accent : "transparent" }}
            />
            <div className={`text-[14px] ${c.done ? "text-ink-soft line-through" : "text-ink"}`}>
              {c.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] lowercase" style={{ color: accent }}>
        <span>→ {result.previewSurfaces?.activationUnlockText ?? "unlock home dashboard"}</span>
      </div>
    </div>
  )
}

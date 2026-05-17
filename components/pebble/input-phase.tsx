"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Mascot } from "./mascot"
import { demoOrder, demoPaths } from "@/lib/demo-examples"

type Props = {
  error?: string | null
}

const demoMessage = "Live generation is rate-limited. Try one of the four examples below."

export function InputPhase({ error }: Props) {
  const [url, setUrl] = useState("")
  const [showDemoMessage, setShowDemoMessage] = useState(false)

  function showTooltip() {
    setShowDemoMessage(true)
  }

  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative mx-auto max-w-[1280px] px-6 pt-16 pb-32"
    >
      <div className="grid grid-cols-12 gap-x-8">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            pebble / mascot worksheet / v1.0
          </div>
          <h1 className="mt-6 max-w-[760px] font-serif text-[56px] leading-[1.05] tracking-tight text-ink md:text-[64px]">
            Give your product a{" "}
            <span className="italic text-ink">character</span> people remember.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Pebble studies the brand, then drafts a mascot with a voice, a job, and a place in
            the interface. Not a chatbot bubble. A product companion.
          </p>

          <div className="mt-10 h-px w-full bg-rule" />

          <div className="mt-8">
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
              paste a product url
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                showTooltip()
              }}
              className="mt-3 flex w-full max-w-[560px] items-stretch gap-0"
            >
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Demo mode — try an example below"
                className="h-12 flex-1 rounded-l-md border border-r-0 border-ink bg-paper px-4 font-mono text-[13px] text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="h-12 rounded-r-md bg-ink px-5 font-mono text-[12px] lowercase text-paper-lift transition-colors hover:bg-[#0F0E0B]"
              >
                begin worksheet →
              </button>
            </form>
            {showDemoMessage && (
              <div className="mt-3 max-w-[560px] font-mono text-[11px] lowercase text-ink-soft">
                {demoMessage}
              </div>
            )}
            {error && <div className="mt-3 max-w-[560px] font-mono text-[11px] lowercase text-[#9A3A24]">{error}</div>}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] lowercase text-ink-soft">examples:</span>
              {demoOrder.map((u) => (
                <Link
                  key={u}
                  href={demoPaths[u]}
                  onClick={() => setShowDemoMessage(false)}
                  className="rounded-sm border border-rule bg-paper-lift px-2 py-1 font-mono text-[11px] text-ink transition-colors hover:border-ink"
                >
                  {u}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — specimen card */}
        <div className="col-span-12 mt-16 lg:col-span-5 lg:mt-0">
          <div
            className="relative ml-auto w-full max-w-[420px] origin-top-right -rotate-[1.5deg] border border-rule bg-paper-lift p-6"
          >
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                pebble.specimen / self-portrait
              </div>
              <div className="font-mono text-[10px] text-ink-soft">fig. 01</div>
            </div>

            <div className="dot-grid relative mt-4 flex h-[260px] items-center justify-center overflow-hidden rounded-sm">
              {/* the pebble self */}
              <div className="relative">
                <Mascot mascotKey="default" accent="#C9C2B0" size={170} />
                {/* annotations */}
                <svg
                  className="pointer-events-none absolute inset-0"
                  viewBox="0 0 240 240"
                  width={170}
                  height={170}
                >
                  <path
                    d="M 60 96 Q 30 70 8 60"
                    stroke="#1A1814"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M 168 130 Q 200 130 222 144"
                    stroke="#1A1814"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
                <div className="absolute -left-[140px] -top-2 w-[130px] text-right font-mono text-[10px] leading-tight text-ink-soft">
                  warm cream body
                </div>
                <div className="absolute -right-[120px] top-[58%] w-[110px] font-mono text-[10px] leading-tight text-ink-soft">
                  two-dot eyes
                  <br />
                  tilt: 2°
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="font-mono text-[10px] lowercase text-ink-soft">
                subject: pebble v1.0
              </div>
              <div className="font-mono text-[10px] lowercase text-ink-soft">17.05.26</div>
            </div>
          </div>

          <div className="mt-6 ml-auto max-w-[420px] text-right font-mono text-[10px] lowercase text-ink-soft">
            ↑ pebble draws itself the same way it draws yours
          </div>
        </div>
      </div>

      {/* lower mono note */}
      <div className="mt-24 flex items-center justify-between border-t border-rule pt-4">
        <div className="font-mono text-[10px] lowercase text-ink-soft">
          a mascot your users would actually want to meet
        </div>
      </div>
    </motion.div>
  )
}

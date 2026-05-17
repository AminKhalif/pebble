"use client"

import { PebbleSelf } from "./mascot"

export function PebbleNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <PebbleSelf size={22} />
          <span className="font-serif text-[22px] leading-none text-ink">pebble</span>
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          <a className="text-[13px] text-ink-soft transition-colors hover:text-ink" href="#worksheet">
            Worksheet
          </a>
          <a className="text-[13px] text-ink-soft transition-colors hover:text-ink" href="#examples">
            Examples
          </a>
          <a className="text-[13px] text-ink-soft transition-colors hover:text-ink" href="#notes">
            Notes
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="font-mono text-[12px] lowercase text-ink-soft transition-colors hover:text-ink"
          >
            log in
          </a>
          <a
            href="#"
            className="rounded-full bg-ink px-4 py-1.5 font-mono text-[12px] lowercase text-paper-lift transition-colors hover:bg-[#0F0E0B]"
          >
            request access
          </a>
        </div>
      </div>
    </header>
  )
}

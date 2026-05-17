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
      </div>
    </header>
  )
}

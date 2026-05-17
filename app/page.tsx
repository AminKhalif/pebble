"use client"

import { AnimatePresence } from "framer-motion"
import { PebbleNav } from "@/components/pebble/nav"
import { InputPhase } from "@/components/pebble/input-phase"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-paper">
      <PebbleNav />
      <AnimatePresence mode="wait">
        <InputPhase key="input" />
      </AnimatePresence>
    </main>
  )
}

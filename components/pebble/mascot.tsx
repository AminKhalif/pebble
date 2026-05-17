"use client"

import type React from "react"

export type MascotKey = "mira" | "vector" | "iris" | "sprout" | "default"
export type MascotPose = "default" | "thinking" | "delighted"

type Props = {
  mascotKey: MascotKey
  accent: string
  pose?: MascotPose
  size?: number
  className?: string
  /** when true, body strokes animate in (sketching) */
  sketching?: boolean
  /** when true, hide features for empty/initial state */
  hideFeatures?: boolean
}

const INK = "#1A1814"
const PAPER = "#FAF6EC"

export function Mascot({
  mascotKey,
  accent,
  pose = "default",
  size = 220,
  className,
  sketching = false,
  hideFeatures = false,
}: Props) {
  const drawProps = sketching
    ? ({
        style: {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "pebble-sketch 1.6s ease-out forwards",
        },
      } as React.SVGProps<SVGPathElement>)
    : {}

  const featureOpacity = hideFeatures ? 0 : 1
  const featureStyle: React.CSSProperties = sketching
    ? { opacity: featureOpacity, transition: "opacity 600ms ease 1.2s" }
    : { opacity: featureOpacity }

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {/* sketching keyframes */}
      <defs>
        <style>{`
          @keyframes pebble-sketch {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </defs>

      {mascotKey === "mira" && (
        <MiraBody
          accent={accent}
          pose={pose}
          drawProps={drawProps}
          featureStyle={featureStyle}
        />
      )}
      {mascotKey === "vector" && (
        <VectorBody
          accent={accent}
          pose={pose}
          drawProps={drawProps}
          featureStyle={featureStyle}
        />
      )}
      {mascotKey === "iris" && (
        <IrisBody
          accent={accent}
          pose={pose}
          drawProps={drawProps}
          featureStyle={featureStyle}
        />
      )}
      {mascotKey === "sprout" && (
        <SproutBody
          accent={accent}
          pose={pose}
          drawProps={drawProps}
          featureStyle={featureStyle}
        />
      )}
      {mascotKey === "default" && (
        <DefaultBody
          accent={accent}
          pose={pose}
          drawProps={drawProps}
          featureStyle={featureStyle}
        />
      )}
    </svg>
  )
}

type SubProps = {
  accent: string
  pose: MascotPose
  drawProps: React.SVGProps<SVGPathElement>
  featureStyle: React.CSSProperties
}

/* ---------------- Mira: rounded block, cream, ember cheek ---------------- */
function MiraBody({ accent, pose, drawProps, featureStyle }: SubProps) {
  const eyeY = pose === "delighted" ? 116 : 120
  const mouth =
    pose === "delighted"
      ? "M104 152 Q120 168 136 152"
      : pose === "thinking"
      ? "M108 152 Q120 156 132 150"
      : "M108 152 Q120 158 132 152"
  return (
    <g transform="translate(120 124) rotate(2) translate(-120 -124)">
      {/* ground shadow */}
      <ellipse cx="120" cy="208" rx="58" ry="5" fill={INK} opacity="0.08" />
      {/* body */}
      <path
        d="M64 56 Q64 40 80 40 L160 40 Q176 40 176 56 L176 184 Q176 200 160 200 L80 200 Q64 200 64 184 Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
        {...drawProps}
      />
      {/* cheek wash */}
      <g style={featureStyle}>
        <ellipse cx="92" cy="138" rx="14" ry="6" fill={accent} opacity="0.22" />
        <ellipse cx="148" cy="138" rx="14" ry="6" fill={accent} opacity="0.22" />
        {/* eyes */}
        <circle cx="100" cy={eyeY} r="4.2" fill={INK} />
        <circle cx="140" cy={eyeY} r="4.2" fill={INK} />
        {/* mouth */}
        <path
          d={mouth}
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* tiny page in hand */}
        <rect
          x="158"
          y="170"
          width="22"
          height="16"
          rx="2"
          fill={PAPER}
          stroke={INK}
          strokeWidth="1.6"
          transform="rotate(-8 169 178)"
        />
        <line
          x1="162"
          y1="176"
          x2="174"
          y2="176"
          stroke={INK}
          strokeWidth="1"
          opacity="0.6"
          transform="rotate(-8 169 178)"
        />
        {pose === "thinking" && (
          <text
            x="190"
            y="60"
            fontFamily="var(--font-instrument-serif), serif"
            fontSize="28"
            fill={INK}
          >
            ?
          </text>
        )}
      </g>
    </g>
  )
}

/* ---------------- Vector: arrowhead, indigo, single eye ---------------- */
function VectorBody({ accent, pose, drawProps, featureStyle }: SubProps) {
  return (
    <g transform="translate(120 124) rotate(-4) translate(-120 -124)">
      <ellipse cx="120" cy="206" rx="50" ry="4" fill={INK} opacity="0.08" />
      {/* motion trail */}
      <line
        x1="44"
        y1="124"
        x2="74"
        y2="124"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
        style={featureStyle}
      />
      <line
        x1="44"
        y1="138"
        x2="64"
        y2="138"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.2"
        style={featureStyle}
      />
      {/* arrowhead body */}
      <path
        d="M80 60 L196 120 Q200 122 200 124 Q200 126 196 128 L80 188 Q72 192 72 184 L72 64 Q72 56 80 60 Z"
        fill={accent}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
        {...drawProps}
      />
      {/* highlight */}
      <path
        d="M84 70 L130 100"
        stroke={PAPER}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
        style={featureStyle}
      />
      <g style={featureStyle}>
        {/* single eye */}
        <circle cx="138" cy="124" r="6" fill={PAPER} stroke={INK} strokeWidth="1.6" />
        <circle
          cx={pose === "thinking" ? 140 : 138}
          cy={pose === "delighted" ? 121 : 124}
          r="2.6"
          fill={INK}
        />
        {pose === "thinking" && (
          <text
            x="184"
            y="64"
            fontFamily="var(--font-instrument-serif), serif"
            fontSize="28"
            fill={INK}
          >
            ?
          </text>
        )}
      </g>
    </g>
  )
}

/* ---------------- Iris: rectangle with stripe markings ---------------- */
function IrisBody({ accent, pose, drawProps, featureStyle }: SubProps) {
  const eyeShape =
    pose === "delighted"
      ? { d: "M92 122 Q100 116 108 122" }
      : { d: "M92 122 Q100 126 108 122" }
  const eyeShape2 =
    pose === "delighted"
      ? { d: "M132 122 Q140 116 148 122" }
      : { d: "M132 122 Q140 126 148 122" }
  return (
    <g transform="translate(120 124) rotate(1) translate(-120 -124)">
      <ellipse cx="120" cy="210" rx="48" ry="4" fill={INK} opacity="0.08" />
      {/* body */}
      <rect
        x="74"
        y="44"
        width="92"
        height="160"
        rx="14"
        fill={accent}
        stroke={INK}
        strokeWidth="2.4"
        {...drawProps}
      />
      {/* stripes */}
      <g style={featureStyle}>
        <rect x="74" y="80" width="92" height="6" fill={PAPER} opacity="0.18" />
        <rect x="74" y="124" width="92" height="6" fill={PAPER} opacity="0.18" />
        <rect x="74" y="168" width="92" height="6" fill={PAPER} opacity="0.18" />
        {/* eyes (slits) */}
        <path {...eyeShape} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path {...eyeShape2} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* mouth */}
        <path
          d={pose === "delighted" ? "M112 148 Q120 158 128 148" : "M114 150 Q120 154 126 150"}
          stroke={INK}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {pose === "thinking" && (
          <text
            x="180"
            y="60"
            fontFamily="var(--font-instrument-serif), serif"
            fontSize="28"
            fill={INK}
          >
            ?
          </text>
        )}
      </g>
    </g>
  )
}

/* ---------------- Sprout: leaf shape ---------------- */
function SproutBody({ accent, pose, drawProps, featureStyle }: SubProps) {
  return (
    <g transform="translate(120 124) rotate(-4) translate(-120 -124)">
      <ellipse cx="120" cy="210" rx="46" ry="4" fill={INK} opacity="0.08" />
      {/* stem */}
      <path
        d="M120 38 Q118 50 122 60"
        stroke={INK}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        {...drawProps}
      />
      {/* leaf body — organic, curl on right */}
      <path
        d="M120 60 Q60 80 70 160 Q80 220 130 210 Q200 198 190 130 Q180 70 120 60 Z"
        fill={accent}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
        {...drawProps}
      />
      {/* vein */}
      <path
        d="M122 70 Q126 130 130 200"
        stroke={INK}
        strokeWidth="1.4"
        fill="none"
        opacity="0.35"
        style={featureStyle}
      />
      <g style={featureStyle}>
        {/* eyes */}
        <circle cx="104" cy={pose === "delighted" ? 130 : 134} r="4.4" fill={INK} />
        <circle cx="142" cy={pose === "delighted" ? 130 : 134} r="4.4" fill={INK} />
        {/* highlights */}
        <circle cx="105.4" cy={pose === "delighted" ? 128.6 : 132.6} r="1.2" fill={PAPER} />
        <circle cx="143.4" cy={pose === "delighted" ? 128.6 : 132.6} r="1.2" fill={PAPER} />
        {/* mouth */}
        <path
          d={pose === "delighted" ? "M110 158 Q124 174 138 158" : "M112 158 Q124 168 136 158"}
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        {pose === "thinking" && (
          <text
            x="186"
            y="68"
            fontFamily="var(--font-instrument-serif), serif"
            fontSize="28"
            fill={INK}
          >
            ?
          </text>
        )}
      </g>
    </g>
  )
}

/* ---------------- Default: pebble silhouette ---------------- */
function DefaultBody({ accent, pose, drawProps, featureStyle }: SubProps) {
  return (
    <g transform="translate(120 124) rotate(-2) translate(-120 -124)">
      <ellipse cx="120" cy="200" rx="58" ry="5" fill={INK} opacity="0.08" />
      <path
        d="M58 130 Q56 92 96 76 Q140 60 178 86 Q204 106 196 144 Q188 184 140 192 Q88 198 66 168 Q56 150 58 130 Z"
        fill={accent}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
        {...drawProps}
      />
      <g style={featureStyle}>
        <circle cx="100" cy={pose === "delighted" ? 126 : 130} r="4.4" fill={INK} />
        <circle cx="142" cy={pose === "delighted" ? 126 : 130} r="4.4" fill={INK} />
        <path
          d={pose === "delighted" ? "M104 154 Q122 170 140 154" : "M108 154 Q122 162 136 154"}
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        {pose === "thinking" && (
          <text
            x="184"
            y="70"
            fontFamily="var(--font-instrument-serif), serif"
            fontSize="28"
            fill={INK}
          >
            ?
          </text>
        )}
      </g>
    </g>
  )
}

/* Pebble's own self-portrait — used in nav and specimen-card teaser */
export function PebbleSelf({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
      <path
        d="M10 36 Q8 22 22 16 Q40 8 52 20 Q60 30 56 42 Q50 56 30 56 Q14 56 10 36 Z"
        fill={INK}
      />
      <circle cx="26" cy="34" r="2.4" fill={PAPER} />
      <circle cx="40" cy="34" r="2.4" fill={PAPER} />
    </svg>
  )
}

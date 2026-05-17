import type { PipelineResult } from "./agent/types"

export type MockResult = {
  company: {
    name: string
    url: string
    category: string
    positioning: string
    targetUser: string
  }
  colors: { hex: string; name: string }[]
  tags: string[]
  mascot: {
    key: "mira" | "vector" | "iris" | "sprout" | "default"
    name: string
    species: string
    disposition: string
    description: string
    traits: string[]
    role: string
    annotations: { label: string; target: "body" | "eye" | "corner" | "cheek" }[]
  }
  imagePrompt: string
  imageUrl?: string
  agent?: PipelineResult
  persona: {
    voice: string
    appears: string
    dos: string[]
    donts: string[]
    samples: string[]
  }
  homepage: {
    hero: string
    sub: string
    cta: string
    features: { title: string; desc: string }[]
  }
  tabMessages: {
    homepage: string
    onboarding: string
    support: string
    activation: string
  }
  previewSurfaces?: {
    navItems: string[]
    onboardingSteps: { title: string; done: boolean }[]
    supportArticles: string[]
    activationChecklist: { label: string; done: boolean }[]
    activationUnlockText: string
  }
}

const notion: MockResult = {
  company: {
    name: "Notion",
    url: "notion.so",
    category: "workspace software",
    positioning: "A single space for notes, docs, and the work that happens between them.",
    targetUser: "small teams who want their tools to feel like a calm desk, not a cockpit",
  },
  colors: [
    { hex: "#FF8A65", name: "ember" },
    { hex: "#1A1814", name: "ink" },
    { hex: "#FAF6EC", name: "paper" },
    { hex: "#E8E1D1", name: "stone" },
    { hex: "#3A3530", name: "espresso" },
  ],
  tags: ["warm", "calm", "team-friendly", "considered", "human"],
  mascot: {
    key: "mira",
    name: "Mira",
    species: "block-form companion",
    disposition: "calm and curious",
    description:
      "Mira is built from the same soft block that Notion's pages are. Rounded 32px corners, cream body, a faint cheek blush. She looks like she has been organizing things for hours and is happy about it.",
    traits: ["warm", "patient", "tidy"],
    role: "Mira appears in empty states and quiet moments. She offers to draft, sort, or simply sit while you think.",
    annotations: [
      { label: "cream body / warm cream", target: "body" },
      { label: "two-dot eyes, eye spacing 1.4×", target: "eye" },
      { label: "corner radius: 32px", target: "corner" },
      { label: "cheek tint: ember 18%", target: "cheek" },
    ],
  },
  imagePrompt: `subject: a small block-shaped companion named mira.
shape: rounded square body, corner radius 32px, slight 2° tilt.
palette: cream body (#faf6ec), ink outline (#1a1814), ember cheek wash (#ff8a65 at 18%).
features: two simple dot eyes, soft mouth, no nose, no limbs.
mood: calm, attentive, faintly amused.
finish: matte vector, flat lighting, paper-like grain, no gradient, no glow.
context: standing on a faint dot grid, slight ground shadow.`,
  persona: {
    voice: "quiet, specific, occasionally warm. never breathless.",
    appears: "after 8s idle / empty states / first-run",
    dos: [
      "offer one next step, not three",
      "use the user's words back to them",
      "stay quiet when the user is typing",
    ],
    donts: ["never apologize for existing", "no exclamation stacks", "no emoji"],
    samples: [
      "Want me to walk you through this?",
      "I found the fastest path to setup.",
      "This feature is usually where teams get stuck.",
    ],
  },
  homepage: {
    hero: "One space for notes, docs, and the work in between.",
    sub: "Small teams build their second brain here. Mira keeps the edges tidy.",
    cta: "Start a workspace",
    features: [
      { title: "Docs that link", desc: "Pages reference each other without breaking." },
      { title: "Databases, gently", desc: "A spreadsheet without the spreadsheet feeling." },
      { title: "Templates", desc: "Start from a draft your team already trusts." },
    ],
  },
  tabMessages: {
    homepage: "Want a 30-second tour?",
    onboarding: "I'll get you to your first page. Promise.",
    support: "Stuck? I've seen this one before.",
    activation: "Three small things left, then it's yours.",
  },
}

const linear: MockResult = {
  company: {
    name: "Linear",
    url: "linear.app",
    category: "issue tracking for software teams",
    positioning: "The fastest way to plan, track, and ship product work.",
    targetUser: "small product and engineering teams who care about pace",
  },
  colors: [
    { hex: "#5E6AD2", name: "vector" },
    { hex: "#1A1814", name: "ink" },
    { hex: "#FAF6EC", name: "paper" },
    { hex: "#E8E1D1", name: "stone" },
    { hex: "#2A2D40", name: "graphite" },
  ],
  tags: ["precise", "fast", "minimal", "engineered", "quiet"],
  mascot: {
    key: "vector",
    name: "Vector",
    species: "geometric arrow-form",
    disposition: "precise and direct",
    description:
      "Vector is a single arrowhead with a single eye. The body has a sharp 8° lean forward. Every edge is intentional. He looks like he's already on the way to the next thing.",
    traits: ["precise", "fast", "minimal"],
    role: "Vector shows up in keyboard-shortcut hints and at the end of long flows. He never explains the shortcut twice.",
    annotations: [
      { label: "body angle: 8° forward", target: "body" },
      { label: "single eye, centered", target: "eye" },
      { label: "tip radius: 2px", target: "corner" },
      { label: "highlight: top-left 12%", target: "cheek" },
    ],
  },
  imagePrompt: `subject: a sharp arrowhead character named vector.
shape: triangle leaning 8° forward, tip radius 2px.
palette: indigo body (#5e6ad2), ink outline (#1a1814), single white highlight.
features: one single eye, no mouth, no limbs.
mood: focused, mid-motion, certain.
finish: matte vector, flat lighting, no gradient, no glow.
context: thin baseline ground line, slight motion mark trailing behind.`,
  persona: {
    voice: "short, technical, occasionally dry.",
    appears: "after a shortcut is missed / at the end of long flows",
    dos: ["surface the shortcut", "name the file or branch", "leave once acknowledged"],
    donts: ["never small-talk", "no encouragement copy", "no decorative language"],
    samples: [
      "Cmd K opens the same thing, faster.",
      "This issue's been in review for 3 days.",
      "Your branch is ahead of main by 4 commits.",
    ],
  },
  homepage: {
    hero: "The issue tracker your team will actually keep open.",
    sub: "Plan in cycles. Ship in pull requests. Vector keeps the path short.",
    cta: "Try Linear",
    features: [
      { title: "Cycles", desc: "A rhythm your team can feel without a meeting." },
      { title: "Roadmaps", desc: "Direction without a 40-tab spreadsheet." },
      { title: "Shortcuts", desc: "Every action, one keystroke away." },
    ],
  },
  tabMessages: {
    homepage: "Cmd K to start.",
    onboarding: "Three issues in, you'll feel the rhythm.",
    support: "I can find the issue. What's the keyword?",
    activation: "Two cycles left to graduate the trial.",
  },
}

const stripe: MockResult = {
  company: {
    name: "Stripe",
    url: "stripe.com",
    category: "payments infrastructure",
    positioning: "Financial infrastructure for the internet.",
    targetUser: "developers and finance teams who want payments to feel like one piece of code",
  },
  colors: [
    { hex: "#635BFF", name: "iris" },
    { hex: "#1A1814", name: "ink" },
    { hex: "#FAF6EC", name: "paper" },
    { hex: "#E8E1D1", name: "stone" },
    { hex: "#0A2540", name: "deepwater" },
  ],
  tags: ["calm", "precise", "developer-first", "trusted", "patient"],
  mascot: {
    key: "iris",
    name: "Iris",
    species: "rectangular companion with stripe markings",
    disposition: "calm and reliable",
    description:
      "Iris is a soft-cornered rectangle, a little taller than wide, with three horizontal stripe markings across the body. Eyes are gentle and slightly closed. The whole shape leans 1° to the right, like she's listening.",
    traits: ["calm", "precise", "patient"],
    role: "Iris turns up when something money-shaped happens. A first invoice, a failed charge, a webhook arriving. She speaks plainly and never panics.",
    annotations: [
      { label: "body ratio: 1:1.4", target: "body" },
      { label: "soft eyes, 70% closed", target: "eye" },
      { label: "corner radius: 14px", target: "corner" },
      { label: "stripe count: 3", target: "cheek" },
    ],
  },
  imagePrompt: `subject: a calm rectangular companion named iris.
shape: vertical rectangle with 14px corners, 1° tilt right.
palette: iris body (#635bff), ink outline (#1a1814), three lighter horizontal stripes at 12% lift.
features: gentle slit eyes (70% closed), small mouth, no limbs.
mood: composed, observant, unhurried.
finish: matte vector, flat lighting, no gradient, no glow.
context: thin baseline ground, optional tiny receipt-like rectangle nearby.`,
  persona: {
    voice: "plain, technical, occasionally reassuring.",
    appears: "on first charge / on errors / on webhook arrival",
    dos: ["state what just happened", "show the relevant id", "name the next step once"],
    donts: ["never panic", "no exclamation marks on failures", "no marketing language"],
    samples: [
      "First payment received. id ch_3PqXk2.",
      "That webhook is retrying. No action needed.",
      "Your test card just succeeded. Try a real one when ready.",
    ],
  },
  homepage: {
    hero: "Financial infrastructure, written like good code.",
    sub: "From first dollar to ninth zero, Iris keeps the explanation short.",
    cta: "Start with Stripe",
    features: [
      { title: "Payments", desc: "One integration, every method customers expect." },
      { title: "Billing", desc: "Subscriptions that survive a pricing change." },
      { title: "Connect", desc: "Pay out a marketplace without rebuilding banking." },
    ],
  },
  tabMessages: {
    homepage: "Want to see a charge go through?",
    onboarding: "I'll keep the test keys close.",
    support: "I can read the error. Paste the id?",
    activation: "Two webhooks left, then you're live.",
  },
}

const shopify: MockResult = {
  company: {
    name: "Shopify",
    url: "shopify.com",
    category: "commerce platform",
    positioning: "Make commerce better for everyone.",
    targetUser: "independent makers and growing brands who'd rather sell than configure",
  },
  colors: [
    { hex: "#008060", name: "sprout" },
    { hex: "#1A1814", name: "ink" },
    { hex: "#FAF6EC", name: "paper" },
    { hex: "#E8E1D1", name: "stone" },
    { hex: "#004C3F", name: "moss" },
  ],
  tags: ["cheerful", "grounded", "useful", "warm", "encouraging"],
  mascot: {
    key: "sprout",
    name: "Sprout",
    species: "leaf-form character",
    disposition: "cheerful and grounded",
    description:
      "Sprout is a single leaf with a small stem at the top and a curl on the right edge. Two bright eyes, a tiny mouth, a slight 4° tilt left. The body curves like a real leaf, not a perfect oval.",
    traits: ["cheerful", "encouraging", "useful"],
    role: "Sprout shows up at first sale, first review, first restock. He celebrates small, then gets out of the way.",
    annotations: [
      { label: "body curve: organic, not oval", target: "body" },
      { label: "bright eyes, 1.2× spacing", target: "eye" },
      { label: "stem length: 18px", target: "corner" },
      { label: "tilt: 4° left", target: "cheek" },
    ],
  },
  imagePrompt: `subject: a friendly leaf-shaped character named sprout.
shape: organic leaf silhouette with small stem on top, gentle curl on right edge, 4° left tilt.
palette: sprout body (#008060), darker moss accent (#004c3f), ink outline (#1a1814).
features: two bright dot eyes, small smile, no limbs, light vein line down the middle.
mood: encouraging, grounded, brief.
finish: matte vector, flat lighting, no gradient, no glow.
context: small ground shadow, optional tiny seedling nearby.`,
  persona: {
    voice: "warm, brief, specific to the work.",
    appears: "after first sale / first review / first restock",
    dos: ["name the milestone", "say one useful next thing", "celebrate small"],
    donts: ["no confetti language", "no growth-hacker tone", "no exclamation stacks"],
    samples: [
      "First sale. Your packaging will probably get a compliment.",
      "Three more reviews and the listing changes.",
      "You're low on the navy hoodie. Reorder window: 5 days.",
    ],
  },
  homepage: {
    hero: "The shop that grows with the maker.",
    sub: "From kitchen-table to second warehouse, Sprout marks the milestones worth marking.",
    cta: "Start your store",
    features: [
      { title: "Storefronts", desc: "Built without touching a stylesheet." },
      { title: "Inventory", desc: "Knows what's running out before Friday." },
      { title: "Channels", desc: "Sell where the customers already are." },
    ],
  },
  tabMessages: {
    homepage: "Want me to set up a sample store?",
    onboarding: "Three products in, it starts to feel real.",
    support: "I can find the order. What's the email?",
    activation: "Two settings left, then you can take orders.",
  },
}

const fallback = (url: string): MockResult => {
  const cleaned = url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  const namePart = cleaned.split(".")[0] || "studio"
  const name = namePart.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    company: {
      name,
      url: cleaned || "studio.example",
      category: "software product",
      positioning: "A calm, well-considered product for people doing real work.",
      targetUser: "small teams who care about how their tools feel",
    },
    colors: [
      { hex: "#C25A3D", name: "terra" },
      { hex: "#1A1814", name: "ink" },
      { hex: "#FAF6EC", name: "paper" },
      { hex: "#E8E1D1", name: "stone" },
      { hex: "#3A3530", name: "espresso" },
    ],
    tags: ["calm", "considered", "warm", "useful"],
    mascot: {
      key: "default",
      name: "Pip",
      species: "rounded pebble companion",
      disposition: "quiet and curious",
      description:
        "Pip is a slightly irregular pebble, a little wider than tall, with two soft dot eyes and a tiny smile. The shape is hand-drawn, never a perfect ellipse.",
      traits: ["calm", "curious", "useful"],
      role: "Pip turns up after idle moments. Offers one next step, then steps back.",
      annotations: [
        { label: "irregular pebble shape", target: "body" },
        { label: "two-dot eyes, soft", target: "eye" },
        { label: "no perfect curves", target: "corner" },
        { label: "ground shadow: 8% ink", target: "cheek" },
      ],
    },
    imagePrompt: `subject: a rounded pebble companion named pip.
shape: irregular oval, slightly wider than tall, hand-drawn silhouette.
palette: terra body (#c25a3d), ink outline (#1a1814).
features: two soft dot eyes, tiny smile, no limbs.
mood: quiet, curious, attentive.
finish: matte vector, flat lighting, no gradient, no glow.
context: thin ground shadow, faint dot grid.`,
    persona: {
      voice: "quiet, specific, occasionally warm.",
      appears: "after 8s idle / empty states / first-run",
      dos: ["offer one next step", "use the user's language", "stay quiet when typing"],
      donts: ["no apologizing", "no exclamation stacks", "no emoji"],
      samples: [
        "Want a hand with this part?",
        "I found a faster path through setup.",
        "This is usually where people pause.",
      ],
    },
    homepage: {
      hero: "Software that feels like it was made on purpose.",
      sub: "A calm tool for the kind of work that deserves one.",
      cta: "Get started",
      features: [
        { title: "Considered", desc: "Every screen has a reason to exist." },
        { title: "Quiet", desc: "Notifications you'd actually thank us for." },
        { title: "Useful", desc: "Built around the work, not around the metrics." },
      ],
    },
    tabMessages: {
      homepage: "Want a quick tour?",
      onboarding: "I'll get you to the first useful step.",
      support: "Stuck? Tell me what you tried.",
      activation: "A couple of small steps left.",
    },
  }
}

export function getMockResult(rawUrl: string): MockResult {
  const u = rawUrl.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
  if (u.includes("notion")) return notion
  if (u.includes("linear")) return linear
  if (u.includes("stripe")) return stripe
  if (u.includes("shopify")) return shopify
  return fallback(rawUrl)
}

export const exampleUrls = ["notion.so", "linear.app", "stripe.com", "shopify.com"]

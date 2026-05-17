import type { MockResult } from "@/lib/mock-data"

export const demoExamples: Record<string, MockResult> = {
  "basisset.com": {
    company: {
      name: "Basis Set",
      url: "basisset.com",
      category: "early-stage AI venture capital",
      positioning: "An AI-native venture fund born from the science of minds and machines.",
      targetUser: "pre-seed and seed-stage AI founders who want their first check from people who build",
    },
    colors: [
      { hex: "#000000", name: "ink" },
      { hex: "#FFFFFF", name: "paper" },
      { hex: "#1A1A1A", name: "graphite" },
      { hex: "#E5E5E5", name: "fog" },
      { hex: "#C8B6FF", name: "synapse" },
    ],
    tags: ["clinical", "declarative", "founder-coded", "quietly confident"],
    mascot: {
      key: "default",
      name: "Eigen",
      species: "single coordinate-axis mark",
      disposition: "precise, patient, never theatrical",
      description:
        "Eigen is a small cross-hair with one slightly thicker arm and a single anchored dot at the intersection. The dot is the brain. The arms are the inputs. The whole mark is no larger than a sentence's height. It exists in the margins of the page, not on the stage.",
      traits: ["precise", "patient", "observant"],
      role:
        "Eigen appears in the right margin of portfolio pages and research PDFs. He marks where a founder might click for a deeper read, then disappears. He never speaks first on the homepage hero.",
      annotations: [
        { label: "weighted dot — the brain", target: "body" },
        { label: "thicker arm — the input", target: "corner" },
        { label: "lives in the margin", target: "cheek" },
      ],
    },
    imagePrompt:
      "subject: a small mathematical mark named eigen.\nshape: two perpendicular line segments forming a low-contrast plus, with a single weighted dot at the intersection.\npalette: ink (#000000), paper (#FFFFFF), faint lavender (#C8B6FF) only for the dot.\nfeatures: no eyes, no mouth, no limbs. the mark is the character.\nmood: patient, precise, never decorative.\nfinish: matte vector, single-weight line, no gradient, no glow.\ncontext: lives in the right margin of a research page, beside a footnote.",
    persona: {
      voice: "Eigen speaks the way a partner texts a founder at 11pm: short, specific, no greetings, no closers.",
      appears:
        "On portfolio pages after the founder thesis loads. On research PDFs at the margin of cited claims. At the end of long reads.",
      dos: ["Cite the source.", "Name the partner.", "Leave once acknowledged."],
      donts: ['No "Welcome to Basis Set."', "No exclamation points.", 'No "Hope this helps."'],
      samples: [
        "Pascal wrote this thesis in 2023. It still holds.",
        "Three Fund IV portfolio companies are hiring AI fellows this quarter.",
        "Dr. Lan replies to cold founder emails within 36 hours. Median.",
      ],
    },
    homepage: {
      hero: "Scaling human potential with artificial intelligence.",
      sub: "An AI-native venture fund since 2017, born from the science of minds and machines.",
      cta: "See our research",
      features: [
        { title: "First capital", desc: "When it's just you and your vision, we lead." },
        { title: "AI-native firm", desc: "Built on a modern ML stack. We use the tools you're building." },
        { title: "Founder concierge", desc: "Pascal, Dr. Lan, Rachel, Chang — 24/7." },
      ],
    },
    tabMessages: {
      homepage: "Fund IV: $250M. Closed Jan 2026.",
      onboarding: "Three new portfolio companies this quarter. Want the founder threads?",
      support: "Pascal wrote a thesis on this exact question in 2023. Linking it.",
      activation: "Office hours with Dr. Lan open Tuesdays. Add to calendar?",
    },
    previewSurfaces: {
      navItems: ["Portfolio", "Team", "Research", "Jobs"],
      onboardingSteps: [
        { title: "Read the founder thesis", done: true },
        { title: "Meet Pascal", done: true },
        { title: "Schedule office hours", done: false },
        { title: "Join the AI Fellows Slack", done: false },
      ],
      supportArticles: [
        "What Makes a Successful Founder?",
        "Pricing AI Agents",
        "You Don't Need to be First",
        "The New Moat is the Method",
      ],
      activationChecklist: [
        { label: "Read 3 portfolio theses", done: true },
        { label: "Subscribe to research drops", done: true },
        { label: "Apply to Fund IV deck review", done: false },
      ],
      activationUnlockText: "First-check intro to a Fund IV partner.",
    },
  },

  "app.reve.com": {
    company: {
      name: "Reve",
      url: "app.reve.com",
      category: "generative image platform for creative professionals",
      positioning: "The image model that dreams in your direction.",
      targetUser: "art directors, illustrators, and brand designers who need image generation that respects intent",
    },
    colors: [
      { hex: "#B8A6FF", name: "dream-violet" },
      { hex: "#0A0A0A", name: "canvas-night" },
      { hex: "#F5F5F0", name: "paper" },
      { hex: "#4A3F8F", name: "deep-violet" },
      { hex: "#FFFFFF", name: "white" },
    ],
    tags: ["dreamlike", "exact", "French-restrained", "image-first"],
    mascot: {
      key: "default",
      name: "Songe",
      species: "single floating crescent",
      disposition: "quiet, attentive, never explains the image",
      description:
        "Songe is a soft crescent rendered in dream-violet, no thicker than a brushstroke. He sits in the corner of the canvas while you work. When the image renders, he tilts. When you regenerate, he closes.",
      traits: ["dreaming", "attentive", "exact"],
      role:
        "Songe lives in the lower-right of the canvas, next to the prompt history. He surfaces a single nuance about the last render — never a critique, only a noticing.",
      annotations: [
        { label: "crescent is the eye", target: "eye" },
        { label: "tilts when image renders", target: "body" },
        { label: "watercolor bloom edges", target: "corner" },
      ],
    },
    imagePrompt:
      "subject: a single curved mark named songe.\nshape: a soft crescent, like a closed eye in profile.\npalette: dream-violet (#B8A6FF), paper (#F5F5F0), deep violet shadow (#4A3F8F).\nfeatures: no eyes within the crescent — the crescent itself is an eye. no mouth, no limbs.\nmood: dreaming, attentive, half-asleep.\nfinish: soft brushstroke, slight watercolor bloom at the edges, no hard outline.\ncontext: lives in the corner of a canvas, beside the prompt history.",
    persona: {
      voice: "Songe speaks the way a colorist notes a film — one observation, no commentary.",
      appears:
        "After a render completes. After three regenerations of the same prompt. On the empty canvas state.",
      dos: ["Notice one thing.", "Name the technique.", "Stay short."],
      donts: ['No "Beautiful work!"', "No suggestions unless asked.", "No prompt engineering advice."],
      samples: [
        "The light is coming from the left. You said overhead.",
        "This is the third render in cool tones. Want to try warm?",
        "Saved to project: Soraya / hero / v4.",
      ],
    },
    homepage: {
      hero: "Generate the image you imagined.",
      sub: "Not the average of every image like it.",
      cta: "Start a canvas",
      features: [
        { title: "Intent-aware", desc: "The model holds your reference, not just your prompt." },
        { title: "Canvas-native", desc: "Iterate inside the work, not inside a prompt box." },
        { title: "Project memory", desc: "Songe remembers what you kept, what you killed." },
      ],
    },
    tabMessages: {
      homepage: "You have 14 unfinished canvases. The oldest is from March.",
      onboarding: "Drop a reference. I'll tell you what the model is reading from it.",
      support: "Three renders in cool tones. Want to try warm?",
      activation: "Soraya project hit v12. Worth a snapshot.",
    },
    previewSurfaces: {
      navItems: ["Canvas", "Projects", "References", "Settings"],
      onboardingSteps: [
        { title: "Drop a reference image", done: true },
        { title: "Set your aspect ratio", done: true },
        { title: "Run your first render", done: false },
        { title: "Save to a project", done: false },
      ],
      supportArticles: [
        "How Songe reads your reference",
        "Lighting prompts that work",
        "Project versioning",
        "Exporting at print resolution",
      ],
      activationChecklist: [
        { label: "Complete 5 renders", done: true },
        { label: "Save to a project", done: true },
        { label: "Invite a collaborator", done: false },
      ],
      activationUnlockText: "Unlock high-res export and team canvases.",
    },
  },

  "shopify.com": {
    company: {
      name: "Shopify",
      url: "shopify.com",
      category: "commerce infrastructure for independent businesses",
      positioning: "The commerce platform that scales from your kitchen table to a public listing.",
      targetUser: "independent merchants — from first sale to nine figures",
    },
    colors: [
      { hex: "#008060", name: "shopify-green" },
      { hex: "#002E25", name: "forest" },
      { hex: "#F1F1E8", name: "paper-cream" },
      { hex: "#FFFFFF", name: "white" },
      { hex: "#FFB800", name: "till-amber" },
    ],
    tags: ["plainspoken", "encouraging", "merchant-first", "hustle-aware"],
    mascot: {
      key: "default",
      name: "Til",
      species: "stylized cash drawer, viewed from above",
      disposition: "cheerful, plain, hands-on",
      description:
        "Til is a soft-cornered green square with three small horizontal dividers inside — the slots of an open till. No face. The whole mark is the size of a coin. When a sale happens, Til glints once.",
      traits: ["grounded", "cheerful", "practical"],
      role:
        "Til appears in the admin dashboard, next to the day's sales total. He surfaces small operational wins — a first international sale, a return-customer order, a SKU selling faster than usual.",
      annotations: [
        { label: "three slots — the till", target: "body" },
        { label: "glints on a sale", target: "corner" },
        { label: "coin-sized, never bigger", target: "cheek" },
      ],
    },
    imagePrompt:
      "subject: a small cash-drawer mark named til.\nshape: rounded square, viewed from above, with three horizontal slot dividers inside.\npalette: shopify green body (#008060), deep forest outline (#002E25), paper background (#F1F1E8).\nfeatures: no eyes, no mouth. the slots are the character.\nmood: grounded, cheerful, never theatrical.\nfinish: flat vector, soft drop shadow, no gradient.\ncontext: lives in the top-right of the admin dashboard, beside the day's sales total.",
    persona: {
      voice:
        "Til speaks the way a good bookkeeper texts the owner at end of day: plain numbers, plain words, no celebration unless it's earned.",
      appears:
        "On the admin home after midnight settles the previous day. In the orders view when a noteworthy order lands. In the inventory view when a SKU crosses a threshold.",
      dos: ["Lead with the number.", "Name the SKU or customer.", "Suggest the next action."],
      donts: ['No "Congrats!" on every sale.', "No emoji confetti.", 'No "You\'re crushing it."'],
      samples: [
        "$2,140 yesterday. Up 11% from last Tuesday. Your top SKU was the linen tote.",
        "First order from Portugal. Want me to update your shipping zones?",
        "Maya ordered again. Her fourth this quarter. Worth a thank-you note.",
      ],
    },
    homepage: {
      hero: "Run your store the way you'd run it if you had a CFO who actually liked you.",
      sub: "Sales, inventory, and customers — one screen, plain numbers.",
      cta: "Open today's till",
      features: [
        { title: "Daily snapshot", desc: "Yesterday's numbers, this morning. Without the email." },
        { title: "SKU-level signal", desc: "Til flags the products selling faster than usual." },
        { title: "Customer memory", desc: "Repeat buyers surface themselves." },
      ],
    },
    tabMessages: {
      homepage: "Yesterday: $2,140. The linen tote is on pace to sell out by Thursday.",
      onboarding: "Three SKUs missing weights. Shipping rates will be off until you fix them.",
      support: "Maya's order shipped without tracking. Want me to email her the link?",
      activation: "First international order. Update your shipping zones now or later?",
    },
    previewSurfaces: {
      navItems: ["Home", "Orders", "Products", "Customers", "Analytics"],
      onboardingSteps: [
        { title: "Add your first product", done: true },
        { title: "Set up payments", done: true },
        { title: "Add shipping zones", done: false },
        { title: "Launch your store", done: false },
      ],
      supportArticles: [
        "Setting up international shipping",
        "Reading your daily snapshot",
        "Customer thank-you notes",
        "When to raise your prices",
      ],
      activationChecklist: [
        { label: "First sale", done: true },
        { label: "10 orders shipped", done: true },
        { label: "First repeat customer", done: false },
      ],
      activationUnlockText: "Unlock Shopify Capital and abandoned-cart recovery.",
    },
  },

  "duolingo.com": {
    company: {
      name: "Duolingo",
      url: "duolingo.com",
      category: "gamified language learning",
      positioning: "The world's most stubborn way to learn a language.",
      targetUser: "1B+ monthly learners who came for one lesson and stayed for the streak",
    },
    colors: [
      { hex: "#58CC02", name: "duolingo-green" },
      { hex: "#1CB0F6", name: "macaw-blue" },
      { hex: "#FFC800", name: "bee-yellow" },
      { hex: "#FF4B4B", name: "heart-red" },
      { hex: "#2B70C9", name: "deep-blue" },
    ],
    tags: ["unhinged", "encouraging", "guilt-trip-funny", "internet-native"],
    mascot: {
      key: "default",
      name: "Marg",
      species: "folded notebook-page corner",
      disposition: "dry, observant, slightly judgmental — Duo's straight-man sidekick",
      description:
        "Marg is a folded paper corner in Duolingo green, no bigger than a finger. She has no face — the fold itself is the character. When you're about to lose a streak, the fold deepens. When you finish a lesson, the corner uncurls slightly.",
      traits: ["dry", "observant", "deadpan"],
      role:
        "Marg shows up on the surfaces Duo doesn't own — the streak-broken state, the placement test result, the unsubscribe attempt, the 'did you mean French?' disambiguation. She's the quiet half of Duolingo's voice, where Duo is the loud half.",
      annotations: [
        { label: "fold reads as closed-eye glance", target: "eye" },
        { label: "deepens on streak loss", target: "body" },
        { label: "uncurls on lesson complete", target: "corner" },
      ],
    },
    imagePrompt:
      "subject: a folded notebook corner named marg.\nshape: a dog-eared page corner, triangular fold with one slightly curled edge.\npalette: duolingo green (#58CC02), paper white (#FFFFFF), graphite outline (#2B2B2B).\nfeatures: no eyes, no mouth. the fold itself reads as a closed-eye glance.\nmood: dry, deadpan, quietly amused.\nfinish: flat vector with soft paper-texture grain, no gradient.\ncontext: lives in the lower-left corner of a results page, like a bookmark someone left.",
    persona: {
      voice:
        "Marg speaks the way a librarian texts a regular: dry, specific, never raises her voice. She's funny but she doesn't try to be.",
      appears:
        "On the streak-lost page. On the placement-test results. On the unsubscribe screen. On the 'you've been gone a while' return state.",
      dos: ["State the fact.", "Let the fact land.", "Offer one small next step."],
      donts: ["No emoji.", 'No "We miss you!"', "No guilt-trip — leave that to Duo."],
      samples: [
        "You lost a 47-day streak. Duo is handling it. Want a quieter restart?",
        "You tested at A2 Spanish. You've been studying for 18 months. That's fine. Let's actually finish A2 this time.",
        "Unsubscribing is a 4-tap process. The first tap is here. No notes.",
      ],
    },
    homepage: {
      hero: "Duo handles the encouragement. Marg handles the truth.",
      sub: "The straight-man sidekick for the surfaces Duo can't fix with a push notification.",
      cta: "See where Marg lives",
      features: [
        { title: "Streak-lost states", desc: "Marg shows up where the confetti can't reach." },
        { title: "Placement honesty", desc: "Your results, in a sentence, without the celebration." },
        { title: "Unsubscribe flows", desc: "A four-tap process. Marg counts them." },
      ],
    },
    tabMessages: {
      homepage: "You haven't opened the app in 11 days. Duo is going to send 6 more push notifications. I'm not.",
      onboarding: "You picked French. You've started French four times. Try Spanish?",
      support: "The streak-freeze button is three taps down. I'll wait.",
      activation: "47-day streak. The longest you've ever held. Worth a screenshot.",
    },
    previewSurfaces: {
      navItems: ["Learn", "Stories", "Leaderboards", "Profile"],
      onboardingSteps: [
        { title: "Pick a language", done: true },
        { title: "Take the placement test", done: true },
        { title: "Complete your first lesson", done: false },
        { title: "Set a daily goal you'll actually hit", done: false },
      ],
      supportArticles: [
        "How streak freezes work",
        "Why your placement test result is fine",
        "Turning off push notifications without quitting",
        "What Marg is for",
      ],
      activationChecklist: [
        { label: "7-day streak", done: true },
        { label: "Complete unit 1", done: true },
        { label: "30-day streak", done: false },
      ],
      activationUnlockText: "Unlock Super Duolingo and Marg's quiet mode.",
    },
  },
}

export const demoOrder: string[] = [
  "basisset.com",
  "app.reve.com",
  "shopify.com",
  "duolingo.com",
]

export const demoPaths: Record<string, string> = {
  "basisset.com": "/basis-set",
  "app.reve.com": "/reve",
  "shopify.com": "/shopify",
  "duolingo.com": "/duolingo",
}

export const demoDomainsBySlug: Record<string, string> = {
  "basis-set": "basisset.com",
  reve: "app.reve.com",
  shopify: "shopify.com",
  duolingo: "duolingo.com",
}

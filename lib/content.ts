/**
 * Single source of truth for everything the site says.
 *
 * Copy lives here rather than in components so the narrative can be read,
 * edited and re-paced end to end without touching layout code.
 *
 * House rule: say it once, short. If a paragraph can lose its second sentence
 * and still land, it loses it.
 */

export type VisualKey =
  | "atlas-console"
  | "atlas-before"
  | "atlas-hierarchy"
  | "atlas-product"
  | "verse-column"
  | "verse-archive"
  | "verse-reader"
  | "north-system"
  | "north-drift"
  | "north-tokens"
  | "archive-a"
  | "archive-b"
  | "archive-c"
  | "archive-d"
  | "archive-e"
  | "archive-f";

/** Editorial building blocks. A case study is a sequence of these. */
export type Movement =
  | { kind: "chapter"; label: string; heading: string; body: string[] }
  | { kind: "statement"; text: string; note?: string }
  | {
      kind: "visual";
      visual: VisualKey;
      caption?: string;
      scale?: "wide" | "bleed" | "inset";
      surface?: "paper" | "ink";
    }
  | { kind: "pair"; label: string; items: { label: string; text: string }[] }
  | { kind: "metrics"; items: { value: string; label: string; note?: string }[] }
  | {
      kind: "sequence";
      label: string;
      heading: string;
      steps: { title: string; body: string }[];
    };

export type Project = {
  slug: string;
  index: string;
  name: string;
  discipline: string;
  tagline: string;
  year: string;
  role: string;
  product: string;
  scope: string[];
  outcome: string;
  visual: VisualKey;
  /** One-line hook shown on the case-study opening scene. */
  premise: string;
  movements: Movement[];
};

export const designer = {
  name: "Isha",
  role: "UI/UX Designer",
  statement: "I design digital experiences that make complex things feel simple.",
  supporting:
    "UI/UX Designer focused on creating thoughtful digital products, interfaces, and experiences.",
  location: "Bengaluru, working with teams anywhere",
  email: "hello@isha.design",
  availability:
    "Available for selected product design and creative collaborations.",
  links: [
    { label: "Email", value: "hello@isha.design", href: "mailto:hello@isha.design" },
    { label: "LinkedIn", value: "in/isha-design", href: "https://www.linkedin.com/in/isha-design" },
    { label: "Dribbble", value: "@isha", href: "https://dribbble.com/isha" },
    { label: "Read.cv", value: "isha", href: "https://read.cv/isha" },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Philosophy                                                                */
/* -------------------------------------------------------------------------- */

export const philosophy = {
  statement: [
    "Good design isn't about adding more.",
    "It's about knowing what deserves to stay.",
  ],
  body: [
    "Most products don't fail for want of features. They fail because nobody decided what the thing was for, so every screen ends up carrying a little of everyone's opinion.",
    "My work starts before the interface: find the sentence a product is trying to say, then remove whatever is talking over it.",
  ],
  principles: [
    {
      n: "I",
      title: "Clarity is a decision, not a style",
      body: "A calm screen is the visible end of an argument about priority. I'd rather have that argument early, in words.",
    },
    {
      n: "II",
      title: "Structure before surface",
      body: "Get the information architecture honest and the interface gets smaller. Nothing else rescues it.",
    },
    {
      n: "III",
      title: "Motion is grammar",
      body: "Movement should say where things came from. When it stops doing that, it becomes decoration — and decoration costs attention.",
    },
    {
      n: "IV",
      title: "Design for the tenth time, not the first",
      body: "Demos reward delight. Daily use rewards predictability. I design for the four hundredth visit.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Process                                                                   */
/* -------------------------------------------------------------------------- */

export const process = {
  intro:
    "Rarely linear, never skipped. The loop back to Discover is usually where the work happens.",
  stages: [
    {
      id: "discover",
      name: "Discover",
      duration: "1–2 weeks",
      what: "Shadowing, support tickets, and the spreadsheet everyone secretly uses instead of the product.",
      questions: [
        "Who is actually holding the problem?",
        "What has been tried, and why did it stop?",
      ],
      artifacts: ["Workflow map", "Interview corpus", "Assumption log"],
      decisions:
        "Nothing is decided here. The output is a shared, uncomfortable picture of the real situation.",
    },
    {
      id: "define",
      name: "Define",
      duration: "3–5 days",
      what: "Compressing everything learned into a problem statement short enough to argue with.",
      questions: [
        "What is the one thing that must become true?",
        "What are we explicitly not solving?",
      ],
      artifacts: ["Problem statement", "Success metrics", "Non-goals"],
      decisions:
        "Scope is fixed here, in writing, with the people who can veto it.",
    },
    {
      id: "explore",
      name: "Explore",
      duration: "1–2 weeks",
      what: "Wide and deliberately unattached — three structural bets, not nine versions of one layout.",
      questions: [
        "What would this be if the constraint were removed?",
        "What's the version we'd ship on Friday?",
      ],
      artifacts: ["Concept sets", "IA options", "Flow sketches"],
      decisions:
        "Directions are judged against the problem statement, not against each other's beauty.",
    },
    {
      id: "design",
      name: "Design",
      duration: "2–4 weeks",
      what: "Hierarchy, type, density, states, edge cases — the boring eighty per cent.",
      questions: [
        "What does this look like with a decade of data in it?",
        "Which decisions belong in the system, not the screen?",
      ],
      artifacts: ["High-fidelity flows", "Component specs", "Motion notes"],
      decisions:
        "Made in the open, with the rationale written next to the frame.",
    },
    {
      id: "refine",
      name: "Refine",
      duration: "1–2 weeks",
      what: "Testing with people who have something to lose, then tightening rhythm, timing and copy.",
      questions: [
        "Where did they hesitate, and what did they say out loud?",
        "Which animation is doing work, and which is showing off?",
      ],
      artifacts: ["Usability findings", "Motion spec", "Accessibility pass"],
      decisions:
        "Evidence beats taste. When evidence is silent, taste decides — and I own it.",
    },
    {
      id: "deliver",
      name: "Deliver",
      duration: "Ongoing",
      what: "Reviewing builds in the browser, and staying long enough to see what real use does to the design.",
      questions: [
        "Does the built thing feel like the designed thing?",
        "What should the next person not have to rediscover?",
      ],
      artifacts: ["Build reviews", "System documentation", "Handover"],
      decisions:
        "Finished means the metric moved — or that we learned enough to say honestly that it didn't.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Craft                                                                     */
/* -------------------------------------------------------------------------- */

export const craft = {
  label: "Craft",
  heading: "The parts nobody is supposed to notice.",
  lede: "A finished interface is a stack of quiet decisions. Scroll to take one apart.",
  layers: [
    {
      id: "grid",
      name: "Grid",
      caption: "A 12-column field on a 4px baseline. The data sets the density, not the screen.",
      detail: "12 columns · 24px gutter · 4px baseline",
    },
    {
      id: "typography",
      name: "Typography",
      caption: "Two families, six sizes. Every step earns its place by doing a job no neighbour can.",
      detail: "Serif display · Grotesk UI · Mono metadata",
    },
    {
      id: "color",
      name: "Colour",
      caption: "One neutral ramp carries the interface; a single accent carries meaning.",
      detail: "9-step neutral · 1 accent · AA verified",
    },
    {
      id: "components",
      name: "Components",
      caption: "Designed as states first: rest, hover, focus, active, loading, empty, error, too-much-data.",
      detail: "8 states · documented · keyboard-complete",
    },
    {
      id: "interaction",
      name: "Interaction",
      caption: "Hit targets, focus order, and the invisible geometry that makes a control feel pressable.",
      detail: "44px targets · visible focus · no traps",
    },
    {
      id: "motion",
      name: "Motion",
      caption: "Duration tuned to distance, easing to intent. Everything answers to prefers-reduced-motion.",
      detail: "180–520ms · custom easing · reduced-motion safe",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: "zane-atlas",
    index: "01",
    name: "Zane Atlas",
    discipline: "Product Design",
    tagline:
      "A digital experience designed to make complex workflows feel intuitive.",
    year: "2026",
    role: "Lead Product Designer",
    product: "Operations intelligence platform",
    scope: ["Research", "Information architecture", "Interface design", "Design system"],
    outcome: "Time-to-decision down 41%. Weekly active operators up 2.3×.",
    visual: "atlas-console",
    premise:
      "Eleven screens, four thousand rows, and a team that made every real decision in a spreadsheet nobody had designed.",
    movements: [
      {
        kind: "chapter",
        label: "The Context",
        heading: "The software was working. The people weren't.",
        body: [
          "Zane Atlas monitors industrial supply networks. Eleven years of features, and customers who renewed reliably and complained constantly — never about a screen, always about a feeling: it takes too long to know what's going on.",
        ],
      },
      {
        kind: "visual",
        visual: "atlas-before",
        caption: "Nine days of shadowing. Every path an operator took to answer one question.",
        scale: "wide",
      },
      {
        kind: "chapter",
        label: "The Challenge",
        heading: "Make an eleven-year-old system legible in ten seconds.",
        body: [
          "We couldn't rebuild the platform, drop capabilities a few enormous customers depended on, or retrain thousands of operators. So the brief narrowed: change nothing about what the system can do, and everything about what it says first.",
        ],
      },
      { kind: "statement", text: "The problem wasn't the interface." },
      {
        kind: "visual",
        visual: "atlas-hierarchy",
        caption: "Every element on the legacy overview, ranked by how often anyone acted on it.",
        scale: "bleed",
        surface: "ink",
      },
      {
        kind: "statement",
        text: "It was the way information was organised.",
        note: "Sixty-two elements on the default view. Operators acted on four.",
      },
      {
        kind: "chapter",
        label: "The Insight",
        heading: "Nobody was browsing. Everybody was answering one of six questions.",
        body: [
          "Across thirty-one operators and four sites, the same six questions kept surfacing. The product had been built as a place to look at everything; the work was a queue. That gap explained the spreadsheet — someone's honest attempt to build the missing answer layer by hand.",
        ],
      },
      {
        kind: "pair",
        label: "The reframe",
        items: [
          {
            label: "We had been designing",
            text: "A surface that shows the whole network, neutrally, and lets an expert find what matters.",
          },
          {
            label: "We should have been designing",
            text: "A surface that answers six known questions immediately, then gets out of the expert's way.",
          },
        ],
      },
      {
        kind: "chapter",
        label: "The Direction",
        heading: "One console, six standing answers, everything else on request.",
        body: [
          "The overview leads with resolved sentences — four shipments will miss their window today — that expand into the evidence, then into the underlying rows. One rule held for eight months: nothing enters the default view unless someone acts on it weekly.",
        ],
      },
      {
        kind: "sequence",
        label: "The Evolution",
        heading: "Three structural bets, tested in three weeks.",
        steps: [
          {
            title: "The filtered table",
            body: "Fastest to build, loved by power users, and useless at 6am — the newest operator still faced four thousand undifferentiated rows.",
          },
          {
            title: "The card feed",
            body: "Legible immediately, but it flattened severity: a sensor blip and a port closure looked identical. Abandoned in week two.",
          },
          {
            title: "The answer console",
            body: "Slowest to build, and the only version where a new operator and a ten-year veteran both got what they needed from one screen.",
          },
        ],
      },
      {
        kind: "visual",
        visual: "atlas-product",
        caption: "The console at rest. Answers first, evidence on demand, raw network always reachable.",
        scale: "bleed",
        surface: "ink",
      },
      {
        kind: "chapter",
        label: "The Product",
        heading: "Density that expands rather than shouts.",
        body: [
          "Type carries the hierarchy — three sizes, one accent, no status chips competing for attention. Severity lives in position and weight, so the screen stays calm when the network isn't. Motion does one job: when an answer expands, the evidence grows out of the sentence that summarised it.",
        ],
      },
      {
        kind: "metrics",
        items: [
          { value: "41%", label: "Faster time-to-decision", note: "Median, first exception of shift" },
          { value: "2.3×", label: "Weekly active operators", note: "Six months post-launch" },
          { value: "−54%", label: "Support tickets", note: "'Where do I find…' category" },
          { value: "9 → 2", label: "Onboarding sessions", note: "To independent operation" },
        ],
      },
      {
        kind: "chapter",
        label: "The Impact",
        heading: "The spreadsheet stopped being updated.",
        body: [
          "Four months in, the operations lead mentioned in passing that her team had stopped maintaining the handover spreadsheet — the one that had existed since 2019. That workaround was the most accurate specification anyone ever wrote for this product.",
        ],
      },
    ],
  },
  {
    slug: "verse",
    index: "02",
    name: "Verse",
    discipline: "UX / UI · Editorial",
    tagline: "Turning a forty-year archive into something people actually finish.",
    year: "2025",
    role: "Design Lead",
    product: "Long-form reading platform",
    scope: ["Product strategy", "Editorial systems", "Reading experience", "Typography"],
    outcome: "Completion rate 22% → 61%. Retention up 18 points.",
    visual: "verse-column",
    premise:
      "A magazine with four decades of extraordinary journalism, and readers who opened three paragraphs and left.",
    movements: [
      {
        kind: "chapter",
        label: "The Context",
        heading: "An archive treated as a warehouse.",
        body: [
          "Verse had been publishing serious long-form since 1984. The web product held 11,400 pieces and behaved like a filing cabinet. Editorial were proud of the work; analytics said readers reached paragraph three and left.",
        ],
      },
      { kind: "statement", text: "People weren't failing to read. They were failing to start." },
      {
        kind: "chapter",
        label: "The Challenge",
        heading: "Design for attention that arrives sceptical.",
        body: [
          "A 9,000-word piece asks for something a feed never does: a decision to commit. The product offered nothing to help make it — no sense of length, no sense of shape, no reason this one over the other 11,399.",
        ],
      },
      {
        kind: "visual",
        visual: "verse-archive",
        caption: "Forty years of publishing, mapped by subject rather than by date.",
        scale: "wide",
      },
      {
        kind: "chapter",
        label: "The Insight",
        heading: "Readers wanted to know the shape of the thing before entering it.",
        body: [
          "In eighteen sessions the same behaviour appeared: people scrolled a piece rapidly to the end before reading a word. They weren't skimming — they were surveying. Infinite scroll and lazy-loaded paragraphs had designed away the exact ritual readers used to give themselves permission to start.",
        ],
      },
      {
        kind: "pair",
        label: "The reframe",
        items: [
          {
            label: "The old model",
            text: "Get the reader into the text fast and hope momentum carries them.",
          },
          {
            label: "The new model",
            text: "Show the whole shape first. Commitment is easier when the ask is visible.",
          },
        ],
      },
      {
        kind: "chapter",
        label: "The Direction",
        heading: "Every piece announces its own architecture.",
        body: [
          "Each article opens with a structural overture: reading time, section count, and a thin map of the piece that stays on as a progress spine. The column itself was rebuilt around measure and rhythm — 62 characters, images placed to give the eye a landing every few minutes.",
        ],
      },
      {
        kind: "visual",
        visual: "verse-reader",
        caption: "The reading view. Spine on the left, measure held to 62 characters, everything else removed.",
        scale: "bleed",
        surface: "ink",
      },
      {
        kind: "sequence",
        label: "The Evolution",
        heading: "What we removed, in order.",
        steps: [
          {
            title: "The related-articles rail",
            body: "It lifted pageviews and destroyed completions. Removing it cost 6% of sessions and bought 19 points of finish rate.",
          },
          {
            title: "The floating share bar",
            body: "Hidden until an article was 70% read. Nobody missed it, and sharing went up — people share things they've finished.",
          },
          {
            title: "The tag cloud",
            body: "Replaced with editor-curated paths of four to six pieces that make an argument together.",
          },
        ],
      },
      {
        kind: "metrics",
        items: [
          { value: "61%", label: "Completion rate", note: "From 22% pre-launch" },
          { value: "+18pt", label: "Subscriber retention", note: "12-month cohort" },
          { value: "3.4×", label: "Archive engagement", note: "Pieces older than 5 years" },
          { value: "62ch", label: "Reading measure", note: "Held across every breakpoint" },
        ],
      },
      {
        kind: "chapter",
        label: "The Impact",
        heading: "The archive became the product.",
        body: [
          "Within a year, more than half of all reading time was spent on pieces published before 2015 — work that had been invisible since the day it left the homepage. Subscriptions stopped being justified by what Verse would publish next.",
        ],
      },
    ],
  },
  {
    slug: "northbound",
    index: "03",
    name: "Northbound",
    discipline: "Design Systems · Brand Experience",
    tagline: "One language for eleven products that had stopped speaking to each other.",
    year: "2024",
    role: "Design Systems Lead",
    product: "Multi-product logistics suite",
    scope: ["Design system", "Brand expression", "Governance", "Adoption"],
    outcome: "Eleven products, one system. Design-to-build time down 35%.",
    visual: "north-system",
    premise:
      "Nine years of acquisitions had produced eleven products, seven blues, and four different ideas of what a button is.",
    movements: [
      {
        kind: "chapter",
        label: "The Context",
        heading: "A company that had grown by acquisition and looked like it.",
        body: [
          "Eleven freight products, five of them acquired, each with its own front-end, vocabulary, and confident answer to what shipment means. Customers bought three or four together, and moving between them felt like changing vendors mid-task.",
        ],
      },
      {
        kind: "visual",
        visual: "north-drift",
        caption: "Every primary button in production, sampled in one week.",
        scale: "wide",
      },
      {
        kind: "chapter",
        label: "The Challenge",
        heading: "Unify without a rewrite, and without a mandate.",
        body: [
          "No budget to rebuild eleven front-ends, and nobody willing to force adoption. Two earlier attempts had shipped beautiful libraries that nobody used, for exactly that reason.",
        ],
      },
      { kind: "statement", text: "A design system nobody adopts is a very expensive opinion." },
      {
        kind: "chapter",
        label: "The Insight",
        heading: "The blocker wasn't taste. It was migration cost.",
        body: [
          "Not one team objected to the design. All eleven described the same wall: adopting meant a two-sprint refactor before a single user-facing improvement shipped. The systems had been designed as destinations. They needed to be a road you could walk one step at a time.",
        ],
      },
      {
        kind: "sequence",
        label: "The Direction",
        heading: "A system built for partial adoption.",
        steps: [
          {
            title: "Tokens before components",
            body: "The first release was colour, type, spacing and motion as variables only. Any team could adopt in an afternoon and stop drifting further.",
          },
          {
            title: "Components that accept legacy",
            body: "Every component shipped with an escape hatch, so a team could convert one screen rather than one product.",
          },
          {
            title: "Governance in the open",
            body: "A weekly thirty-minute review, and a public record of what was rejected and why. Contribution beat enforcement.",
          },
        ],
      },
      {
        kind: "visual",
        visual: "north-tokens",
        caption: "The token layer. Every theme, density and brand expression derives from this.",
        scale: "bleed",
        surface: "ink",
      },
      {
        kind: "chapter",
        label: "The Product",
        heading: "A system with a voice, not just a spec.",
        body: [
          "Northbound's brand had been a logo and a blue. The system gave it grammar: a typographic scale with character, one navigational rhythm across every product, and a motion language where the same transition always means the same thing — without any product losing the density its specialists depend on.",
        ],
      },
      {
        kind: "metrics",
        items: [
          { value: "11/11", label: "Products adopted", note: "Within fourteen months" },
          { value: "−35%", label: "Design-to-build time", note: "Measured on new features" },
          { value: "1", label: "Blue", note: "Down from seven" },
          { value: "214", label: "Contributions", note: "From teams outside design" },
        ],
      },
      {
        kind: "chapter",
        label: "The Impact",
        heading: "It outlasted me, which was the brief.",
        body: [
          "Two years on, the system is maintained by a rotating group from the product teams, not a central design org. The weekly review still runs. I measure this work by one thing: whether it survives the departure of the person who built it.",
        ],
      },
    ],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);

/* -------------------------------------------------------------------------- */
/*  Archive                                                                   */
/* -------------------------------------------------------------------------- */

export const archive: {
  year: string;
  name: string;
  discipline: string;
  note: string;
  visual: VisualKey;
}[] = [
  {
    year: "2026",
    name: "Halcyon",
    discipline: "Product Design",
    note: "Sleep therapy, for clinicians and patients at once",
    visual: "archive-a",
  },
  {
    year: "2025",
    name: "Field Notes",
    discipline: "Editorial / Web",
    note: "A publishing tool for researchers who hate publishing tools",
    visual: "archive-b",
  },
  {
    year: "2025",
    name: "Sable",
    discipline: "Brand Experience",
    note: "Identity and digital expression for a furniture maker",
    visual: "archive-c",
  },
  {
    year: "2024",
    name: "Pace",
    discipline: "UX / UI",
    note: "Rebuilding onboarding for a payroll platform",
    visual: "archive-d",
  },
  {
    year: "2024",
    name: "Tessellate",
    discipline: "Design System",
    note: "Components and theming for a civic tech collective",
    visual: "archive-e",
  },
  {
    year: "2023",
    name: "Quarry",
    discipline: "Product Design",
    note: "Search and retrieval for a geological survey archive",
    visual: "archive-f",
  },
];

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

export const about = {
  statement: "I'm interested in the space between people, technology and design.",
  story: [
    "I came to design through a B.Tech in Computer Science at Dayananda Sagar University — a roundabout way of saying I learned what software costs before I learned what it should look like. Knowing which idea is a week and which is a quarter changes what you're willing to argue for.",
    "Since then I've designed for people whose jobs are genuinely hard: operators, clinicians, editors. I'm less drawn to novelty than to the moment a complicated thing becomes obvious and someone stops noticing the software entirely.",
  ],
  facts: [
    { label: "Based in", value: "Bengaluru, India" },
    { label: "Working", value: "Remote, across time zones" },
    { label: "Practice", value: "Product, editorial, systems" },
    { label: "Studied", value: "B.Tech Computer Science, Dayananda Sagar University" },
  ],
  toolkit: [
    "Figma",
    "Framer",
    "After Effects",
    "Rive",
    "Linear",
    "Maze",
    "HTML/CSS",
    "A notebook",
  ],
};

export const beyond = {
  label: "Beyond the work",
  heading: "The things that end up in the work without being invited.",
  items: [
    {
      label: "Currently exploring",
      lines: ["Generative type systems", "Rive for production motion", "Letterpress, badly"],
    },
    {
      label: "Reading",
      lines: ["Thinking with Type — Lupton", "The Craftsman — Sennett", "Piranesi — Clarke"],
    },
    {
      label: "Listening to",
      lines: ["Nala Sinephro", "Hiroshi Yoshimura", "The Comb Radio, on repeat"],
    },
    {
      label: "Inspired by",
      lines: ["Swiss railway signage", "Vignelli's subway map", "My grandmother's recipe index"],
    },
    {
      label: "Learning",
      lines: ["Kannada, slowly", "Bookbinding", "To stop redesigning my own site"],
    },
  ],
};

export const contact = {
  heading: ["Let's make something", "worth remembering."],
  lede: designer.availability,
  note: "Currently booking from March 2026. Two projects at a time.",
};

export const navSections = [
  { id: "deck", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

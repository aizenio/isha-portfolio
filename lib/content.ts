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
  | "atlas-shot-hero"
  | "atlas-shot-services"
  | "atlas-shot-demos"
  | "atlas-shot-process"
  | "atlas-shot-pricing"
  | "atlas-audit"
  | "atlas-system"
  | "swarm-console"
  | "swarm-insights"
  | "swarm-graph"
  | "swarm-research"
  | "swarm-system"
  | "app-ios"
  | "app-night"
  | "app-deck-firstrun"
  | "app-deck-loop"
  | "app-deck-plan"
  | "app-cover"
  | "app-android"
  | "app-parity"
  | "app-research"
  | "app-system"
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
    }
  /**
   * The evidence behind the design. Method on the left, what it actually
   * changed on the right — a findings list that reads as decisions, not as a
   * report nobody opens.
   */
  | {
      kind: "research";
      label: string;
      heading: string;
      lede?: string;
      methods: { method: string; detail: string }[];
      findings: { title: string; body: string }[];
    }
  /**
   * The design system, stated as specification. Rendered in the site's own
   * neutral palette so a project's rules are legible without a second brand
   * arriving on the page.
   */
  | {
      kind: "system";
      label: string;
      heading: string;
      lede?: string;
      /** Rendered as a nine-step neutral ramp plus the accent. */
      ramp?: boolean;
      groups: { title: string; note?: string; items: { name: string; value: string }[] }[];
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
  /** The plate the deck shows, when the opening plate does not crop to a card. */
  cover?: VisualKey;
  /** Shown in the case-study credits when the work is publicly reachable. */
  link?: { label: string; href: string };
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
    discipline: "Brand & Web · Landing Page",
    tagline:
      "One page that has to earn a stranger's trust before they decide to leave.",
    year: "2026",
    role: "Design Lead",
    product: "Agency website — zaneatlas.com",
    scope: ["Positioning research", "Messaging", "Art direction", "Web design", "Design system"],
    outcome: "Qualified enquiries up 3.1×. Half the page, twice the conversion.",
    visual: "atlas-shot-hero",
    link: { label: "zaneatlas.com", href: "https://www.zaneatlas.com" },
    premise:
      "An agency that builds operating systems for other companies, with a homepage that made it sound like every other dev shop on the internet.",
    movements: [
      {
        kind: "chapter",
        label: "The Context",
        heading: "Good work, described in a language buyers had stopped hearing.",
        body: [
          "Zane Atlas builds the machinery behind growing companies: websites, automation, AI in the places it actually pays, internal software, and the pipelines that keep it all shipping. The work is unusually honest — fixed scopes, code the client owns, and a willingness to say no.",
          "None of that survived the homepage. The first screen offered digital solutions for modern business, and the eleven competitors I audited that week offered the same sentence in the same order.",
        ],
      },
      {
        kind: "visual",
        visual: "atlas-audit",
        caption:
          "The message audit. Eleven first screens, coded by claim, against what forty people could recall five seconds later.",
        scale: "wide",
      },
      {
        kind: "chapter",
        label: "The Challenge",
        heading: "Sell a system to someone who has been sold a website before.",
        body: [
          "The buyer is a founder or an operations lead who has already paid for one site that did nothing. They arrive sceptical, on a phone, between two other tasks, and they are not reading — they are deciding whether to keep reading.",
          "So the brief was not visual. It was: what has to be true on the first screen for a burnt buyer to give this page another twenty seconds?",
        ],
      },
      {
        kind: "research",
        label: "The Research",
        heading: "Fourteen buyers, and the same three sentences.",
        lede:
          "Positioning work, not usability work. The question was what people believe before they arrive, not whether they can find the button.",
        methods: [
          { method: "Buyer interviews", detail: "14 founders and ops leads who had bought agency work in the last two years" },
          { method: "Win/loss review", detail: "9 closed enquiries, read against what the site had promised" },
          { method: "Five-second tests", detail: "40 participants, first screen only, one question: what do they sell?" },
          { method: "Competitor audit", detail: "11 homepages, coded for claim, proof and price transparency" },
        ],
        findings: [
          {
            title: "Nobody could repeat the value proposition",
            body: "In the five-second tests, 31 of 40 answered web design. The distinguishing part of the business — automation, internal software, the fact that it comes as one system — never made it into the first impression.",
          },
          {
            title: "Scepticism arrives before the page does",
            body: "Every buyer who had been burnt described the same defence: they scroll for evidence and skip the adjectives. Words like bespoke and cutting-edge were read as a warning sign, not a claim.",
          },
          {
            title: "Silence about money read as expensive",
            body: "Eleven of fourteen said a site with nothing about cost meant a discovery call designed to qualify them out. What they wanted was not a price list — it was to know how pricing works before they spoke to anyone.",
          },
          {
            title: "Ownership was the unexpected closer",
            body: "The line that moved people most in interviews was not about craft. It was that the client keeps the code and the accounts. It had been buried on an internal page.",
          },
        ],
      },
      { kind: "statement", text: "Nobody is buying a website.", note: "They are buying the end of a problem they have been carrying alone." },
      {
        kind: "chapter",
        label: "The Insight",
        heading: "The page was arguing about quality. The buyer was estimating risk.",
        body: [
          "Every agency claims quality, so the claim carries no information. What a sceptical buyer is actually doing is pricing the chance of being let down again — and that is answered with specifics: what you get, by when, for how much, and what happens if it does not work.",
          "That reframed the whole page. Not a portfolio to admire. A risk statement you can read in ninety seconds.",
        ],
      },
      {
        kind: "pair",
        label: "The reframe",
        items: [
          {
            label: "We had been designing",
            text: "A showcase that proves the agency is good, and asks the reader to book a call to find out more.",
          },
          {
            label: "We should have been designing",
            text: "A page that removes every reason to hesitate, in the order those reasons actually occur to a buyer.",
          },
        ],
      },
      {
        kind: "chapter",
        label: "The Direction",
        heading: "One page, ordered by objection.",
        body: [
          "Eight sections, each answering the next question a sceptic asks: what is broken, what you build, does it work, how does it run, what does it cost, why trust you, what if I am unsure. Nothing decorative sits between two of those answers.",
          "Money is answered the way the business actually works. There is no price list, because no two projects are the same — so the page publishes the thing underneath a price instead: a fixed scope, a fixed timeline, a written quote before anything begins, and no hourly billing. Naming the model turned out to do the work the research wanted a number to do.",
          "The tone follows the agency's own: plain sentences, no superlatives, the limitations stated out loud. Where a service could be shown working rather than claimed, it is — the demos section runs the thing in the page.",
        ],
      },
      {
        kind: "visual",
        visual: "atlas-shot-services",
        caption:
          "Live: the services section. Four cards, because the fourth is the one competitors do not offer — and each one is framed as infrastructure rather than a deliverable.",
        scale: "wide",
      },
      {
        kind: "visual",
        visual: "atlas-shot-demos",
        caption:
          "Live: the demos. Where a service could be shown working rather than described, it is — the claim and the proof share a screen.",
        scale: "wide",
      },
      {
        kind: "visual",
        visual: "atlas-shot-pricing",
        caption:
          "Live: the pricing section. Not a price list — the scope, the timeline and the commitment that the number is fixed before anything starts.",
        scale: "wide",
      },
      {
        kind: "sequence",
        label: "The Evolution",
        heading: "Three drafts of the first screen.",
        steps: [
          {
            title: "The manifesto",
            body: "A single beautiful line about building things properly. It tested well with designers and with nobody else — twelve seconds of admiration, then a scroll straight past the services.",
          },
          {
            title: "The service grid",
            body: "Four tiles, all four offerings visible at once. Legible, and completely flat: a buyer with an automation problem read it as a menu and left to compare menus elsewhere.",
          },
          {
            title: "The systems statement",
            body: "Engineered systems for scalable growth, one supporting sentence about systems versus effort, and the proof beginning immediately underneath. It won because it names the thing the buyer cannot get from a freelancer.",
          },
        ],
      },
      {
        kind: "visual",
        visual: "atlas-shot-hero",
        caption:
          "Live: the first screen. One claim, one qualifier, two actions, and the system being sold drawn beside them.",
        scale: "bleed",
        surface: "ink",
      },
      {
        kind: "chapter",
        label: "The Product",
        heading: "Type doing the work that decoration usually does.",
        body: [
          "The page runs on one display face for claims, one grotesk for everything you have to read, and a mono used only for numbers and labels — so a price, a timeline and a section marker are recognisable as facts before they are read.",
          "Motion is limited to arrival: content resolves upward as it enters, once, at 380ms. Nothing loops, nothing parallaxes over text, and the whole page renders and reads with JavaScript disabled.",
        ],
      },
      {
        kind: "visual",
        visual: "atlas-system",
        caption:
          "The system sheet, taken from the built site: Inter and JetBrains Mono, the four text opacities that carry hierarchy, and the three signal colours that mark a category.",
        scale: "wide",
      },
      {
        kind: "system",
        label: "The System",
        heading: "Small enough to hold in your head.",
        lede:
          "A marketing site earns nothing from a hundred components. This one is nine, specified tightly enough that a new section can be built in an afternoon without a designer.",
        ramp: true,
        groups: [
          {
            title: "Type",
            note: "Inter and JetBrains Mono",
            items: [
              { name: "Display", value: "Inter 600 · 58/61 · −1.45px" },
              { name: "Heading", value: "Inter 600 · 44 / 42 / 24" },
              { name: "Body", value: "Inter 400 · 17 / 16 / 15" },
              { name: "Label", value: "JetBrains Mono · 14 · uppercase" },
            ],
          },
          {
            title: "Colour",
            note: "One ground, three signals",
            items: [
              { name: "Ground", value: "#08090B" },
              { name: "Text", value: "White at 100 / 65 / 55 / 40%" },
              { name: "Accent", value: "#7CF5D0 — mint, actions only" },
              { name: "Category", value: "#5B8CFF blue · #F59E0B amber" },
            ],
          },
          {
            title: "Space",
            note: "4px baseline",
            items: [
              { name: "Grid", value: "12 columns · 24px gutter" },
              { name: "Section rhythm", value: "96 / 144 / 192px" },
              { name: "Component padding", value: "8 · 16 · 24 · 40" },
              { name: "Touch target", value: "44px minimum" },
            ],
          },
          {
            title: "Components",
            note: "Nine, fully specified",
            items: [
              { name: "Section header", value: "Label, claim, optional lede" },
              { name: "Proof card", value: "Four states incl. live demo" },
              { name: "Price panel", value: "Three tiers, one recommended" },
              { name: "Enquiry form", value: "Five fields, inline validation" },
            ],
          },
        ],
      },
      {
        kind: "metrics",
        items: [
          { value: "3.1×", label: "Qualified enquiries", note: "Per month, versus the previous site" },
          { value: "−47%", label: "Bounce on first screen", note: "Mobile sessions" },
          { value: "8", label: "Sections, one scroll", note: "Each answers the next objection" },
          { value: "1.2s", label: "Largest contentful paint", note: "Median, 4G, mid-range Android" },
        ],
      },
      {
        kind: "chapter",
        label: "The Impact",
        heading: "The sales call changed shape.",
        body: [
          "The measure that mattered was not traffic. It was that enquiries started arriving with a budget, a deadline and a description of the actual problem — because the page had already answered the three questions that used to consume the first half of every call.",
          "The team now writes new sections against the same rule the research produced: name the objection, or do not add the section.",
        ],
      },
    ],
  },
  {
    slug: "agent-swarm",
    index: "02",
    name: "Agent Swarm",
    discipline: "Product Design · Data",
    tagline:
      "A control tower for five autonomous agents, built so a human stays in charge of them.",
    year: "2025",
    role: "Lead Product Designer",
    product: "Supply chain operations dashboard",
    scope: ["Field research", "Information architecture", "Interface design", "Design system"],
    outcome: "Time-to-decision down 41%. Sixty-two elements on the default view became six.",
    visual: "swarm-console",
    premise:
      "Five agents reading a supply chain in real time, a thousand messages an hour on the bus, and an operator who has to decide whether to believe any of it.",
    movements: [
      {
        kind: "chapter",
        label: "The Context",
        heading: "An event-driven swarm, and a human at the end of it.",
        body: [
          "Agent Swarm watches a supply chain the way a control tower watches airspace. Five agents run independently on a message bus — Demand forecasts, Inventory holds positions and reorder points, Logistics tracks shipments and lanes, Anomaly scores every stream, and the GOD agent reads all of it and produces analysis. Nothing is a pipeline; everything is an event.",
          "The engineering was working. The interface was a stream of everything, which is a way of saying nothing was ranked. An operator watching a thousand messages an hour has the same problem as an operator watching none.",
        ],
      },
      {
        kind: "visual",
        visual: "swarm-graph",
        caption:
          "The bus. No agent calls another directly, so every hop from signal to insight is observable — and had to be legible.",
        scale: "wide",
      },
      {
        kind: "chapter",
        label: "The Challenge",
        heading: "Make an autonomous system legible in ten seconds.",
        body: [
          "Two constraints shaped everything. The GOD agent is read-only by design — it analyses and never mutates state — so the interface could never imply the system had already acted. And an operations lead is judged on shipments, not on model confidence, so a prediction that cannot be checked is worse than no prediction.",
          "The brief narrowed to one sentence: show what the swarm believes, show why, and make the action a person takes obvious.",
        ],
      },
      {
        kind: "research",
        label: "The Research",
        heading: "Thirty-one operators, four sites, one recurring spreadsheet.",
        lede:
          "Freight operations cannot be understood from a screen recording. Most of what we learned came from standing next to people at six in the morning.",
        methods: [
          { method: "Contextual inquiry", detail: "9 days on site across 4 distribution centres, two shifts each" },
          { method: "Task analysis", detail: "31 operators, timed against the questions they answer daily" },
          { method: "Event replay", detail: "18 months of bus traffic, read for which events anyone ever acted on" },
          { method: "Artefact study", detail: "The handover spreadsheet, maintained by hand since 2019" },
        ],
        findings: [
          {
            title: "Nobody was browsing",
            body: "Every session resolved to one of six questions — what will miss its window, what is stuck, which lane is drifting, what changed overnight, what do I reorder, what do I hand to the next shift.",
          },
          {
            title: "Operators acted on four elements out of sixty-two",
            body: "The default overview showed sixty-two pieces of information. Replay over eighteen months showed action taken on four of them. The rest were being read past, every shift, by everyone.",
          },
          {
            title: "Confidence without evidence was ignored",
            body: "A prediction with a percentage attached and nothing underneath it got treated as noise. The same prediction with its inputs — on hand, daily demand, the delayed shipment — got acted on within the shift.",
          },
          {
            title: "The spreadsheet was the real specification",
            body: "The handover sheet did in nine columns what the product could not do in eleven screens. It was the most accurate requirements document anyone had written, and design had never seen it.",
          },
        ],
      },
      {
        kind: "visual",
        visual: "swarm-research",
        caption:
          "Task analysis, ranked. Six questions carried every session; the two at the bottom were the ones the old default view was built for.",
        scale: "wide",
      },
      { kind: "statement", text: "The problem wasn't the interface." },
      {
        kind: "statement",
        text: "It was that nothing on it was ranked.",
        note: "Sixty-two elements on the default view. Operators acted on four.",
      },
      {
        kind: "pair",
        label: "The reframe",
        items: [
          {
            label: "We had been designing",
            text: "A window onto a live system, showing everything it knows, neutrally, as it happens.",
          },
          {
            label: "We should have been designing",
            text: "A surface that answers six known questions immediately, with the evidence one tap beneath each answer.",
          },
        ],
      },
      {
        kind: "chapter",
        label: "The Direction",
        heading: "One console, six standing answers, the swarm underneath.",
        body: [
          "The console leads with four numbers an operations lead is measured on — fill rate, stockouts, inventory, in transit — then the network, then the risk list, worst first. The agent feed stays, but as a rail: it is the audit trail, not the headline.",
          "One rule held for eight months: nothing enters the default view unless someone acts on it weekly. That is what took sixty-two elements down to six.",
        ],
      },
      {
        kind: "visual",
        visual: "swarm-console",
        caption:
          "The console at rest, one tick into a running simulation. Answers first, evidence on request, the bus always reachable.",
        scale: "bleed",
        surface: "ink",
      },
      {
        kind: "chapter",
        label: "The Product",
        heading: "A prediction is only as good as the row underneath it.",
        body: [
          "Every GOD insight opens the same way: what will happen, how likely, and by when. Underneath sits the arithmetic — units on hand, daily demand, the delayed shipment — and beneath that, root cause with each factor's contribution stated as a share rather than a verdict.",
          "Recommendations name their cost. Expedite is ₹1.8L and moves stockout risk from 92% to 24%; rebalancing is cheaper and buys five days. An operator approves one. The swarm never acts on its own, and the interface never suggests otherwise.",
        ],
      },
      {
        kind: "visual",
        visual: "swarm-insights",
        caption:
          "One insight, end to end: prediction, evidence, root cause by contribution, and three actions with their prices attached.",
        scale: "wide",
      },
      {
        kind: "sequence",
        label: "The Evolution",
        heading: "Three structural bets, tested in three weeks.",
        steps: [
          {
            title: "The event stream",
            body: "Truthful, complete, and unusable — a thousand messages an hour reads as weather. Operators watched it the way you watch rain.",
          },
          {
            title: "The agent-first layout",
            body: "One panel per agent, mirroring the architecture. It taught the team's mental model to the user, which is a cost the user should never pay. Abandoned in week two.",
          },
          {
            title: "The answer console",
            body: "Slowest to build, and the only version where a new operator and a ten-year veteran both got what they needed from one screen.",
          },
        ],
      },
      {
        kind: "visual",
        visual: "swarm-system",
        caption:
          "The interface system. The five agent hues double as the severity scale, three densities share one geometry, and the metric card is specified line by line.",
        scale: "wide",
      },
      {
        kind: "system",
        label: "The System",
        heading: "Built for four thousand rows and a night shift.",
        lede:
          "An operations interface is mostly table, mostly state, and mostly read in a hurry. The system specifies those three things properly and leaves the rest alone.",
        ramp: true,
        groups: [
          {
            title: "Density",
            note: "Three modes, one geometry",
            items: [
              { name: "Comfortable", value: "44px row · default" },
              { name: "Compact", value: "32px row · power users" },
              { name: "Condensed", value: "24px row · wall displays" },
              { name: "Baseline", value: "4px, held across all three" },
            ],
          },
          {
            title: "Colour",
            note: "Agent identity doubles as severity",
            items: [
              { name: "Ground / panel", value: "#0B0F14 · #121922" },
              { name: "Demand · excess", value: "#6E8BFF" },
              { name: "Inventory · healthy", value: "#3ECF8E" },
              { name: "Logistics · low", value: "#F5A524" },
              { name: "Anomaly · critical", value: "#FF6B6B" },
              { name: "GOD · insight", value: "#A78BFA" },
            ],
          },
          {
            title: "Severity",
            note: "Position first, colour second",
            items: [
              { name: "Rank", value: "Order in list carries urgency" },
              { name: "Weight", value: "Two type weights, no more" },
              { name: "Colour-blind", value: "Never the sole signal" },
              { name: "Contrast", value: "AA on #0B0F14 at every step" },
            ],
          },
          {
            title: "Data display",
            note: "Numbers you can compare",
            items: [
              { name: "Numerals", value: "Tabular lining, right-aligned" },
              { name: "Time", value: "Relative, absolute on hover" },
              { name: "Truncation", value: "Middle-clipped, full value in title" },
              { name: "Empty", value: "Explains the filter, offers the undo" },
            ],
          },
          {
            title: "Agent surfaces",
            note: "Eight states each",
            items: [
              { name: "Insight card", value: "Prediction, evidence, cause, action" },
              { name: "Activity feed", value: "Per-agent filter, 100-row window" },
              { name: "Recommendation", value: "Always priced, always approvable" },
              { name: "Stale data", value: "Says when it last heard from the bus" },
            ],
          },
        ],
      },
      {
        kind: "metrics",
        items: [
          { value: "41%", label: "Faster time-to-decision", note: "Median, first exception of shift" },
          { value: "62 → 6", label: "Elements on the default view", note: "Nothing stays unless it is acted on weekly" },
          { value: "0", label: "Actions taken without a person", note: "The swarm recommends; an operator approves" },
          { value: "9 → 2", label: "Onboarding sessions", note: "To independent operation" },
        ],
      },
      {
        kind: "chapter",
        label: "The Impact",
        heading: "The spreadsheet stopped being updated.",
        body: [
          "Four months in, the operations lead mentioned in passing that her team had stopped maintaining the handover spreadsheet — the one that had existed since 2019. That workaround was the most accurate specification anyone ever wrote for this product, and the day it went quiet was the day the design was finished.",
        ],
      },
    ],
  },
  {
    slug: "monsoon",
    index: "03",
    name: "Monsoon",
    discipline: "Mobile UI · iOS & Android",
    tagline:
      "A money app for people whose income arrives in seasons, drawn twice — once for each platform.",
    year: "2024",
    role: "Product Designer",
    product: "Cash-flow app — iOS and Android",
    scope: ["Diary study", "iOS & Android UI", "Interaction design", "Mobile design system"],
    outcome: "Day-30 retention 19% → 47%. Rated 4.8 across both stores.",
    visual: "app-ios",
    cover: "app-cover",
    link: {
      label: "The full screen inventory",
      href: "https://claude.ai/code/artifact/c1c01c1c-37b3-4d9b-9180-c574e5ed7cf1",
    },
    premise:
      "Every budgeting app assumes a salary lands on the first. For a designer, a driver or a farmer, that assumption is the whole problem.",
    movements: [
      {
        kind: "chapter",
        label: "The Context",
        heading: "An app built for a paycheque that never arrives.",
        body: [
          "Monsoon began as a conventional budgeting app and behaved like one: monthly envelopes, a spending limit, a red bar when you crossed it. It was downloaded enthusiastically by freelancers, gig drivers and small shop owners, and abandoned by four in five of them within a month.",
          "The people leaving were not undisciplined. They were being told, every month, that they had failed at a shape their income does not have.",
        ],
      },
      {
        kind: "research",
        label: "The Research",
        heading: "Six weeks inside twenty-two people's money.",
        lede:
          "A diary study, because the behaviour we needed to see happens at eleven at night, alone, after a client says the payment will come next week.",
        methods: [
          { method: "Diary study", detail: "22 participants · 6 weeks · voice notes at the moment of a money decision" },
          { method: "Depth interviews", detail: "18 follow-ups, walking back through their own entries" },
          { method: "Usability testing", detail: "5 rounds, on the participant's own phone, one-handed, standing" },
          { method: "Store review mining", detail: "2,400 reviews of nine competitors, coded by complaint" },
        ],
        findings: [
          {
            title: "They budget forward, not backward",
            body: "Not one participant cared what they spent last month. Every decision was about a question the app never answered: will I be alright until the next payment lands?",
          },
          {
            title: "Anxiety peaks at night, on a phone, one-handed",
            body: "Seventy-one per cent of diary entries were logged after 9pm, and seventy-eight per cent one-handed. Anything requiring two hands or careful aim was simply not used.",
          },
          {
            title: "Red is not feedback",
            body: "Overspending alerts caused participants to close the app rather than change behaviour. Four described deleting it after one such notification.",
          },
          {
            title: "Money is already tracked, just not here",
            body: "Everyone had a system — a notes app, a ledger, a message to themselves. Any app asking them to start again lost.",
          },
        ],
      },
      {
        kind: "visual",
        visual: "app-research",
        caption:
          "Six weeks of diary entries by hour, with the grip we observed and the three decisions the study forced.",
        scale: "wide",
      },
      { kind: "statement", text: "People don't want a budget.", note: "They want to know how many days they are safe for." },
      {
        kind: "chapter",
        label: "The Insight",
        heading: "The unit of a month is the bug.",
        body: [
          "Irregular income does not fail against a monthly budget; it fails against the idea of one. The people we followed thought in runway — how long the money in hand lasts at the rate it is actually leaving — and every one of them was computing it in their head, badly, at night.",
          "So Monsoon stopped being a ledger with a calendar attached and became a single number that answers one question, honestly, on the first screen.",
        ],
      },
      {
        kind: "pair",
        label: "The reframe",
        items: [
          {
            label: "We had been designing",
            text: "A budget that divides the month into envelopes and tells you when you have spent too much.",
          },
          {
            label: "We should have been designing",
            text: "A runway that tells you how many days you are safe for, and what would move that number.",
          },
        ],
      },
      {
        kind: "chapter",
        label: "The Direction",
        heading: "One number, thumb-high, always true.",
        body: [
          "The home screen is a count of safe days and the date it runs to. Everything else — what is due, what is owed to you, what would happen if the invoice slips another fortnight — sits beneath it, reachable with one thumb, in the bottom half of a six-inch screen.",
          "Income is entered in three taps and never punished for being late. When a payment slips, the app does not turn red; it recalculates the number and shows the two things that would extend it.",
        ],
      },
      {
        kind: "visual",
        visual: "app-ios",
        caption:
          "The iOS build, captured on an iPhone 17 Pro. Large title, a full-width primary action above the tab bar, and the runway recalculating in place rather than on a confirmation screen.",
        scale: "bleed",
        surface: "ink",
      },
      {
        kind: "visual",
        visual: "app-night",
        caption:
          "Night theme, and the one state that changes colour: under fourteen days the number turns amber. Nothing else on the screen reacts — an alert that shouts gets the app closed.",
        scale: "wide",
      },
      {
        kind: "chapter",
        label: "The Platforms",
        heading: "Drawn twice, on purpose.",
        body: [
          "The deliverable was the interface for both platforms, not one design exported to two stores. Content, copy and order are identical; the grammar is not. iOS gets a large title that collapses, four labelled tabs and a filled button where the thumb already rests. Android gets a fixed top app bar, three destinations with an active indicator, and a floating action button in the corner its users check first.",
          "The iOS side was built as a SwiftUI UI target and reviewed on a device — every screen above is a capture from it, not a rendering. The Android side ships as the parity sheet below, which is what the second team builds against.",
          "Where a platform has an opinion, the platform wins — undo is an inline revert on iOS and a snackbar on Android, because that is what each set of users will look for without being taught.",
        ],
      },
      {
        kind: "visual",
        visual: "app-android",
        caption:
          "The Android build as specified. Same three screens, Material 3 chrome: top app bar, floating action button, navigation bar with an active pill.",
        scale: "wide",
      },
      {
        kind: "visual",
        visual: "app-parity",
        caption:
          "The parity sheet handed to both engineering teams. Every divergence is listed, with the reason it exists.",
        scale: "wide",
      },
      {
        kind: "chapter",
        label: "The Inventory",
        heading: "Every screen, first launch to settings.",
        body: [
          "A runway number is easy to design once. The work is the other fifteen screens that have to agree with it — onboarding that never says the word budget, the tight state, the month, the year read as seasons, and the settings page that decides when the app is allowed to speak.",
          "All of it is drawn on the same nine colour tokens, eight type styles and six components as the build, so a screen that exists only on the canvas still costs nothing to ship.",
        ],
      },
      {
        kind: "visual",
        visual: "app-deck-firstrun",
        caption:
          "A · First run. Three steps, no account, no bank link — and the first screen says money doesn't arrive on the first, because that is the whole premise.",
        scale: "wide",
      },
      {
        kind: "visual",
        visual: "app-deck-loop",
        caption:
          "B · The daily loop. Healthy at 38 days, tight at nine, and the payment being logged. Median session in testing: eleven seconds.",
        scale: "wide",
      },
      {
        kind: "visual",
        visual: "app-deck-plan",
        caption:
          "D · Plan. The month, a bill moved with the delta recalculating live, and the year shown as seasons rather than as twelve equal boxes.",
        scale: "wide",
      },
      {
        kind: "sequence",
        label: "The Evolution",
        heading: "What the phone forced us to give up.",
        steps: [
          {
            title: "The dashboard",
            body: "Six cards of charts, beautiful in the deck, unreadable at arm's length. Replaced with one number and a sentence — the charts moved two taps deep and lost nothing.",
          },
          {
            title: "The bottom sheet stack",
            body: "Sheets over sheets meant people lost their place and pulled down to escape, losing input. Rebuilt as one sheet with in-place steps, so the back gesture always means what it looks like.",
          },
          {
            title: "The streak",
            body: "A daily logging streak lifted week-one numbers and quietly taught people to lie to the app to protect it. Removed in the third build; retention went up without it.",
          },
        ],
      },
      {
        kind: "visual",
        visual: "app-system",
        caption:
          "The mobile system. Reach zones measured on a 6.1-inch device, targets tested to the size that fails, type to 200%, and one component mapped to two platforms.",
        scale: "wide",
      },
      {
        kind: "system",
        label: "The System",
        heading: "A system that fits in one hand.",
        lede:
          "Mobile constraints are not smaller versions of desktop constraints. Reach, thumb size, one-handed grip and a screen read in the dark set every rule here.",
        ramp: true,
        groups: [
          {
            title: "Reach",
            note: "Measured on a 6.1in device",
            items: [
              { name: "Action zone", value: "Bottom 55% of the viewport" },
              { name: "Inert zone", value: "Top third — display only" },
              { name: "Primary action", value: "Never above the fold line" },
              { name: "Gesture", value: "Back always dismisses one layer" },
            ],
          },
          {
            title: "Touch",
            note: "Verified with wet and gloved hands",
            items: [
              { name: "Minimum target", value: "48 × 48dp" },
              { name: "Spacing", value: "8dp between adjacent targets" },
              { name: "Destructive", value: "Requires travel, never a tap" },
              { name: "Haptics", value: "3 patterns, mapped to outcome" },
            ],
          },
          {
            title: "Type",
            note: "Dynamic Type / font scale to 200%",
            items: [
              { name: "Runway", value: "64pt · 700 · tabular" },
              { name: "Body", value: "17pt · 400 · 1.5" },
              { name: "Caption", value: "12pt · mono" },
              { name: "Reflow", value: "No truncation at any scale" },
            ],
          },
          {
            title: "Platform",
            note: "Divergence, listed",
            items: [
              { name: "Primary action", value: "iOS button · Android FAB" },
              { name: "Undo", value: "Inline revert · snackbar" },
              { name: "Navigation", value: "4 tabs · 3 destinations" },
              { name: "Motion", value: "280ms detent · 250ms sheet" },
            ],
          },
        ],
      },
      {
        kind: "metrics",
        items: [
          { value: "47%", label: "Day-30 retention", note: "From 19% before the rebuild" },
          { value: "3", label: "Taps to log income", note: "Down from nine" },
          { value: "4.8", label: "Store rating", note: "iOS and Android, 12k reviews" },
          { value: "100%", label: "Screens at 200% type", note: "No truncation, no horizontal scroll" },
        ],
      },
      {
        kind: "chapter",
        label: "The Impact",
        heading: "The reviews stopped being about features.",
        body: [
          "The change we cared about showed up in the store reviews. They stopped listing what the app has and started describing what it does to an evening: people saying they check the number and then put the phone down.",
          "Two years on, the runway screen has not been redesigned on either platform. Everything since has been built underneath it.",
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
    "Since then I've designed for people whose jobs are genuinely hard: freight operators, founders, and people whose income arrives late. I'm less drawn to novelty than to the moment a complicated thing becomes obvious and someone stops noticing the software entirely.",
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

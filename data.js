/* data.js — single source of truth for all portfolio content.
   All content strings live here. No content in pages.jsx except
   UI labels, section headings, and editorial prose Noah wrote. */

window.NN_DATA = {

  /* ── Projects ───────────────────────────────────────────────────────────
     7 entries. Real projects listed first; coursework-themed placeholders
     fill remaining slots — swap with real titles/blurbs when ready.
     tags: math, modeling, ml, viz, data, sql, algorithms, web, finance,
           ocean, personal
  ─────────────────────────────────────────────────────────────────────── */
  projects: [
    /* ── Real projects ── */
    {
      id: "01",
      slug: "commit-visualizer",
      title: "Commit history visualizer",
      year: 2025,
      tags: ["viz", "web", "data"],
      course: "DSC 106",
      stack: ["D3", "JavaScript", "Scrollama"],
      blurb: "Scrollytelling walkthrough of a Git repo's commit history — scatter by time of day, file unit view by language.",
      role: "solo"
    },
    {
      id: "02",
      slug: "n8n-youtube-pipeline",
      title: "n8n YouTube automation pipeline",
      year: 2024,
      tags: ["ml", "web", "personal"],
      course: "—",
      stack: ["n8n", "JavaScript", "API"],
      blurb: "Automated n8n workflow that takes a topic prompt, calls LLM APIs to draft and refine a script, and outputs a short-form YouTube video explaining the topic.",
      role: "solo"
    },
    {
      id: "03",
      slug: "treasury-scraper",
      title: "Treasury auction rate tracker",
      year: 2024,
      tags: ["data", "finance"],
      course: "—",
      stack: ["Python", "Selenium", "BeautifulSoup"],
      blurb: "Scraper for U.S. Treasury auction results — handles JavaScript-rendered pages, parses HTML tables, and plots yield trends across maturities over time.",
      role: "solo"
    },
    {
      id: "04",
      slug: "lol-predictor",
      title: "League of Legends match predictor",
      year: 2024,
      tags: ["ml", "data"],
      course: "—",
      stack: ["Python", "scikit-learn", "pandas"],
      blurb: "End-to-end ML pipeline on 337,000+ professional match records — feature engineering, Random Forest classifier, and confusion-matrix evaluation.",
      role: "solo"
    },
    {
      id: "05",
      slug: "neural-net-numpy",
      title: "Neural network from scratch",
      year: 2023,
      tags: ["ml"],
      course: "—",
      stack: ["Python", "NumPy"],
      blurb: "Neural network built from scratch in NumPy — forward pass, backprop, and gradient descent — as the capstone for Andrew Ng's ML specialization.",
      role: "solo"
    },
    {
      id: "06",
      slug: "portfolio-site",
      title: "This portfolio",
      year: 2025,
      tags: ["web"],
      course: "DSC 106",
      stack: ["React", "JavaScript"],
      blurb: "Single-page portfolio with six tabs — projects, outside life, resume, and a building-in-public meta page.",
      role: "solo"
    },

    /* ── Coursework placeholders — swap with real blurbs when ready ── */
    {
      id: "07",
      slug: "bikewatching",
      title: "Bikewatching",
      year: 2025,
      tags: ["viz", "data", "web"],
      course: "DSC 106",
      stack: ["Mapbox GL JS", "D3.js", "JavaScript"],
      blurb: "Interactive map of Bluebikes station traffic and bike lane infrastructure across Boston and Cambridge — explore departure/arrival ratios and time-based patterns via a slider.",
      role: "solo"
    },
  ],

  /* ── Experience ─────────────────────────────────────────────────────────
     Move to pages.jsx inline only if you want custom layout per role.
  ─────────────────────────────────────────────────────────────────────── */
  experience: [
    {
      id: "jsoe-it",
      title: "Student Computing Support Technician",
      org: "Jacobs School of Engineering, UC San Diego",
      loc: "San Diego, CA",
      dates: "2023 — Present",
      bullets: [
        "Image and deploy 30+ systems per week — OS installs, driver setup, and required software configuration.",
        "Perform secure data sanitization on hundreds of machines using 3-pass overwrite procedures.",
        "Diagnose and repair hardware and software issues across laptops, desktops, and peripherals.",
        "Maintain inventory and service logs for auditing, lifecycle tracking, and lab readiness.",
      ]
    },
  ],

  /* ── Dives ──────────────────────────────────────────────────────────────
     Newest first. depth/vis in meters, temp in °C, dur in minutes.
  ─────────────────────────────────────────────────────────────────────── */
  dives: [
    {
      n: 1,
      date: "[ dive date ]",
      site: "La Jolla Cove, La Jolla",
      depth: null,
      vis: null,
      temp: null,
      dur: null,
      buddy: "[ buddy ]",
      note: "[ specific note about the dive ]"
    },
  ],

  /* ── Hikes ──────────────────────────────────────────────────────────────
     Newest first. dist in miles, elev in feet, dur in minutes.
  ─────────────────────────────────────────────────────────────────────── */
  hikes: [
    {
      date: "[ date ]",
      trail: "[ trail name ]",
      loc: "Big Sur, CA",
      dist: null, elev: null, dur: null,
      note: "[ specific note about the hike ]"
    },
    {
      date: "[ date ]",
      trail: "[ trail name ]",
      loc: "Sequoia National Park, CA",
      dist: null, elev: null, dur: null,
      note: "[ specific note about the hike ]"
    },
    {
      date: "[ date ]",
      trail: "[ trail name ]",
      loc: "Yosemite National Park, CA",
      dist: null, elev: null, dur: null,
      note: "[ specific note about the hike ]"
    },
    {
      date: "[ date ]",
      trail: "[ trail name ]",
      loc: "Crater Lake, OR",
      dist: null, elev: null, dur: null,
      note: "[ specific note about the hike ]"
    },
    {
      date: "[ date ]",
      trail: "[ trail name ]",
      loc: "Monterey, CA",
      dist: null, elev: null, dur: null,
      note: "[ specific note about the hike ]"
    },
    {
      date: "[ date ]",
      trail: "[ trail name ]",
      loc: "San Diego, CA",
      dist: null, elev: null, dur: null,
      note: "[ specific note about the hike ]"
    },
  ],

  /* ── Commits ────────────────────────────────────────────────────────────
     Newest first. Keep to ~5 most recent (rotate as new work ships).
     Descriptive context paragraphs live inline in pages.jsx → Meta().
  ─────────────────────────────────────────────────────────────────────── */
  commits: [
    { sha: "01672d0", date: "2025-12-31", msg: "revised resume page" },
    { sha: "88a3fd8", date: "2025-11-21", msg: "implemented time slider with commit filtering" },
    { sha: "c72f00a", date: "2025-11-08", msg: "add language breakdown to commit visualizer" },
    { sha: "51a4150", date: "2025-11-08", msg: "fix scatter plot tooltip positioning" },
    { sha: "6606cb1", date: "2025-11-08", msg: "Lab 6 D3 experimentation" },
  ],

  /* All known commit dates — used to populate the 26-week activity grid. */
  allCommitDates: [
    "2025-12-31",
    "2025-11-21",
    "2025-11-08",
    "2025-11-08",
    "2025-11-08",
    "2025-11-01",
    "2025-10-18",
    "2025-10-18",
    "2025-10-10",
    "2025-10-10",
  ],

  /* ── Coursework ─────────────────────────────────────────────────────────
     status: "current" marks in-progress courses.
  ─────────────────────────────────────────────────────────────────────── */
  coursework: [
    { code: "MATH 142B", name: "Introduction to Analysis II",      note: "metric spaces, sequences, series, uniform convergence", status: "current" },
    { code: "DSC 152",   name: "[ course name ]",                  note: "[ course description ]",                                status: "current" },
    { code: "DSC 140A",  name: "Probabilistic ML",                 note: "supervised learning, regression, decision trees" },
    { code: "COGS 181A", name: "Neural Networks",                  note: "perceptrons, backpropagation, CNNs, deep learning" },
    { code: "MATH 180C", name: "Stochastic Processes II",          note: "continuous-time Markov chains, Brownian motion" },
    { code: "MATH 180B", name: "Stochastic Processes I",           note: "Markov chains, Poisson processes" },
    { code: "MATH 180A", name: "Introduction to Probability",      note: "discrete/continuous r.v., expectation, variance" },
    { code: "DSC 106",   name: "Data Visualization",               note: "D3.js, HTML/CSS, visual design principles" },
    { code: "DSC 100",   name: "Data Management",                  note: "SQL, relational databases, query optimization" },
    { code: "DSC 80",    name: "Data Science in Practice",         note: "pandas, data cleaning, visualization" },
    { code: "DSC 40",    name: "Theoretical Foundations II",       note: "algorithms, graph theory, complex analysis" },
  ],

  /* ── Certifications ─────────────────────────────────────────────────────
     symbol is a typographic glyph, not emoji.
  ─────────────────────────────────────────────────────────────────────── */
  certs: [
    {
      id: "ml-spec",
      symbol: "▲",
      name: "Machine Learning Specialization",
      issuer: "Coursera / DeepLearning.AI",
      year: 2026,
      note: "Andrew Ng — supervised learning, neural networks, decision trees"
    },
    {
      id: "ow-scuba",
      symbol: "⊙",
      name: "Open Water Scuba Diver",
      issuer: "PADI",
      year: null,
      note: "Certified for open water diving to 18 m"
    },
  ],

  /* ── Music ──────────────────────────────────────────────────────────────
     A few songs worth sharing. Keep it honest — no filler.
  ─────────────────────────────────────────────────────────────────────── */
  music: [
    { label: "A good recommendation",  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { label: "My mom's favorite song", url: "https://www.youtube.com/watch?v=aGCdLKXNF3w" },
    { label: "Foo Fighters — My Hero", url: "https://www.youtube.com/watch?v=EqWRaAF6_WY" },
  ],

};

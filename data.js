/* data.js — single source of truth for all portfolio content.
   All content strings live here. No content in pages.jsx except
   UI labels, section headings, and editorial prose Noah wrote. */

window.NN_DATA = {

  /* ── Projects ───────────────────────────────────────────────────────────
     9 entries. Real projects listed first.
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
      blurb: "D3 + Scrollama scrollytelling visualization of a Git repository's commit history, with commits plotted by time of day and an animated file-unit view grouped by programming language. Interactive steps reveal how the codebase and contributor activity changed over time.",
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
      blurb: "Automated n8n workflow that takes a topic prompt, chains LLM API calls to draft and refine a script, and assembles a short-form YouTube video explaining the topic — fully hands-off from prompt to upload-ready output.",
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
      blurb: "Three-stage Python pipeline that scrapes TreasuryDirect auction results with Selenium + BeautifulSoup, cleans and dedupes on CUSIP with incremental CSV storage, computes derived yield metrics, and visualizes rate trends with Plotly. Includes an interactive CLI yield calculator.",
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
      blurb: "Match outcome prediction with a RandomForestClassifier and custom feature engineering, including a TeamPerformance class that models in-game power dynamics. Covers data ingestion, train/test evaluation, and feature importance analysis.",
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
      blurb: "Fully connected neural network implemented from scratch in NumPy, including parameter initialization, forward propagation, loss computation, backpropagation, and gradient-descent updates. Built as the capstone for Andrew Ng's Machine Learning Specialization to understand the full training loop without deep-learning frameworks.",
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
      blurb: "This site — built for DSC 106, with project filtering via a clickable pie chart and live search across titles, tags, stack, and course.",
      role: "solo"
    },

    /* ── Additional projects ── */
    {
      id: "07",
      slug: "bikewatching",
      title: "Bikewatching",
      year: 2025,
      tags: ["viz", "data", "web"],
      course: "DSC 106",
      stack: ["Mapbox GL JS", "D3.js", "JavaScript"],
      blurb: "DSC 106 interactive Mapbox and D3 visualization of Bluebikes station traffic and bike-lane infrastructure across Boston and Cambridge. Uses a time slider, departure-to-arrival ratios, and map-based station encoding to expose commuting patterns and changes throughout the day.",
      role: "solo"
    },
    {
      id: "08",
      slug: "hugging-face-rag-indexer",
      title: "Hugging Face RAG indexer",
      year: 2025,
      tags: ["ml", "data", "personal"],
      course: "—",
      stack: ["Python", "Hugging Face", "Transformers"],
      blurb: "End-to-end RAG pipeline: loads PDFs, chunks text, embeds with Hugging Face sentence-transformer models, indexes with FAISS, and retrieves top-k chunks to ground LLM answers. Compared embedding models for retrieval quality and added a Gradio interface for querying.",
      details: "Built an indexing workflow that turns source material into searchable context for retrieval-augmented generation and downstream question answering.",
      features: [
        "Transformer-based document indexing",
        "Semantic retrieval of relevant context",
        "Reusable ingestion workflow for new source material"
      ],
      role: "solo"
    },
    {
      id: "09",
      slug: "america-on-fire",
      title: "America on Fire",
      year: 2025,
      tags: ["viz", "data", "web"],
      course: "DSC 106",
      stack: ["JavaScript", "D3.js", "TopoJSON", "HTML", "CSS"],
      blurb: "DSC 106 group visualization built from 2024 NASA MODIS Active Fire data. Combines a guided story with an interactive D3 map for exploring wildfire intensity by month, state, and county, highlighting seasonal patterns and surprising hotspots through Fire Radiative Power and fire-count metrics.",
      details: "A guided data story and exploratory map for comparing wildfire intensity by month, state, and county, with a presentation mode that highlights surprising fire patterns and hotspots.",
      features: [
        "Guided story revealing unexpected fire patterns and hotspots",
        "U.S. map colored by total Fire Radiative Power (FRP)",
        "State-to-county zoom for local wildfire data",
        "Monthly slider for seasonal fire patterns",
        "Hover tooltips with fire counts and FRP values"
      ],
      dataSources: [
        "NASA MODIS Active Fire Data (2024)",
        "U.S. state and county boundaries (TopoJSON)"
      ],
      url: "https://dylandsouza.com/america-on-fire/",
      linkLabel: "Explore America on Fire",
      role: "group"
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
      date: "recent",
      site: "La Jolla Cove, La Jolla",
      depth: null,
      vis: null,
      temp: null,
      dur: null,
      buddy: "",
      note: "Open Water dive around La Jolla Cove's kelp forests and rocky reef."
    },
  ],

  /* ── Hikes ──────────────────────────────────────────────────────────────
     Newest first. dist in miles, elev in feet, dur in minutes.
  ─────────────────────────────────────────────────────────────────────── */
  hikes: [
    {
      date: "recent",
      trail: "Big Sur coast",
      loc: "Big Sur, CA",
      dist: null, elev: null, dur: null,
      note: "Coastal overlooks, cypress groves, waterfall coves, and long ocean views."
    },
    {
      date: "recent",
      trail: "La Jolla shoreline",
      loc: "San Diego, CA",
      dist: null, elev: null, dur: null,
      note: "Rock shelves, tide pools, and shoreline paths above the water."
    },
    {
      date: "recent",
      trail: "Monterey coast",
      loc: "Monterey, CA",
      dist: null, elev: null, dur: null,
      note: "Rocky coves and cypress-framed views along the central coast."
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
    { code: "DSC 152",   name: "Applied Statistical Data Analysis and Inference", note: "R-based real data analysis, graphics, estimation, testing, regression, inference", status: "current" },
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

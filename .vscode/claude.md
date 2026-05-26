# Noah Neuweg — portfolio

Personal site for **Noah Neuweg**, math & applied data science student at UCSD.
Hosted as a static site on GitHub Pages. This file is the brief for anyone (incl.
me, Claude) extending the site. Read this first.

---

## What the site is

A compact 6-tab portfolio. The structure deliberately mirrors the original site
Noah had before the redesign — **preserve all six tabs and the basic flow**, don't
silently drop or rename pages without asking.

| #  | Tab      | What lives here                                                              |
| -- | -------- | ---------------------------------------------------------------------------- |
| 01 | Home     | Hero, "now" strip, latest 3 projects, about me, quick facts side card        |
| 02 | Projects | All 12 projects with search, year filter, pie chart                          |
| 03 | Outside  | Dives + hikes — photo gallery, stats, dive log, hike log, training, gear     |
| 04 | Resume   | Education, experience, coursework, skills, certs, off-keyboard               |
| 05 | Contact  | Form, directory, status card, reply-window table                             |
| 06 | Meta     | Recent commits w/ context, colophon, 26-week activity grid                   |

Things that were dropped on purpose: **GitHub Profile Stats block** (Noah doesn't
push everything to GitHub, so the numbers misrepresent the work). GitHub link
itself stays in the Contact directory.

---

## Files

```
Portfolio.html            ← the site. Shell, top bar, theme toggle, page router.
pages.jsx                 ← all six page components + shared cards/widgets.
data.js                   ← all content (projects, dives, hikes, certs, commits).
image-slot.js             ← drag-and-drop image placeholder web component.
Portfolio v1.html         ← previous iteration. Keep for reference; do not edit.
Palette Directions.html   ← the six color directions explored. Reference only.
CLAUDE.md                 ← this file.
```

**Single source of truth for content is `data.js`.** No content strings live in
`pages.jsx` other than UI labels (button text, section headings) and editorial
prose Noah explicitly wrote (about me, intros, faq, etc.).

---

## Design system

### Type

- **Display + body**: Bricolage Grotesque (variable, weights 400–700, opsz 12–96).
  Used for everything — hero, headings, body, nav. Hero/headings push opsz toward
  the high end (`font-variation-settings: "opsz" 96`) for tighter, more confident
  letterforms.
- **Mono**: JetBrains Mono — only for small captions, labels, kickers (`N° 01`),
  metadata, table headers, code-ish chips. Never use mono for body copy.
- **No serif. No italic display face.** A previous round tried Fraunces italic
  for accent words — it read "art student wanna-be". Don't bring it back.

### Color (Pine & Sea palette)

The site uses two accents with distinct jobs.

| Token       | Light    | Dark     | Used for                                          |
| ----------- | -------- | -------- | ------------------------------------------------- |
| `--bg`      | #F0EEE5  | #0C151A  | Page background                                   |
| `--paper`   | #FBFAF3  | #131E25  | Cards, side cards, form fields                    |
| `--paper-2` | #F6F4EA  | #182530  | Subtle secondary surface (table headers, banners) |
| `--fg`      | #12222B  | #E8EDEE  | Primary text                                      |
| `--ink`     | #233039  | #C8D1D4  | Body prose (slightly softer than fg)              |
| `--muted`   | #6F7C83  | #7A8A92  | Captions, labels, dim text                        |
| `--rule`    | #CFD6D9  | #233038  | Primary borders                                   |
| `--pine`    | #2D5E3C  | #6AA57A  | **Work / code / hikes / primary CTA**             |
| `--sea`     | #246175  | #6DB4CE  | **Ocean / dives / "Outside" tab accent**          |

`--pine-tint` / `--pine-soft` / `--sea-tint` / `--sea-soft` exist for filled
chips, hover states, and soft outlines. Use these tokens — **never invent new
colors**. If you need an in-between, use `color-mix()` against the tokens.

**The pine/sea split is meaningful.** Pine carries the resume / projects /
hikes / "I do work" side. Sea carries the dives / ocean / Outside side. The
nav reflects this: the Outside tab uses sea blue when active, the other tabs
use pine. Projects tagged `ocean` pick up the sea accent on hover.

### Spacing & rhythm

- Page max-width: **1180px**, padding 36px sides, 28/80 top/bottom.
- Section block padding: **52px top/bottom**, separated by 1px soft rule lines.
- Card padding: **22px** for project cards, **22px / 18px** for side cards.
- Border radius: 8px (chips/buttons), 10–12px (cards), 14px (side cards), 18px (hero panels).
- Grid gaps: 18–22px between cards, 48px between two-column sections.

### Motion

Subtle only.
- 0.3s `fadein` on page change (opacity + 4px translate).
- 0.2s transform on project card hover (`translateY(-2px)`).
- 0.15s color/border transitions on hover.
- A single `pulse` animation on the "open" status dot.
- **No big entrance animations, no parallax, no scroll-jacking.**

### Dark mode

- Toggle lives top right of the topbar (sun/moon SVG button).
- Bootstrapped pre-paint by an inline script in `<head>` to avoid flash.
- Honors `prefers-color-scheme` on first load, then sticks to user's pick via
  `localStorage["nn-theme"]`.
- All colors driven by `[data-theme="light"]` / `[data-theme="dark"]` blocks on
  `:root`. **Don't hardcode hex values in component CSS — always go through
  tokens** so dark mode keeps working.

---

## Adding content

All of these are quick edits in `data.js`. Push, GitHub Pages redeploys, done.

### Add a project

```js
// data.js → window.NN_DATA.projects (array)
{
  id: "13",                        // zero-padded if < 10. Sequential.
  slug: "graph-coloring",          // kebab-case; used in URLs / file inspector
  title: "Graph Coloring Solver",  // sentence case
  year: 2026,                      // number
  tags: ["algorithms", "viz"],     // lowercase. Use existing tags when possible:
                                   // math, modeling, ml, viz, data, sql, algorithms,
                                   // web, finance, ocean, personal
  course: "DSC 40",                // course code or "—" if independent
  stack: ["Python", "NetworkX"],   // 1–4 entries
  blurb: "Branch-and-bound solver with a live visualisation of the search tree.",
                                   // ONE sentence, max ~120 chars. No marketing voice.
  role: "solo"                     // "solo" | "team of N" | "team — my role"
}
```

If the project belongs in **Outside** (i.e. is ocean-related and worth showing
in the dive context), also add `"ocean"` to its tags — the card will pick up
the sea accent automatically.

### Add a dive

```js
// data.js → window.NN_DATA.dives (array, newest first)
{
  n: 37,                              // sequential dive number
  date: "2026-06-04",                 // YYYY-MM-DD
  site: "Catalina, Casino Pt.",       // "place, region"
  depth: 22, vis: 14, temp: 17,       // meters, meters, °C
  dur: 44,                            // minutes
  buddy: "Mara",                      // name, "group", or "solo*" (with the * footnote)
  note: "Saw a soupfin shark on the safety stop. Easily a top-5 dive."
                                      // one or two real sentences. No filler.
}
```

### Add a hike

```js
// data.js → window.NN_DATA.hikes (array, newest first)
{
  date: "2026-06-12",
  trail: "Ramona Overlook",
  loc: "Ramona, CA",
  dist: 6.4,                          // miles
  elev: 1400,                         // feet
  dur: 180,                           // minutes
  note: "Bagged it before the heat. Wildflowers were peaking."
}
```

### Add or swap a photo

The Outside gallery uses `<image-slot>` web components — the user can drag a
photo onto any slot in the browser and it persists. To **add a new slot**:

```js
// pages.jsx → Gallery() → photos array
{
  id: "p-soupfin",                    // unique, kebab-case. Required for persistence.
  shape: "wide",                      // wide | tall | sq | lg  (see CSS for sizes)
  caption: "Soupfin shark · Casino Pt.",
  tag: "dive",                        // "dive" or "hike"
  grad: "linear-gradient(160deg, #1c3a4d, #0c1f2b 65%, #06141d)"
                                      // pre-image placeholder gradient,
                                      // roughly matches the photo's mood
}
```

### Add a commit to the Meta page

```js
// data.js → window.NN_DATA.commits (array, newest first; keep to ~5 most recent)
{ sha: "e4d2a01", date: "2026-06-04", msg: "add catalina dive + soupfin photo" }
```

The descriptive paragraph under each commit lives in `pages.jsx → Meta()` —
just add a new `i === N` line. (Yes, it's positional. Yes, it's ugly. Keep it
to 5 commits and rotate.)

### Add a coursework row, a cert, an experience row

- Coursework: `data.js → coursework`. Keep `code`, `name`, `note` consistent.
- Certifications: `data.js → certs`. Resume page reads from here.
- Experience entries on the resume are still inline in `pages.jsx → Resume()` —
  if Noah accumulates more, move them to `data.js → experience`.

---

## Voice & copy

The hardest part of not looking AI-generated is the writing. Some rules:

- **First person, present tense.** "I build small, careful tools." Not "Noah builds…"
- **One real specific detail per paragraph.** "Saw a soupfin on the safety stop"
  beats "had a great time exploring the kelp forest". Specifics are the whole game.
- **No marketing voice.** Drop "passionate", "leveraging", "impact-driven",
  "cutting-edge", "innovative", "deep dive", "synergies", "ecosystem".
- **No exclamation marks.** None.
- **No emoji** in body copy. (The `▲ ⊙ ◐ ▤ ✉` symbols on cert badges and the
  arrows `→ ↗ ↓` are fine; they're typographic, not pictorial.)
- **Project blurbs are one sentence.** If it doesn't fit in one sentence, the
  blurb isn't clear enough. The detail page is where you elaborate.
- **It's OK to be quiet.** Empty space is a design element. Don't pad to fill it.
- Lowercase for chips, kickers, mono labels (`now`, `building`, `status`).
  Sentence case for everything else.
- Use the en-dash `—` for parenthetical asides ("I came in wanting to do pure
  math — and slowly fell for the messy-data side"). Not the hyphen `-`.

If you need to write copy on Noah's behalf and don't have a real detail to
plug in, **leave a placeholder in brackets** (`[ specific dive site here ]`)
rather than inventing one. Inventing detail is the fastest way to break the
trust the rest of the site is built on.

---

## Things to preserve

These are things Noah specifically wants kept across redesigns. Don't quietly
drop them.

1. **All six tabs.** Home, Projects, Outside, Resume, Contact, Meta. If a new
   tab is needed, ask first.
2. **The pie chart on Projects.** Interactive, click a slice to filter. Stays.
3. **The search box on Projects.** Stays.
4. **The commit log on Meta.** This is "building in public" — it's the whole
   point of the Meta page.
5. **Coursework table on Resume.** With course codes (DSC / MATH).
6. **The 12 project count.** If a project is removed, replace it; don't let the
   count drift.
7. **Dark mode toggle.** Top right of the topbar.
8. **Bricolage Grotesque + JetBrains Mono.** No other fonts.
9. **Pine & Sea accents.** Both. Don't drop sea blue back to a single-accent
   site — the two-tone split is doing real semantic work.
10. **Project names + blurbs are still placeholders** mapped to coursework
    themes. Swap with real ones when Noah supplies them.

---

## Things to avoid (AI-slop checklist)

- Aggressive gradient backgrounds. The hero gradient on Outside is the only one,
  and it's a radial wash that barely registers.
- Hand-drawn SVG illustrations of things. Use `<image-slot>` placeholders.
- Free-form serif italic in headings.
- Rounded-card-with-left-border-accent layouts for content. (The project cards
  reveal a left accent on hover; that's the budget.)
- Overstuffed dashboards. Most pages are one or two columns; the visual rhythm
  comes from typography and gaps, not from cramming widgets.
- Fake stats. If a number isn't real, don't display it.
- Lorem ipsum. Use the bracketed-placeholder style above instead.

---

## Running it

It's a static site. Open `Portfolio.html` directly in a browser, or serve the
folder with anything (`python -m http.server`, `npx serve`, etc.). Deploy by
pushing to GitHub Pages.

There is **no build step** and **no framework install** — React + Babel are
loaded from a pinned CDN inside the HTML. This is intentional. If a build step
is ever added, write it down here.

---

## When in doubt

- Smaller is better than bigger.
- A real one-sentence detail beats three generic ones.
- Match the existing voice. Read three random project blurbs before writing a
  new one.
- Ask Noah before adding pages, fonts, or large content sections.

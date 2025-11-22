import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import scrollama from "https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm";

/* ───────────────────────────────
   1) Load + normalize rows (loc.csv)
   ─────────────────────────────── */
const raw = await d3.csv("./loc.csv", d3.autoType);

function parseDate(r) {
  if (r.datetime) return new Date(r.datetime);                 // preferred (ISO)
  if (r.date && r.time) return new Date(`${r.date}T${r.time}${r.timezone ?? ""}`);
  if (r.date) return new Date(`${r.date}T00:00${r.timezone ?? ""}`);
  return null;
}

/* ───────────────────────────────
   2) Collapse to commit-level rows
   ─────────────────────────────── */
const allCommits = d3.groups(raw, d => d.commit)
  .map(([id, rows]) => {
    const first = rows[0] ?? {};
    const dt = parseDate(first);
    const hour = dt ? dt.getHours() + dt.getMinutes() / 60 : NaN; // 0–24
    const day  = dt ? dt.getDay() : NaN;                           // 0..6 (Sun..Sat)
    return {
      id,
      author: first.author ?? "(unknown)",
      datetime: dt,
      hour,
      day,
      lines: rows.length,   // how many rows this commit touched (loc.csv)
      lineRows: rows,       // keep the underlying line rows for unit viz
    };
  })
  .filter(d => Number.isFinite(d.hour) && Number.isFinite(d.day))
  .sort((a, b) => a.datetime - b.datetime);   // chronological for scrollytelling

console.log("rows in loc.csv:", raw.length, "derived commits:", allCommits.length);

/* ───────────────────────────────
   3) Summary cards (base + extras)
   ─────────────────────────────── */
const uniqueAuthors = new Set(raw.map(d => d.author)).size;
const uniqueFiles   = new Set(raw.map(d => d.file)).size;

d3.select("#stats").html(`
  <div class="stat"><b>Total rows (loc.csv)</b><div class="v">${raw.length}</div></div>
  <div class="stat"><b>Unique commits</b><div class="v">${allCommits.length}</div></div>
  <div class="stat"><b>Unique authors</b><div class="v">${uniqueAuthors}</div></div>
  <div class="stat"><b>Unique files</b><div class="v">${uniqueFiles}</div></div>
`);

const byFile = d3.rollup(
  raw,
  v => ({
    maxLine: d3.max(v, d => d.line ?? 0),
    avgDepth: d3.mean(v, d => d.depth ?? 0),
  }),
  d => d.file
);
const filesArr        = [...byFile.entries()].map(([file, obj]) => ({ file, ...obj }));
const maxFileLen      = d3.max(filesArr, d => d.maxLine) ?? 0;
const longestFile     = (filesArr.find(d => d.maxLine === maxFileLen) ?? {}).file ?? "(unknown)";
const avgFileLen      = d3.mean(filesArr, d => d.maxLine) ?? 0;
const longestLineChar = d3.max(raw, d => d.length ?? 0) ?? 0;
const maxDepth        = d3.max(raw, d => d.depth ?? 0) ?? 0;
const avgDepth        = d3.mean(raw, d => d.depth ?? 0) ?? 0;

function timeBucket(h){ return h < 6 ? "Night" : h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening"; }
const workByTOD = d3.rollup(allCommits, v => d3.sum(v, d => d.lines), d => timeBucket(d.hour));
const topTOD    = [...workByTOD.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "(n/a)";

const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const workByDay = d3.rollup(allCommits, v => d3.sum(v, d => d.lines), d => d.day);
const topDay    = dayLabels[[...workByDay.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0] ?? 0];

const stats = d3.select("#stats");
stats.append("div").attr("class","stat")
  .html(`<b>Max file length</b><div class="v">${maxFileLen}</div><div style="opacity:.7">${longestFile}</div>`);
stats.append("div").attr("class","stat")
  .html(`<b>Avg file length</b><div class="v">${Math.round(avgFileLen)}</div>`);
stats.append("div").attr("class","stat")
  .html(`<b>Longest line (chars)</b><div class="v">${longestLineChar}</div>`);
stats.append("div").attr("class","stat")
  .html(`<b>Max depth</b><div class="v">${maxDepth}</div><div style="opacity:.7">Avg depth: ${avgDepth.toFixed(1)}</div>`);
stats.append("div").attr("class","stat")
  .html(`<b>Most work by time</b><div class="v">${topTOD}</div>`);
stats.append("div").attr("class","stat")
  .html(`<b>Most work by day</b><div class="v">${topDay}</div>`);

/* ───────────────────────────────
   4) Time slider + filtered commits
   ─────────────────────────────── */
let filteredCommits = allCommits.slice();  // start with all
let commitProgress = 100;

const timeScale = d3.scaleTime()
  .domain(d3.extent(allCommits, d => d.datetime))
  .range([0, 100]);

let commitMaxTime = timeScale.invert(commitProgress);

const sliderEl = document.getElementById("commit-progress");
const timeEl   = document.getElementById("commit-time");

function updateTimeLabel() {
  if (!timeEl) return;
  timeEl.textContent = commitMaxTime.toLocaleString("en", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

/* ───────────────────────────────
   5) Scatter: Hour (x) × Weekday (y)
   ─────────────────────────────── */
const svg    = d3.select("#scatter");
const margin = { top: 28, right: 20, bottom: 56, left: 72 };
const W = +svg.attr("width"), H = +svg.attr("height");
const width  = W - margin.left - margin.right;
const height = H - margin.top - margin.bottom;
const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().domain([0,24]).range([0,width]);
const y = d3.scaleBand().domain(d3.range(7)).range([0,height]).padding(0.2);

// radius scale (guard outliers & zeros) – use ALL commits so scale is stable
const q99 = d3.quantile(allCommits.map(d => d.lines).sort(d3.ascending), 0.99) || 1;
const r   = d3.scaleSqrt().domain([1, q99]).range([2, 12]);

// axes
g.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).ticks(12).tickFormat(d => `${d}:00`));

g.append("g").call(d3.axisLeft(y).tickFormat(i => dayLabels[i]));

// horizontal gridlines at weekday centers
g.append("g")
  .attr("stroke", "currentColor").attr("stroke-opacity", 0.08)
  .selectAll("line")
  .data(y.domain())
  .join("line")
  .attr("x1", 0).attr("x2", width)
  .attr("y1", d => y(d) + y.bandwidth()/2)
  .attr("y2", d => y(d) + y.bandwidth()/2);

// axis labels
g.append("text")
  .attr("x", width/2).attr("y", height+40)
  .attr("text-anchor","middle").attr("font-size","12px")
  .text("Hour of day");

g.append("text")
  .attr("x", -height/2).attr("y", -50)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .text("Day of week");

// tooltip
const tooltip = d3.select("#commit-tooltip");
const showTip = (event, d) => {
  tooltip.html(`
    <dt>Commit</dt><dd>${String(d.id).slice(0,7)}</dd>
    <dt>Author</dt><dd>${d.author}</dd>
    <dt>When</dt><dd>${d.datetime?.toLocaleString?.() ?? ""}</dd>
    <dt>Lines</dt><dd>${d.lines}</dd>
    <dt>Hour</dt><dd>${d.hour.toFixed(2)}</dd>
    <dt>Day</dt><dd>${dayLabels[d.day]}</dd>
  `)
  .style("left", (event.pageX + 12) + "px")
  .style("top",  (event.pageY - 18) + "px")
  .attr("hidden", null);
};
const hideTip = () => tooltip.attr("hidden", true);

let dots;
g.append("g").attr("class", "dots");

// (re)render circles for the current filtered commits
function renderDots(data) {
  dots = g.select(".dots")
    .selectAll("circle")
    .data([...data].sort((a,b) => d3.descending(a.lines, b.lines)), d => d.id)
    .join("circle")
      .attr("cx", d => x(d.hour))
      .attr("cy", d => y(d.day) + y.bandwidth()/2)
      .attr("r",  d => r(d.lines))
      .on("mouseenter", showTip)
      .on("mousemove", showTip)
      .on("mouseleave", hideTip);
}

renderDots(filteredCommits);

/* ───────────────────────────────
   6) Selection helpers + language panel
   ─────────────────────────────── */
function isCommitSelected(selection, d) {
  if (!selection) return false;
  const [[x0, y0], [x1, y1]] = selection;
  const cx = x(d.hour), cy = y(d.day) + y.bandwidth()/2;
  return (x0<=cx && cx<=x1 && y0<=cy && cy<=y1);
}

function updateSelectionCount(selection) {
  const n = selection ? filteredCommits.filter(d => isCommitSelected(selection, d)).length : 0;
  d3.select("#selection-count").text(n ? `${n} commit${n>1?"s":""} selected` : "");
}

function langOf(row) {
  if (row.type) return String(row.type).toUpperCase();
  const m = String(row.file || "").match(/\.([a-z0-9]+)$/i);
  const ext = (m ? m[1] : "other").toLowerCase();
  const map = { js:"JS", jsx:"JS", ts:"JS", tsx:"JS", css:"CSS", scss:"CSS", sass:"CSS", html:"HTML", htm:"HTML" };
  return (map[ext] || ext.toUpperCase());
}

function updateLanguageBreakdown(selection) {
  const box = d3.select("#language-breakdown");
  if (!selection) { box.html(""); return; }

  const selectedIds = new Set(filteredCommits.filter(d => isCommitSelected(selection, d)).map(d => d.id));
  if (!selectedIds.size) { box.html(""); return; }

  const rows  = raw.filter(r => selectedIds.has(r.commit));
  const total = rows.length;

  const byLang = d3.rollup(rows, v => v.length, r => langOf(r));
  const items  = [...byLang.entries()].sort((a,b) => b[1]-a[1]);

  box.html("");
  items.forEach(([language, count]) => {
    const pct = d3.format(".1~%")(count / total);
    box.append("dt").text(language);
    box.append("dd").text(`${count} lines (${pct})`);
  });
}

/* ───────────────────────────────
   7) Brushing (smooth; no jitter)
   ─────────────────────────────── */
const brush = d3.brush()
  .extent([[0,0],[width,height]])
  .on("start brush", (event) => {
    const sel = event.selection;
    if (!sel) {                          // no selection → restore default look
      dots.attr("opacity", 0.9);
      d3.select("#selection-count").text("");
      d3.select("#language-breakdown").html("");
      return;
    }
    const [[x0, y0], [x1, y1]] = sel;
    dots.attr("opacity", d => {
      const cx = x(d.hour), cy = y(d.day) + y.bandwidth()/2;
      return (x0<=cx && cx<=x1 && y0<=cy && cy<=y1) ? 1 : 0.15;
    });
    updateSelectionCount(sel);
  })
  .on("end", (event) => {
    updateLanguageBreakdown(event.selection);   // render panel once
  });

// background so you can start a brush anywhere
g.insert("rect", ":first-child")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "none")
  .style("pointer-events", "all");

const brushG = g.append("g").attr("class","brush").call(brush);

brushG.select(".overlay").lower();                           // overlay behind dots
brushG.selectAll(".selection, .handle").style("pointer-events", "none"); // don't block hover
g.select(".dots").raise();

// dblclick to clear selection + UI
svg.on("dblclick", () => {
  brushG.call(brush.move, null);
  dots.attr("opacity", 0.9);
  updateSelectionCount(null);
  updateLanguageBreakdown(null);
});

/* ───────────────────────────────
   8) Size legend (lines edited)
   ─────────────────────────────── */
function sizeLegend({g, scale, title, x, y}) {
  const [min, max] = scale.domain();
  const values = [min, d3.quantile([min,max], .5), max];
  const L = g.append("g").attr("transform", `translate(${x},${y})`);
  L.append("text").attr("x",0).attr("y",-10).attr("font-size","12px").text(title);

  const row = L.selectAll("g").data(values).join("g")
    .attr("transform", (d,i) => `translate(0, ${i*28})`);

  row.append("circle")
    .attr("r", d => scale(d))
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("fill","steelblue").attr("fill-opacity",0.6);

  row.append("text").attr("x", 18).attr("y", 4)
    .text(d => Math.round(d)).attr("font-size","12px");
}
sizeLegend({ g, scale: r, title: "Lines edited", x: width-120, y: 10 });

/* ───────────────────────────────
   9) File unit visualization
   ─────────────────────────────── */
const techColor = d3.scaleOrdinal(d3.schemeTableau10);

function updateFileDisplay() {
  const container = d3.select("#files");
  if (!container.node()) return;

  const lines = filteredCommits.flatMap(d => d.lineRows ?? []);
  if (!lines.length) {
    container.html("");
    return;
  }

  const files = d3.groups(lines, d => d.file)
    .map(([name, lines]) => ({ name, lines }))
    .sort((a, b) => b.lines.length - a.lines.length);

  const filesContainer = container
    .selectAll("div")
    .data(files, d => d.name)
    .join(
      enter => enter.append("div").call(div => {
        div.append("dt").append("code");
        div.append("dd");
      }),
      update => update,
      exit   => exit.remove()
    );

  filesContainer
    .select("dt > code")
    .html(d => `${d.name}<small>${d.lines.length} lines</small>`);

  filesContainer
    .select("dd")
    .selectAll("div")
    .data(d => d.lines)
    .join("div")
    .attr("class", "loc")
    .attr("style", line => `--color: ${techColor(langOf(line))}`);
}

/* ───────────────────────────────
   10) Time filtering logic (slider + scrolly)
   ─────────────────────────────── */
function applyTimeFilter() {
  filteredCommits = allCommits.filter(d => d.datetime <= commitMaxTime);
  renderDots(filteredCommits);
  brushG.call(brush.move, null);
  updateSelectionCount(null);
  updateLanguageBreakdown(null);
  updateFileDisplay();
}

function onTimeSliderChange(event) {
  commitProgress = Number(event.target.value);
  commitMaxTime = timeScale.invert(commitProgress);
  updateTimeLabel();
  applyTimeFilter();
}

if (sliderEl) {
  sliderEl.addEventListener("input", onTimeSliderChange);
}
updateTimeLabel();
applyTimeFilter();

/* ───────────────────────────────
   11) Scrollytelling with Scrollama
   ─────────────────────────────── */
d3.select("#scatter-story")
  .selectAll(".step")
  .data(allCommits)
  .join("div")
  .attr("class", "step")
  .html((d, i) => `
    On ${d.datetime.toLocaleString("en", {
      dateStyle: "full",
      timeStyle: "short",
    })},
    I made a commit that touched <strong>${d.lines}</strong> lines of code.
  `);

function onStepEnter(response) {
  const commit = response.element.__data__;
  commitMaxTime = commit.datetime;
  commitProgress = timeScale(commitMaxTime);
  if (sliderEl) sliderEl.value = commitProgress;
  updateTimeLabel();
  applyTimeFilter();
}

const scroller = scrollama();
scroller
  .setup({
    container: "#scrolly-1",
    step: "#scrolly-1 .step",
    offset: 0.6,
  })
  .onStepEnter(onStepEnter);

window.addEventListener("resize", () => scroller.resize());

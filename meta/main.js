import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/* ───────────────────────────────
   1) Load + normalize rows (loc.csv)
   ─────────────────────────────── */
const raw = await d3.csv("./loc.csv", d3.autoType);

function parseDate(r) {
  if (r.datetime) return new Date(r.datetime);                                  // preferred (ISO)
  if (r.date && r.time) return new Date(`${r.date}T${r.time}${r.timezone ?? ""}`);
  if (r.date) return new Date(`${r.date}T00:00${r.timezone ?? ""}`);
  return null;
}

/* ───────────────────────────────
   2) Collapse to commit-level rows
   ─────────────────────────────── */
const commits = d3
  .groups(raw, d => d.commit)
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
      lines: rows.length, // how many rows the commit touched in loc.csv
    };
  })
  .filter(d => Number.isFinite(d.hour) && Number.isFinite(d.day));

console.log("rows in loc.csv:", raw.length, "derived commits:", commits.length);

/* ───────────────────────────────
   3) Summary cards (base + extras)
   ─────────────────────────────── */
const uniqueAuthors = new Set(raw.map(d => d.author)).size;
const uniqueFiles   = new Set(raw.map(d => d.file)).size;

d3.select("#stats").html(`
  <div class="stat"><b>Total rows (loc.csv)</b><div class="v">${raw.length}</div></div>
  <div class="stat"><b>Unique commits</b><div class="v">${commits.length}</div></div>
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

function timeBucket(h) { return h < 6 ? "Night" : h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening"; }
const workByTOD = d3.rollup(commits, v => d3.sum(v, d => d.lines), d => timeBucket(d.hour));
const topTOD    = [...workByTOD.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "(n/a)";

const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const workByDay = d3.rollup(commits, v => d3.sum(v, d => d.lines), d => d.day);
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
   4) Scatter: Hour (x) × Weekday (y)
   ─────────────────────────────── */
const svg    = d3.select("#scatter");
const margin = { top: 28, right: 20, bottom: 56, left: 72 };
const W = +svg.attr("width"), H = +svg.attr("height");
const width  = W - margin.left - margin.right;
const height = H - margin.top - margin.bottom;
const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().domain([0, 24]).range([0, width]);
const y = d3.scaleBand().domain(d3.range(7)).range([0, height]).padding(0.2);

// radius scale (guard outliers & zeros)
const q99 = d3.quantile(commits.map(d => d.lines).sort(d3.ascending), 0.99) || 1;
const r   = d3.scaleSqrt().domain([1, q99]).range([2, 12]);

// axes
g.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).ticks(12).tickFormat(d => `${d}:00`));

g.append("g")
  .call(d3.axisLeft(y).tickFormat(i => dayLabels[i]));

// horizontal gridlines at weekday centers
g.append("g")
  .attr("stroke", "currentColor")
  .attr("stroke-opacity", 0.08)
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
  .style("position","absolute")
  .style("left", (event.pageX + 12) + "px")
  .style("top",  (event.pageY - 18) + "px")
  .attr("hidden", null);
};
const hideTip = () => tooltip.attr("hidden", true);

// dots (draw big first, small on top for better hover)
const dots = g.append("g").attr("class","dots")
  .attr("fill","steelblue").attr("fill-opacity",0.8)
  .selectAll("circle")
  .data([...commits].sort((a,b) => d3.descending(a.lines, b.lines)))
  .join("circle")
  .attr("cx", d => x(d.hour))
  .attr("cy", d => y(d.day) + y.bandwidth()/2)
  .attr("r",  d => r(d.lines))
  .on("mouseenter", showTip)
  .on("mousemove", showTip)
  .on("mouseleave", hideTip);

/* ───────────────────────────────
   5) Brushing (works with hover)
   ─────────────────────────────── */
const brush = d3.brush()
  .extent([[0,0],[width,height]])
  .on("brush end", ({selection}) => {
    if (!selection) return dots.attr("opacity", 0.9);
    const [[x0,y0],[x1,y1]] = selection;
    dots.attr("opacity", d => {
      const cx = x(d.hour);
      const cy = y(d.day) + y.bandwidth()/2;
      return (x0<=cx && cx<=x1 && y0<=cy && cy<=y1) ? 1 : 0.15;
    });
  });

// transparent background so brush can start anywhere
g.insert("rect", ":first-child")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "none")
  .style("pointer-events", "all");

const brushG = g.append("g").attr("class","brush").call(brush);
// keep overlay behind dots so hover still works
brushG.select(".overlay").lower();
g.select(".dots").raise();

// dblclick to clear selection
svg.on("dblclick", () => {
  brushG.call(brush.move, null);
  dots.attr("opacity", 0.9);
});

/* ───────────────────────────────
   6) Size legend (lines edited)
   ─────────────────────────────── */
function sizeLegend({g, scale, title, x, y}) {
  const domain = scale.domain();
  const values = [domain[0], d3.quantile(domain, .5), domain[1]];
  const L = g.append("g").attr("transform", `translate(${x},${y})`);
  L.append("text").attr("x",0).attr("y",-10).attr("font-size","12px").text(title);

  const row = L.selectAll("g").data(values).join("g")
    .attr("transform", (d,i) => `translate(0, ${i*28})`);

  row.append("circle")
    .attr("r", d => scale(d))
    .attr("cx", 0).attr("cy", 0)
    .attr("fill","steelblue").attr("fill-opacity",0.6);

  row.append("text").attr("x", 18).attr("y", 4)
     .text(d => Math.round(d)).attr("font-size","12px");
}
sizeLegend({ g, scale: r, title: "Lines edited", x: width-120, y: 10 });

import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// ---- load data from your existing lib/projects.json ----
const dataURL = new URL('../lib/projects.json', import.meta.url);
const allProjects = await fetchJSON(dataURL);

// DOM targets
const cards = document.querySelector('.projects');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');
const searchInput = document.querySelector('.searchBar');
const titleEl = document.querySelector('.projects-title');

titleEl && (titleEl.textContent = `Projects (${allProjects.length})`);

// helpers
const arc = d3.arc().innerRadius(0).outerRadius(50);
const color = d3.scaleOrdinal(d3.schemeTableau10);

function rollupByYear(list) {
  const rolled = d3.rollups(list, v => v.length, d => String(d.year ?? 'Unknown'));
  return rolled.map(([label, value]) => ({ label, value }));
}

function filterByQuery(list, q) {
  if (!q) return list;
  const needle = q.toLowerCase();
  return list.filter(p => Object.values(p).join(' ').toLowerCase().includes(needle));
}

// state
let currentQuery = '';
let selectedIndex = -1;

// rendering
function drawPie(list) {
  const data = rollupByYear(list);
  const pie = d3.pie().value(d => d.value)(data);
  const paths = pie.map(d => arc(d));

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  paths.forEach((d, i) => {
    svg.append('path')
      .attr('d', d)
      .attr('fill', color(i))
      .on('click', () => handleSliceClick(i, data, list));
  });

  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color:${color(i)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => handleSliceClick(i, data, list));
  });

  applySelected();
}

function applySelected() {
  svg.selectAll('path').attr('class', (_, i) => i === selectedIndex ? 'selected' : null);
  legend.selectAll('li').attr('class', (_, i) => i === selectedIndex ? 'selected' : null);
}

function recomputeAndRender() {
  let filtered = filterByQuery(allProjects, currentQuery);

  if (selectedIndex !== -1) {
    const yearsAll = rollupByYear(allProjects);
    const year = yearsAll[selectedIndex]?.label;
    if (year) filtered = filtered.filter(p => String(p.year ?? 'Unknown') === year);
  }

  renderProjects(filtered, cards, 'h2');
  drawPie(filtered);
}

function handleSliceClick(i, dataUnderPie, listShownNow) {
  selectedIndex = (selectedIndex === i ? -1 : i);
  applySelected();

  recomputeAndRender();
}

searchInput?.addEventListener('input', (e) => {
  currentQuery = e.target.value || '';
  recomputeAndRender();
});

renderProjects(allProjects, cards, 'h2');
drawPie(allProjects);

import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// show the latest 3 projects
const all = await fetchJSON('./lib/projects.json');
const latest = Array.isArray(all) ? all.slice(0, 3) : [];
renderProjects(latest, document.querySelector('.projects'), 'h2');

// GitHub stats (your username)
const stats = document.querySelector('#profile-stats');
if (stats) {
  const g = await fetchGitHubData('NFNeuweg'); // your username
  if (g && !g.message) {
    stats.innerHTML = `
      <dl>
        <dt>Public Repos:</dt><dd>${g.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${g.public_gists}</dd>
        <dt>Followers:</dt><dd>${g.followers}</dd>
        <dt>Following:</dt><dd>${g.following}</dd>
      </dl>
    `;
  } else {
    stats.textContent = 'Unable to load GitHub data right now.';
  }
}

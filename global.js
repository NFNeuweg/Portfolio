console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// let navLinks = $$("nav a");
// console.log(navLinks);


// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink.classList.add('current');


let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'Resume/', title: 'Resume/CV' },
  { url: 'meta/',     title: 'Commit Meta' },
  { url: "https://github.com/NFNeuweg", title: "GitHub" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

const BASE_PATH = (
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1"
)
  ? "/"
  : "/Portfolio/";

for (let p of pages) {
  let url = !p.url.startsWith("http") ? BASE_PATH + p.url : p.url;
  let title = p.title;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}


document.body.insertAdjacentHTML(
  "afterbegin",
  `<label class="color-scheme">
     Theme:
     <select>
       <option value="light dark">Automatic</option>
       <option value="light">Light</option>
       <option value="dark">Dark</option>
     </select>
   </label>`
);


const select = document.querySelector('.color-scheme select');


const saved = localStorage.colorScheme || 'light dark';


document.documentElement.style.setProperty('color-scheme', saved);
select.value = saved;


select.addEventListener('input', (event) => {
  const value = event.target.value;
  document.documentElement.style.setProperty('color-scheme', value);
  localStorage.colorScheme = value;
  console.log('color scheme changed to', value);
});


const form = document.querySelector('#contact-form');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const params = [];

  for (const [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = `${form.action}?${params.join("&")}`;
  location.href = url;
});




// === Lab 4 helpers ===

// fetch JSON safely
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.error('[fetchJSON] error:', err);
    return []; // safe fallback for project lists
  }
}

// render an array of project objects into a container
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.warn('renderProjects: missing containerElement');
    return;
  }
  const valid = new Set(['h1','h2','h3','h4','h5','h6']);
  const H = valid.has(headingLevel) ? headingLevel : 'h2';

  containerElement.innerHTML = '';
  if (!Array.isArray(projects) || projects.length === 0) {
    containerElement.innerHTML = `<p>No projects to show yet.</p>`;
    return;
  }

  for (const p of projects) {
    const article = document.createElement('article');
    const title = p.title ?? 'Untitled project';
    const img = p.image ?? 'https://dsc106.com/labs/lab02/images/empty.svg';
    const desc = p.description ?? '';
    article.innerHTML = `
      <${H}>${title}</${H}>
      <img src="${img}" alt="${title}">
      <p>${desc}</p>
    `;
    containerElement.appendChild(article);
  }
}

// GitHub API helper
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${encodeURIComponent(username)}`);
}

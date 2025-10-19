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
  { url: '../projects/', title: 'Projects' },
  { url: '../contact/', title: 'Contact' },
  { url: '../Resume/', title: 'Resume/CV' },
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
/* pages.jsx — all six page components + shared widgets.
   React + Babel loaded from CDN in Portfolio.html.
   Content strings live in data.js (window.NN_DATA) except:
     - UI labels, section headings
     - Editorial prose Noah wrote (about me, intros, meta context)
*/

const { useState, useEffect, useMemo } = React;

/* ── Router ──────────────────────────────────────────────────────────── */

const PAGES = ['home', 'projects', 'outside', 'resume', 'contact', 'meta'];

function getPage() {
  const h = location.hash.replace('#', '').toLowerCase();
  return PAGES.includes(h) ? h : 'home';
}

/* ── Root app ─────────────────────────────────────────────────────────── */

function App() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function navigate(p) {
    location.hash = p;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  const pageMap = { home: Home, projects: Projects, outside: Outside,
                    resume: Resume, contact: Contact, meta: Meta };
  const PageComponent = pageMap[page] || Home;

  return (
    <>
      <TopBar page={page} navigate={navigate} />
      <div className="wrap">
        <PageComponent navigate={navigate} />
      </div>
    </>
  );
}

/* ── Top bar ──────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: 'home',     label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'outside',  label: 'Outside' },
  { id: 'resume',   label: 'Resume' },
  { id: 'contact',  label: 'Contact' },
  { id: 'meta',     label: 'Meta' },
];

function TopBar({ page, navigate }) {
  const [dark, setDark] = useState(
    () => document.documentElement.dataset.theme === 'dark'
  );

  function toggleTheme() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('nn-theme', next);
    setDark(!dark);
  }

  return (
    <header className="topbar">
      <nav className="nav-tabs" aria-label="Site navigation">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-btn${page === item.id ? ' active' : ''}`}
            data-page={item.id}
            onClick={() => navigate(item.id)}
            aria-current={page === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? '☀' : '☾'}
      </button>
    </header>
  );
}

/* ── Shared: ProjectCard ──────────────────────────────────────────────── */

function ProjectCard({ project: p, headingLevel = 'h3' }) {
  const [open, setOpen] = useState(false);
  const cardRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const isOcean = p.tags.includes('ocean');
  const H = headingLevel;
  const dialogId = `project-dialog-${p.slug}`;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleDialogKeyDown(event) {
      if (event.key === 'Escape') {
        closeProject();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      window.removeEventListener('keydown', handleDialogKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function openProject() {
    setOpen(true);
  }

  function closeProject() {
    setOpen(false);
    requestAnimationFrame(() => cardRef.current?.focus());
  }

  function handleCardKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject();
    }
  }

  return (
    <>
      <article
        ref={cardRef}
        className="proj-card"
        data-ocean={isOcean || undefined}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
        aria-label={`Open details for ${p.title}`}
        onClick={openProject}
        onKeyDown={handleCardKeyDown}
      >
        <div className="proj-card-topline">
          <p className="proj-num mono">N° {p.id}</p>
          <span className="proj-year mono">{p.year}</span>
        </div>
        <H className="proj-title">{p.title}</H>
        <p className="proj-card-blurb">{p.blurb}</p>
        <div className="proj-card-footer">
          <span>{p.course !== '—' ? p.course : p.role === 'group' ? 'group project' : 'personal project'}</span>
          <span className="proj-open" aria-hidden="true">view details +</span>
        </div>
      </article>

      {open && (
        <div
          className="project-dialog-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeProject();
          }}
        >
          <section
            ref={dialogRef}
            id={dialogId}
            className="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
          >
            <button
              type="button"
              className="project-dialog-close"
              onClick={closeProject}
              aria-label={`Close ${p.title} details`}
              autoFocus
            >
              close
            </button>

            <p className="proj-num mono">N° {p.id} / {p.year}</p>
            <h2 id={`${dialogId}-title`} className="project-dialog-title">{p.title}</h2>
            <p className="project-dialog-lede">{p.blurb}</p>

            {p.details && <p className="project-dialog-copy">{p.details}</p>}

            <div className="project-dialog-meta">
              <div>
                <span className="project-dialog-label">role</span>
                <strong>{p.role === 'group' ? 'Group project' : 'Solo project'}</strong>
              </div>
              {p.course !== '—' && (
                <div>
                  <span className="project-dialog-label">course</span>
                  <strong>{p.course}</strong>
                </div>
              )}
            </div>

            {p.features?.length > 0 && (
              <div className="project-dialog-section">
                <h3>What it does</h3>
                <ul className="project-feature-list">
                  {p.features.map(feature => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
            )}

            {p.dataSources?.length > 0 && (
              <div className="project-dialog-section">
                <h3>Data</h3>
                <ul className="project-feature-list">
                  {p.dataSources.map(source => <li key={source}>{source}</li>)}
                </ul>
              </div>
            )}

            <div className="project-dialog-section">
              <h3>Built with</h3>
              <div className="chip-row">
                {p.stack.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>

            <div className="chip-row project-dialog-tags">
              {p.tags.map(t => (
                <span key={t} className={`chip ${isOcean ? 'chip-sea' : 'chip-pine'}`}>{t}</span>
              ))}
            </div>

            {p.url && (
              <a
                className="project-dialog-link"
                href={p.url}
                target="_blank"
                rel="noreferrer"
              >
                {p.linkLabel || 'Visit project'} <span aria-hidden="true">↗</span>
              </a>
            )}
          </section>
        </div>
      )}
    </>
  );
}

/* ── Shared: PieChart ─────────────────────────────────────────────────── */

const PIE_COLORS = ['#2D5E3C', '#246175', '#6AA57A', '#3A7A8C', '#4A8060', '#5B9AB0'];

function PieChart({ data, filter, onFilter }) {
  const R = 46;
  let angle = -Math.PI / 2;
  const total = data.reduce((s, d) => s + d.count, 0);

  const slices = data.map((d, i) => {
    const sweep = (d.count / total) * 2 * Math.PI;
    const x1 = R * Math.cos(angle);
    const y1 = R * Math.sin(angle);
    angle += sweep;
    const x2 = R * Math.cos(angle);
    const y2 = R * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const path = d.count === total
      ? `M 0 0 L 0 ${-R} A ${R} ${R} 0 1 1 0.001 ${-R} Z`
      : `M 0 0 L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;
    return { ...d, path, color: PIE_COLORS[i % PIE_COLORS.length] };
  });

  return (
    <div className="pie-wrap">
      <svg viewBox="-50 -50 100 100" className="pie-svg" role="img" aria-label="Projects by year">
        {slices.map(s => (
          <path
            key={s.label}
            d={s.path}
            fill={s.color}
            className={filter && filter !== s.label ? 'pie-dim' : ''}
            onClick={() => onFilter(filter === s.label ? null : s.label)}
            aria-label={`${s.label}: ${s.count} project${s.count !== 1 ? 's' : ''}`}
          />
        ))}
      </svg>
      <ul className="pie-legend" aria-label="Year legend">
        {slices.map(s => (
          <li
            key={s.label}
            className={`legend-item${filter === s.label ? ' legend-selected' : ''}`}
            onClick={() => onFilter(filter === s.label ? null : s.label)}
          >
            <span className="legend-swatch" style={{backgroundColor: s.color}} />
            <span>{s.label}</span>
            <span className="legend-count">{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Shared: ActivityGrid ─────────────────────────────────────────────── */

function ActivityGrid() {
  const dates = window.NN_DATA.allCommitDates || [];
  const WEEKS = 26, DAYS = 7;
  const cellW = 11, cellH = 11, gap = 2;

  const commitSet = useMemo(() => {
    const s = {};
    dates.forEach(d => { s[d] = (s[d] || 0) + 1; });
    return s;
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - (WEEKS * 7 - 1));

  const cells = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS; d++) {
      const dt = new Date(startDay);
      dt.setDate(startDay.getDate() + w * 7 + d);
      const key = dt.toISOString().slice(0, 10);
      cells.push({ w, d, key, count: commitSet[key] || 0 });
    }
  }

  const cellColor = count =>
    count === 0 ? 'var(--paper-2)' : count === 1 ? 'var(--pine-soft)' : 'var(--pine)';

  return (
    <div className="activity-grid">
      <p className="activity-grid-title mono">26-week commit activity</p>
      <svg
        className="activity-svg"
        width={WEEKS * (cellW + gap)}
        height={DAYS  * (cellH + gap)}
        role="img"
        aria-label="26-week commit activity grid"
      >
        {cells.map(c => (
          <rect
            key={c.key}
            x={c.w * (cellW + gap)} y={c.d * (cellH + gap)}
            width={cellW} height={cellH}
            fill={cellColor(c.count)} rx={2} ry={2}
          >
            <title>{c.key}{c.count > 0 ? ` · ${c.count} commit${c.count > 1 ? 's' : ''}` : ''}</title>
          </rect>
        ))}
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE 01 — Home
══════════════════════════════════════════════════════════════════════ */

function Home({ navigate }) {
  const { projects, dives, hikes, music } = window.NN_DATA;
  const latest = [...projects]
    .sort((a, b) => b.year - a.year || b.id.localeCompare(a.id))
    .slice(0, 3);

  return (
    <div className="page-inner">

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-name">Noah Neuweg</h1>
        <p className="hero-sub">
          Math &amp; Applied Data Science at UC San Diego.
          I build small, careful tools — and spend the rest of the time underwater or on a trail.
        </p>
      </section>

      {/* Now strip */}
      <div className="now-strip">
        <div className="now-inner wrap">
          <span className="now-label">now</span>
          <span className="now-dot">·</span>
          <span>spring 2026</span>
          <span className="now-dot">·</span>
          <span>MATH 142B</span>
          <span className="now-dot">·</span>
          <span>DSC 152 with R</span>
        </div>
      </div>

      {/* Latest projects */}
      <section className="section">
        <p className="page-kicker">recent work</p>
        <h2 className="section-title mb-4">Latest projects</h2>
        <div className="proj-grid mb-8">
          {latest.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
        <button className="pdf-link" onClick={() => navigate('projects')}>
          All {projects.length} projects →
        </button>
      </section>

      {/* About + quick facts */}
      <section className="section">
        <p className="page-kicker">about</p>
        <div className="home-cols">
          <div>
            <h2 className="section-title mb-4">About me</h2>

            {/* La Jolla photo */}
            <div className="home-photo-wrap mb-8">
              <img
                src="Images/IMG_9561.jpg"
                alt="Scuba diving at La Jolla Cove"
                className="home-photo"
              />
              <p className="home-photo-caption mono">La Jolla Cove · Open Water dive</p>
            </div>

            <div className="about-prose mb-8">
              <p>
                I'm a math and applied data science student at UC San Diego.
                I came in wanting to study pure math — and slowly fell for the messy-data side.
                I believe that data, when carefully visualized, always tells the truth.
              </p>
              <p>
                My coursework sits at the overlap of probability theory, machine learning, and
                visualization. This quarter that includes DSC 152, using R for real data analysis,
                statistical graphics, inference, hypothesis tests, and regression.
              </p>
              <p>
                Outside the laptop: Open Water certified diver, mostly in the kelp forests
                around San Diego. I rock climb, run, hike, and sail when I can.
              </p>
            </div>

            {/* Music */}
            <h3 className="section-title mb-4" style={{fontSize: '1rem'}}>Some music</h3>
            <ul className="music-list">
              {music.map(m => (
                <li key={m.url} className="music-item">
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="music-link"
                  >
                    {m.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <div className="side-card">
              <p className="side-card-title">quick facts</p>
              <div className="fact-row">
                <span className="fact-key">studying</span>
                <span className="fact-val">Math + ADS</span>
              </div>
              <div className="fact-row">
                <span className="fact-key">at</span>
                <span className="fact-val">UC San Diego</span>
              </div>
              <div className="fact-row">
                <span className="fact-key">grad</span>
                <span className="fact-val">Dec 2026</span>
              </div>
              <div className="fact-row">
                <span className="fact-key">diving</span>
                <span className="fact-val">PADI OW</span>
              </div>
              <div className="fact-row">
                <span className="fact-key">also</span>
                <span className="fact-val">climbing, sailing</span>
              </div>
              <div className="fact-row">
                <span className="fact-key">hikes</span>
                <span className="fact-val">{hikes.length}</span>
              </div>
              <div className="fact-row">
                <span className="fact-key">projects</span>
                <span className="fact-val">{projects.length}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE 02 — Projects
══════════════════════════════════════════════════════════════════════ */

function Projects() {
  const { projects } = window.NN_DATA;
  const [search, setSearch]         = useState('');
  const [yearFilter, setYearFilter] = useState(null);

  const pieData = useMemo(() => {
    const counts = {};
    projects.forEach(p => { counts[p.year] = (counts[p.year] || 0) + 1; });
    return Object.entries(counts)
      .sort(([a], [b]) => +a - +b)
      .map(([label, count]) => ({ label, count }));
  }, []);

  const filtered = useMemo(() => projects.filter(p => {
    if (yearFilter && p.year !== +yearFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.blurb.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.stack.some(s => s.toLowerCase().includes(q)) ||
      p.course.toLowerCase().includes(q)
    );
  }), [search, yearFilter]);

  return (
    <div className="page-inner">
      <p className="page-kicker">portfolio</p>
      <h1 className="page-title">Projects</h1>
      <p className="page-intro mb-8">
        {projects.length} projects. Click a pie slice or search to filter.
      </p>

      <input
        type="search"
        className="search-input"
        placeholder="search by title, tag, stack, or course…"
        value={search}
        onChange={e => { setSearch(e.target.value); setYearFilter(null); }}
        aria-label="Search projects"
      />

      <PieChart
        data={pieData}
        filter={yearFilter}
        onFilter={y => { setYearFilter(y); setSearch(''); }}
      />

      {yearFilter && (
        <p className="text-muted mb-4" style={{fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace'}}>
          Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''} from {yearFilter} —{' '}
          <button
            style={{color: 'var(--pine)', textDecoration: 'underline', fontSize: '0.8rem',
                    cursor: 'pointer', fontFamily: 'inherit', background: 'none', border: 'none'}}
            onClick={() => setYearFilter(null)}
          >
            clear filter
          </button>
        </p>
      )}

      <div className="proj-grid">
        {filtered.length > 0
          ? filtered.map(p => <ProjectCard key={p.id} project={p} />)
          : <p className="text-muted">No projects match "{search}".</p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE 03 — Outside
══════════════════════════════════════════════════════════════════════ */

/* Photo gallery slots — drop a photo onto any slot to fill it.
   default-src pre-loads an existing file if one is already on disk. */
const GALLERY_PHOTOS = [
  /* ── Dives ── */
  {
    id: 'p-la-jolla',
    shape: 'wide',
    caption: 'La Jolla Cove · dive 1',
    tag: 'dive',
    grad: 'linear-gradient(160deg, #0a2535, #071826 65%, #040f18)',
    defaultSrc: 'Images/IMG_9561.jpg',
  },
  {
    id: 'p-dive-2',
    shape: 'sq',
    caption: 'La Jolla shoreline',
    tag: 'dive',
    grad: 'linear-gradient(160deg, #0c2a38, #071820 65%, #040e14)',
    defaultSrc: 'Images/la-jolla-coconut.jpg',
  },

  /* ── Hikes ── */
  {
    id: 'p-big-sur',
    shape: 'sq',
    caption: 'Cypress coast',
    tag: 'hike',
    grad: 'linear-gradient(160deg, #1e3520, #121f14 65%, #090f0a)',
    defaultSrc: 'Images/cypress-coast.jpg',
  },
  {
    id: 'p-sequoia',
    shape: 'tall',
    caption: 'Big Sur sunset',
    tag: 'hike',
    grad: 'linear-gradient(160deg, #2a3818, #1a2410 65%, #0d1208)',
    defaultSrc: 'Images/big-sur-sunset.jpg',
  },
  {
    id: 'p-yosemite',
    shape: 'wide',
    caption: 'Rocky coast overlook',
    tag: 'hike',
    grad: 'linear-gradient(160deg, #263020, #161e14 65%, #0b0f0a)',
    defaultSrc: 'Images/rocky-coast.jpg',
  },
  {
    id: 'p-crater-lake',
    shape: 'sq',
    caption: 'McWay Falls',
    tag: 'hike',
    grad: 'linear-gradient(160deg, #0d2040, #081428 65%, #040a18)',
    defaultSrc: 'Images/mcway-falls.jpg',
  },
];

function Outside() {
  const { dives, hikes } = window.NN_DATA;
  const totalDiveDur = dives.reduce((s, d) => s + (d.dur || 0), 0);
  const maxDepth     = dives.reduce((m, d) => Math.max(m, d.depth || 0), 0);

  return (
    <div className="page-inner">

      {/* Hero */}
      <div className="outside-hero">
        <p className="page-kicker" style={{color: '#6db4ce'}}>outside</p>
        <h1>Dives &amp; Hikes</h1>
        <p>
          Open Water certified. Mostly kelp forests and rocky reefs around San Diego.
          Hiking when I can't get in the water - Big Sur, La Jolla, Monterey, and wherever else.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-row">
        <div className="stat-box">
          <div className="stat-val">{dives.length}</div>
          <div className="stat-label">logged dives</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{maxDepth > 0 ? `${maxDepth} m` : '—'}</div>
          <div className="stat-label">deepest dive</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{totalDiveDur > 0 ? `${totalDiveDur} min` : '—'}</div>
          <div className="stat-label">time underwater</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{hikes.length}</div>
          <div className="stat-label">logged hikes</div>
        </div>
      </div>

      {/* Photo gallery */}
      <section className="section">
        <p className="page-kicker">gallery</p>
        <h2 className="section-title mb-4">Photos</h2>
        <p className="text-muted mb-8" style={{fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace'}}>
          Coastal photos from recent outside days. Drop a replacement onto any slot to change it locally.
        </p>
        <div className="gallery">
          {GALLERY_PHOTOS.map(ph => (
            <image-slot
              key={ph.id}
              slot-id={ph.id}
              shape={ph.shape}
              caption={ph.caption}
              tag={ph.tag}
              grad={ph.grad}
              default-src={ph.defaultSrc || ''}
            />
          ))}
        </div>
      </section>

      {/* Dive log — single card for 1 dive, table for multiple */}
      <section className="section">
        <p className="page-kicker">dive log</p>
        <h2 className="section-title mb-4">Dives</h2>
        {dives.length === 0 ? (
          <p className="placeholder-note">No dives logged yet.</p>
        ) : dives.length === 1 ? (
          <div className="single-log-card">
            <div className="single-log-row">
              <span className="single-log-num mono">Dive #1</span>
              <span className="single-log-site">{dives[0].site}</span>
              <span className="single-log-date mono">{dives[0].date}</span>
            </div>
            {dives[0].note && (
              <p className="single-log-note">{dives[0].note}</p>
            )}
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="log-table">
              <thead>
                <tr>
                  <th>#</th><th>date</th><th>site</th>
                  <th>depth</th><th>vis</th><th>temp</th>
                  <th>dur</th><th>buddy</th><th>note</th>
                </tr>
              </thead>
              <tbody>
                {dives.map(d => (
                  <tr key={d.n}>
                    <td className="mono-val">{d.n}</td>
                    <td className="mono-val">{d.date}</td>
                    <td>{d.site}</td>
                    <td className="mono-val">{d.depth != null ? `${d.depth} m`   : '—'}</td>
                    <td className="mono-val">{d.vis   != null ? `${d.vis} m`    : '—'}</td>
                    <td className="mono-val">{d.temp  != null ? `${d.temp} °C`  : '—'}</td>
                    <td className="mono-val">{d.dur   != null ? `${d.dur} min`  : '—'}</td>
                    <td>{d.buddy}</td>
                    <td style={{maxWidth: '24ch'}}>{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Hike log */}
      <section className="section">
        <p className="page-kicker">hike log</p>
        <h2 className="section-title mb-4">Hikes</h2>
        {hikes.length === 0 ? (
          <p className="placeholder-note">No hikes logged yet.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="log-table">
              <thead>
                <tr>
                  <th>date</th><th>trail</th><th>location</th>
                  <th>dist</th><th>elev</th><th>dur</th><th>note</th>
                </tr>
              </thead>
              <tbody>
                {hikes.map((h, i) => (
                  <tr key={i}>
                    <td className="mono-val">{h.date}</td>
                    <td>{h.trail}</td>
                    <td>{h.loc}</td>
                    <td className="mono-val">{h.dist != null ? `${h.dist} mi` : '—'}</td>
                    <td className="mono-val">{h.elev != null ? `${h.elev} ft` : '—'}</td>
                    <td className="mono-val">{h.dur  != null ? `${h.dur} min` : '—'}</td>
                    <td style={{maxWidth: '24ch'}}>{h.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE 04 — Resume
══════════════════════════════════════════════════════════════════════ */

const SKILLS = [
  'Python', 'R', 'SQL', 'MySQL',
  'pandas', 'NumPy', 'scikit-learn', 'Matplotlib',
  'Selenium', 'BeautifulSoup',
  'n8n', 'D3.js', 'JavaScript', 'React', 'HTML/CSS',
  'Git', 'Jupyter', 'Linux/Bash', 'Excel',
];

function Resume() {
  const { coursework, certs, experience } = window.NN_DATA;
  const current  = coursework.filter(c => c.status === 'current');
  const previous = coursework.filter(c => c.status !== 'current');

  return (
    <div className="page-inner">
      <p className="page-kicker">cv</p>
      <h1 className="page-title mb-4">Resume</h1>

      <a
        className="pdf-link"
        href="Resume/data_science_tech_resume_template__1_.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        ↓ Download PDF
      </a>

      <div className="resume-wrap">

        {/* Left column */}
        <div>

          {/* Education */}
          <section className="section" style={{borderTop: 'none', paddingTop: 0}}>
            <p className="resume-section-title">education</p>
            <div className="edu-entry">
              <div className="edu-school">UC San Diego</div>
              <div className="edu-degree">B.S. in Mathematics &amp; Applied Data Science</div>
              <div className="edu-date">2023 — Dec 2026 (expected)</div>
            </div>
          </section>

          {/* Experience */}
          <section className="section">
            <p className="resume-section-title">experience</p>
            {experience.map(e => (
              <div key={e.id} className="exp-entry">
                <div className="exp-header">
                  <div>
                    <div className="exp-title">{e.title}</div>
                    <div className="exp-org">{e.org} · {e.loc}</div>
                  </div>
                  <div className="exp-dates mono">{e.dates}</div>
                </div>
                <ul className="exp-bullets">
                  {e.bullets.map((b, i) => (
                    <li key={i} className="exp-bullet">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Coursework */}
          <section className="section">
            <p className="resume-section-title">coursework</p>

            {current.length > 0 && (
              <>
                <p className="course-group-label mono">currently taking</p>
                <div style={{overflowX: 'auto', marginBottom: '1.5rem'}}>
                  <table className="course-table">
                    <thead>
                      <tr><th>code</th><th>name</th><th>topics</th></tr>
                    </thead>
                    <tbody>
                      {current.map(c => (
                        <tr key={c.code}>
                          <td><span className="course-code">{c.code}</span></td>
                          <td>{c.name}</td>
                          <td><span className="course-note">{c.note}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="course-group-label mono">completed</p>
              </>
            )}

            <div style={{overflowX: 'auto'}}>
              <table className="course-table">
                <thead>
                  <tr><th>code</th><th>name</th><th>topics</th></tr>
                </thead>
                <tbody>
                  {previous.map(c => (
                    <tr key={c.code}>
                      <td><span className="course-code">{c.code}</span></td>
                      <td>{c.name}</td>
                      <td><span className="course-note">{c.note}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Off-keyboard */}
          <section className="section">
            <p className="resume-section-title">off-keyboard</p>
            <div className="about-prose">
              <p>
                Open Water certified diver — mostly kelp forests and rocky reefs around San Diego.
                I rock climb, run, and hike; I've sailed Quests and Sabots.
                Both the water and the trail feed the same instinct: show up somewhere
                new, pay attention to what's there.
              </p>
            </div>
          </section>

        </div>

        {/* Right column */}
        <div>

          {/* Skills */}
          <section className="section" style={{borderTop: 'none', paddingTop: 0}}>
            <p className="resume-section-title">skills</p>
            <div className="skill-wrap">
              {SKILLS.map(s => <span key={s} className="chip chip-pine">{s}</span>)}
            </div>
          </section>

          {/* Certifications */}
          <section className="section">
            <p className="resume-section-title">certifications</p>
            {certs.map(c => (
              <div key={c.id} className="cert-card">
                <div className="cert-symbol">{c.symbol}</div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-issuer">{c.issuer}{c.year ? ` · ${c.year}` : ''}</div>
                <div className="cert-note">{c.note}</div>
              </div>
            ))}
          </section>

        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE 05 — Contact
══════════════════════════════════════════════════════════════════════ */

function Contact() {
  const [subject, setSubject] = useState('');
  const [body, setBody]       = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const url = `mailto:noahfong1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  return (
    <div className="page-inner">
      <p className="page-kicker">get in touch</p>
      <h1 className="page-title mb-8">Contact</h1>

      <div className="contact-grid">

        <div>
          <h2 className="section-title mb-4">Send a message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label" htmlFor="cf-subject">subject</label>
              <input
                id="cf-subject"
                className="form-input"
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="What's this about?"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="cf-body">message</label>
              <textarea
                id="cf-body"
                className="form-textarea"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Your message…"
              />
            </div>
            <button type="submit" className="form-btn">Open in mail app →</button>
          </form>
        </div>

        <div>
          <h2 className="section-title mb-4">Directory</h2>
          <div className="directory mb-8">
            <div className="dir-row">
              <span className="dir-key">email</span>
              <span className="dir-val">
                <a href="mailto:noahfong1@gmail.com">noahfong1@gmail.com</a>
              </span>
            </div>
            <div className="dir-row">
              <span className="dir-key">github</span>
              <span className="dir-val">
                <a href="https://github.com/NFNeuweg" target="_blank" rel="noopener noreferrer">
                  NFNeuweg ↗
                </a>
              </span>
            </div>
          </div>

          <h2 className="section-title mb-4">Status</h2>
          <div className="status-chip">
            <span className="status-dot" />
            open to summer 2026 internships
          </div>

          <h2 className="section-title mb-4" style={{marginTop: '1.5rem'}}>Reply window</h2>
          <table className="reply-table">
            <thead>
              <tr><th>channel</th><th>typical reply</th></tr>
            </thead>
            <tbody>
              <tr><td>email</td><td>1–3 days</td></tr>
              <tr><td>GitHub issues</td><td>same day</td></tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE 06 — Meta
══════════════════════════════════════════════════════════════════════ */

const COMMIT_CONTEXT = [
  // i=0 — 01672d0 — 2025-12-31 — revised resume page
  "Cleaned up the resume page: fixed two typos (one was 'properlly'), restructured " +
  "the coursework list, and moved the PDF link to the top.",

  // i=1 — 88a3fd8 — 2025-11-21 — implemented time slider with commit filtering
  "Added a range slider to the commit visualizer so you can scrub through the repo's " +
  "history. The scatter plot updates live as you drag.",

  // i=2 — c72f00a — 2025-11-08 — add language breakdown to commit visualizer
  "After the time slider, the obvious next thing was showing which languages are in " +
  "the selected commits. Piping the loc.csv data through D3 rollup.",

  // i=3 — 51a4150 — 2025-11-08 — fix scatter plot tooltip
  "Tooltip was clipping at the SVG edge on the right side. Fixed by checking cursor x " +
  "against the SVG bounding rect and flipping direction.",

  // i=4 — 6606cb1 — 2025-11-08 — Lab 6 D3 experimentation
  "First pass at the D3 scatter plot. Getting scales and axes right took longer than " +
  "expected — day-of-week on Y, hour on X, radius encodes lines changed.",
];

function Meta() {
  const { commits } = window.NN_DATA;

  return (
    <div className="page-inner">
      <p className="page-kicker">building in public</p>
      <h1 className="page-title mb-8">Meta</h1>

      <section className="section" style={{borderTop: 'none', paddingTop: 0}}>
        <p className="resume-section-title">recent commits</p>
        <div className="commit-list">
          {commits.map((c, i) => (
            <div key={c.sha} className="commit-entry">
              <div className="commit-header">
                <span className="commit-sha mono">{c.sha}</span>
                <span className="commit-msg">{c.msg}</span>
                <span className="commit-date mono">{c.date}</span>
              </div>
              {COMMIT_CONTEXT[i] && (
                <p className="commit-context">{COMMIT_CONTEXT[i]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="resume-section-title">activity</p>
        <ActivityGrid />
      </section>

      <section className="section">
        <p className="resume-section-title">colophon</p>
        <div className="colophon">
          <p>
            This site is a single HTML file — <span className="mono" style={{fontSize:'0.8rem'}}>Portfolio.html</span> —
            with a <span className="mono" style={{fontSize:'0.8rem'}}>pages.jsx</span> for the React components
            and a <span className="mono" style={{fontSize:'0.8rem'}}>data.js</span> for all the content.
            No build step. React and Babel are loaded from a pinned CDN.
          </p>
          <p>
            Type is set in Bricolage Grotesque (variable, 400–700 weight, optical size 12–96)
            for everything except mono labels, which use JetBrains Mono. Both from Google Fonts.
          </p>
          <p>
            Color palette: Pine &amp; Sea — two accents with distinct jobs.
            Pine carries the work and code side. Sea carries dives and the outside.
            Hosted on GitHub Pages.
          </p>
          <p>
            <a href="https://github.com/NFNeuweg" target="_blank" rel="noopener noreferrer"
               style={{color: 'var(--pine)'}}>
              github.com/NFNeuweg ↗
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}

/* ── Mount ────────────────────────────────────────────────────────────── */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

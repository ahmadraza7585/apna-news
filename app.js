// Apna News — live news via free RSS feeds (no API key needed)

const FEEDS = {
  top: [
    'https://www.dawn.com/feeds/home',
    'http://feeds.bbci.co.uk/news/world/rss.xml',
  ],
  pakistan: [
    'https://www.dawn.com/feeds/home',
  ],
  world: [
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
  ],
  sports: [
    'http://feeds.bbci.co.uk/sport/rss.xml',
  ],
  business: [
    'http://feeds.bbci.co.uk/news/business/rss.xml',
  ],
  tech: [
    'http://feeds.bbci.co.uk/news/technology/rss.xml',
  ],
};

const cache = {};
let currentCat = 'top';

function rss2json(rssUrl) {
  return 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);
}

function relTime(iso) {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return '';
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'abhi';
  if (s < 3600) return Math.floor(s / 60) + ' min pehle';
  if (s < 86400) return Math.floor(s / 3600) + ' ghante pehle';
  return Math.floor(s / 86400) + ' din pehle';
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function imgOf(item) {
  return item.thumbnail || (item.enclosure && item.enclosure.link) || '';
}

function sourceOf(item, feedTitle) {
  return feedTitle || 'News';
}

async function fetchFeed(rssUrl) {
  const r = await fetch(rss2json(rssUrl));
  const d = await r.json();
  if (d.status !== 'ok' || !Array.isArray(d.items)) return [];
  const feedTitle = (d.feed && d.feed.title) ? d.feed.title.replace(/^BBC News - /, 'BBC ') : '';
  return d.items.map(it => ({
    title: it.title,
    link: it.link,
    img: imgOf(it),
    date: it.pubDate,
    src: feedTitle,
  }));
}

function showSkeletons() {
  $('hero').innerHTML = '<div class="skel" style="grid-column:1/-1;min-height:340px"></div>';
  $('feed').innerHTML = Array.from({ length: 8 }, () => '<div class="skel"></div>').join('');
  $('trending-list').innerHTML = '';
}

async function loadCategory(cat) {
  currentCat = cat;
  document.querySelectorAll('.cat').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  if (cache[cat]) { render(cache[cat]); return; }

  showSkeletons();
  const urls = FEEDS[cat] || FEEDS.top;
  const results = await Promise.allSettled(urls.map(fetchFeed));
  let items = [];
  results.forEach(r => { if (r.status === 'fulfilled') items = items.concat(r.value); });

  // dedupe by link, newest first
  const seen = new Set();
  items = items.filter(it => {
    if (!it.title || seen.has(it.link)) return false;
    seen.add(it.link);
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  cache[cat] = items;
  render(items);
}

function heroHTML(items) {
  if (!items.length) return '';
  const [a, b, c] = items;
  const side = [b, c].filter(Boolean).map(it => `
    <article onclick="window.open('${esc(it.link)}','_blank')">
      ${it.img ? `<img src="${esc(it.img)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
      <div class="hero-text"><h3>${esc(it.title)}</h3>
      <div class="meta"><span class="src">${esc(it.src)}</span> · ${relTime(it.date)}</div></div>
    </article>`).join('');
  return `
    <div class="hero-main" onclick="window.open('${esc(a.link)}','_blank')">
      ${a.img ? `<img src="${esc(a.img)}" alt="" onerror="this.remove()">` : ''}
      <div class="hero-text"><h2>${esc(a.title)}</h2>
      <div class="meta"><span class="src">${esc(a.src)}</span> · ${relTime(a.date)}</div></div>
    </div>
    <div class="hero-side">${side}</div>`;
}

function render(items) {
  if (!items.length) {
    $('hero').innerHTML = '';
    $('feed').innerHTML = '<div class="notice">Khabrein load nahi ho sakein — thodi der baad refresh karo.</div>';
    return;
  }
  $('hero').innerHTML = heroHTML(items.slice(0, 3));

  const rest = items.slice(3, 27);
  let html = '';
  rest.forEach((it, i) => {
    html += `
    <article class="card" onclick="window.open('${esc(it.link)}','_blank')">
      <div class="thumb">${it.img ? `<img src="${esc(it.img)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</div>
      <div class="body"><h3>${esc(it.title)}</h3>
      <div class="meta"><span class="src">${esc(it.src)}</span> · ${relTime(it.date)}</div></div>
    </article>`;
    // in-feed ad har 6 cards ke baad
    if ((i + 1) % 6 === 0) {
      html += `<div class="ad-slot ad-infeed"><span class="ad-label">Advertisement</span><p>Apna ad yahan lagao</p></div>`;
    }
  });
  $('feed').innerHTML = html;

  $('trending-list').innerHTML = items.slice(0, 8).map(it => `
    <li onclick="window.open('${esc(it.link)}','_blank')">${esc(it.title)}
      <span class="tmeta">${esc(it.src)} · ${relTime(it.date)}</span></li>`).join('');
}

function $(id) { return document.getElementById(id); }

// category tabs
document.querySelectorAll('.cat').forEach(b =>
  b.addEventListener('click', () => loadCategory(b.dataset.cat)));

// date + weather (Lahore, free open-meteo API — no key needed)
(function initMeta() {
  const d = new Date();
  $('today').textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  $('year').textContent = d.getFullYear();
  fetch('https://api.open-meteo.com/v1/forecast?latitude=31.55&longitude=74.34&current=temperature_2m,weather_code')
    .then(r => r.json())
    .then(w => {
      const t = Math.round(w.current.temperature_2m);
      const code = w.current.weather_code;
      const ico = code === 0 ? '☀️' : code < 4 ? '⛅' : code < 50 ? '🌧️' : '🌦️';
      $('weather').textContent = `${ico} ${t}°C Lahore`;
    })
    .catch(() => {});
})();

loadCategory('top');

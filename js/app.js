(() => {
'use strict';
const E = window.Engine, CFG = window.MAROOM_CONFIG || {};
const sb = CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2);

/* ---------- ikon (satu set SVG) ---------- */
const P = {
  home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  film: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4',
  layers: 'M12 2l10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  back: 'M15 18l-6-6 6-6', plus: 'M12 5v14M5 12h14', x: 'M6 6l12 12M18 6L6 18',
  play: 'M6 4l14 8-14 8z', down: 'M12 3v12m0 0l-4-4m4 4l4-4M4 21h16',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14', pen: 'M4 20h4L19 9l-4-4L4 16z',
  spark: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z', check: 'M5 13l4 4L19 7'
};
const ic = (n, s = 24) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;

/* ---------- contoh gaya video ---------- */
const STYLES = [
  { id: 'canyon', name: 'Ngarai 1880', world: 'canyon', env: 'canyon', g: ['#14B88A', '#0A8FA3'], c: '#14B88A', desc: 'Ngarai batu merah dan rel kereta di bawah langit biru.' },
  { id: 'town', name: 'Kota Senja', world: 'town', env: 'town', g: ['#7B5BD6', '#E8714A'], c: '#6FC1FF', desc: 'Jalan berbatu dan gedung berlampu saat matahari terbenam.' },
  { id: 'dawn', name: 'Ngarai Fajar', world: 'canyon', env: 'dawn', g: ['#F4923B', '#D6537A'], c: '#F4923B', desc: 'Ngarai yang sama dengan cahaya fajar yang hangat.' }
];
const sty = id => STYLES.find(s => s.id === id) || STYLES[0];
const HATS = [['cap', 'Baret'], ['bowler', 'Bowler'], ['tophat', 'Topi tinggi']];
const HATC = { cap: '#2b3a55', bowler: '#2b2b33', tophat: '#2b2b33' };
const COLORS = [['#2a9d8f', 'Hijau'], ['#e76f51', 'Merah'], ['#4361ee', 'Biru'], ['#f4a261', 'Oranye'], ['#7a3b9e', 'Ungu']];
const TONES = ['Seru', 'Misterius', 'Lucu', 'Edukatif'];
const VOICES = [['wMKUNhmaI6q0edIyjs4l', 'Reyy · pria, ramah dan tenang'], ['Bwqn6cc0SdnxwdEP80mf', 'Lucky Adrian · pria, bercerita'], ['EdRjgURk0bYsEI1FMHFI', 'Fry · pria, pendongeng dalam'], ['RPwoahKEr9WZSgNHBLbp', 'Dito · pria, narator tenang'], ['fbWrPiTR3TJJxRSdqryZ', 'Vidi · pria, enerjik'], ['zjmMdjff4JG35O3EQJBV', 'Mona · wanita, pendongeng'], ['m6elNOMAsoqePTs244dg', 'Indah · wanita, ekspresif'], ['DrldqYsaKOiBNak7yH5o', 'Damayanti · wanita, ceria']];
const DEMO = 'Halo! Ini contoh gaya videonya. Tokoh kartun berjalan di dunia tiga dimensi. Siap membuat ceritamu?';

/* ---------- naskah -> adegan (kamera & posisi tokoh bergantian) ---------- */
const PRE = [
  (h, g, e) => ({ cam: { p0: [1.1, .7, 4.8], p1: [.35, .95, 3.2], t0: [0, 1.25, 0], t1: [0, 1.3, 0], f0: 52, f1: 48, r0: -2, r1: 1 }, chars: [{ ...h, emo: e, pos: [0, 0, 0] }] }),
  (h, g, e) => ({ cam: { p0: [-.7, .55, 4.2], p1: [.5, .75, 4.8], t0: [0, 1.1, -3], t1: [0, 1.1, -3], f0: 60, f1: 56, r0: 2, r1: -1 }, chars: [{ ...h, emo: e, walk: true, pos: [.15, 0, -7], move: [0, 0, 7.6] }] }),
  (h, g, e) => ({ cam: { p0: [2.6, 1.2, 2.2], p1: [1.3, 1.25, .6], t0: [0, 1.1, -2], t1: [0, 1.2, -1], f0: 54, f1: 46, r0: -3, r1: 0 }, chars: [{ ...h, emo: e, pos: [.3, 0, -3.2] }, ...(g ? [{ ...g, emo: 'smug', pos: [-1.5, 0, -4] }] : [])] }),
  (h, g, e) => ({ shake: 3, cam: { p0: [.9, 1.2, 2.4], p1: [.2, 1.35, 1.5], t0: [0, 1.3, 0], t1: [0, 1.3, 0], f0: 56, f1: 44, r0: -4, r1: 2 }, chars: [{ ...h, emo: e, pos: [0, 0, 0] }] }),
  (h, g, e) => ({ cam: { p0: [.4, .95, 4.6], p1: [-.2, 1.2, 5.6], t0: [0, 1.1, -2], t1: [0, 1.1, -2], f0: 62, f1: 56, r0: -2, r1: 2 }, chars: [{ ...h, emo: e, run: true, pos: [-.3, 0, -8], move: [0, 0, 9.2] }, ...(g ? [{ ...g, emo: 'shock', emoAt: 1.5, pos: [1.7, 0, -1.5] }] : [])] }),
  (h, g, e) => ({ cam: { p0: [.3, .8, 3.4], p1: [.9, 1.5, 5.6], t0: [0, 1.2, 0], t1: [0, 1.25, 0], f0: 50, f1: 56, r0: 0, r1: 0 }, chars: g ? [{ ...h, emo: e, pos: [-.6, 0, 0] }, { ...g, emo: 'smug', pos: [.7, 0, .1] }] : [{ ...h, emo: e, pos: [0, 0, 0] }] })
];
const sentences = t => (String(t).replace(/\s+/g, ' ').trim().match(/[^.!?…]+[.!?…]*/g) || []).map(x => x.trim()).filter(x => x.length > 1);
function buildStory(d, audio) {
  const st = sty(d.style);
  const h = { id: 1, talk: true, hat: d.hero.hat, hatColor: HATC[d.hero.hat], color: d.hero.color };
  const g = d.guest.on ? { id: 2, talk: false, flip: true, hat: d.guest.hat, hatColor: HATC[d.guest.hat], color: d.guest.color, vest: d.guest.hat === 'bowler' } : null;
  return { shots: sentences(d.script).map((text, i) => {
    const n = text.split(' ').length, last = text.slice(-1);
    const emo = last === '!' ? 'shock' : last === '?' ? 'sad' : i % 2 ? 'smug' : 'happy';
    const b = audio?.[i]; // durasi adegan mengikuti panjang suara
    return { text, dur: b ? +(b.duration + .45).toFixed(2) : Math.max(2.4, +(n * .4 + .7).toFixed(1)), audio: b, world: st.world, env: st.env, ...PRE[i % PRE.length](h, g, emo) };
  }) };
}
const akey = d => (d.voice || 'none') + '|' + d.script.trim();
const abufs = d => d.voice && d.voice !== 'none' && W?.audio?.key === akey(d) ? W.audio.bufs : null;
const mk = d => buildStory(d, abufs(d));
const fnErr = async e => { try { return (await e.context.json()).error } catch { return e.message || String(e) } };
const estDur = s => sentences(s).reduce((a, t) => a + Math.max(2.4, t.split(' ').length * .4 + .7), 0);

/* ---------- data: Supabase bila dikonfigurasi, jika tidak localStorage ---------- */
const LS = 'maroom.v1';
let user = null, started = false, D = { name: 'Kreator', series: [], episodes: [] };
const lsGet = () => { try { return JSON.parse(localStorage.getItem(LS)) || null } catch { return null } };
const lsSet = () => { try { localStorage.setItem(LS, JSON.stringify(D)) } catch { toast('Penyimpanan perangkat penuh') } };
async function load() {
  if (sb && user) {
    const [s, e] = await Promise.all([sb.from('series').select('*').order('created_at'), sb.from('episodes').select('*').order('number')]);
    if (s.error || e.error) return toast('Gagal memuat data dari Supabase');
    D = { name: user.user_metadata?.name || user.email.split('@')[0], series: s.data, episodes: e.data };
  } else { const l = lsGet(); if (l) D = l; }
}
async function saveSeries(title) {
  const row = { id: uid(), title, created_at: new Date().toISOString() };
  if (sb && user) { const r = await sb.from('series').insert(row).select().single(); if (r.error) throw r.error; }
  D.series.push(row); if (!sb) lsSet(); return row;
}
async function saveEpisode(ep) {
  if (sb && user) { const r = await sb.from('episodes').upsert(ep); if (r.error) throw r.error; }
  const i = D.episodes.findIndex(x => x.id === ep.id); i < 0 ? D.episodes.push(ep) : D.episodes[i] = ep; if (!sb) lsSet();
}
async function removeEpisode(id) {
  if (sb && user) { const r = await sb.from('episodes').delete().eq('id', id); if (r.error) throw r.error; }
  const gone = D.episodes.find(x => x.id === id);
  if (sb && user && gone?.voice) sb.storage.from('voice').remove(sentences(gone.script).map((_, i) => `${user.id}/${id}/${i}.mp3`)); // best effort
  D.episodes = D.episodes.filter(x => x.id !== id); if (!sb) lsSet();
}
const nextNo = sid => Math.max(0, ...D.episodes.filter(e => e.series_id === sid).map(e => e.number)) + 1;

/* ---------- UI helper ---------- */
let tab = 'home', W = null, statRange = 'month', statView = 'donut', authMode = 'in', thumbs = {};
const view = $('#view'), tabs = $('#tabs'), sheet = $('#sheet');
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 3200); }
const thumbImg = (id, cls = '') => `<img class="${cls}" data-th="${id}" src="${thumbs[id] || ''}" alt="Contoh gaya ${esc(sty(id).name)}" width="110" height="196">`;
const applyThumbs = () => Object.keys(thumbs).forEach(id => document.querySelectorAll(`img[data-th="${id}"]`).forEach(i => i.src = thumbs[id]));
const mascot = () => E ? E.sprite({ hat: 'cap', hatColor: HATC.cap, color: '#2a9d8f', emo: 'happy' }) : '';

function isoCity() { // kota isometrik dekoratif untuk layar masuk
  const S = 30, r = n => { const x = Math.sin(n * 91.7) * 4375.5; return x - Math.floor(x) };
  const pt = (i, j, h = 0) => [(i - j) * S, (i + j) * S / 2 - h];
  const poly = (a, f) => `<polygon points="${a.map(p => p.join(',')).join(' ')}" fill="${f}"/>`;
  const shade = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.substr(i, 2), 16) * k).toString(16).padStart(2, '0')).join('');
  const pal = ['#F28C38', '#E8782A', '#D9A066', '#C98B5B', '#F4B36B', '#E3925A'];
  let o = poly([pt(-.3, -.3), pt(6.3, -.3), pt(6.3, 6.3), pt(-.3, 6.3)], '#5B6571');
  for (let s = 0; s < 11; s++) for (let i = 0; i < 6; i++) { const j = s - i; if (j < 0 || j > 5) continue;
    const m = .08, b = (a, c) => pt(i + a, j + c);
    o += poly([b(m, m), b(1 - m, m), b(1 - m, 1 - m), b(m, 1 - m)], '#D8D2C4');
    if (r(i * 7 + j) < .18) { const [x, y] = pt(i + .5, j + .5); o += `<circle cx="${x}" cy="${y - 14}" r="13" fill="${r(i + j) > .5 ? '#F4923B' : '#4FA79A'}"/><rect x="${x - 2}" y="${y - 6}" width="4" height="8" fill="#6b4a33"/>`; continue; }
    const h = 28 + Math.floor(r(i * 13 + j * 5) * 80), c = pal[Math.floor(r(i * 3 + j * 11) * pal.length)], k = .16, f = (a, d, z) => pt(i + a, j + d, z);
    o += poly([f(1 - k, k, 0), f(1 - k, 1 - k, 0), f(1 - k, 1 - k, h), f(1 - k, k, h)], shade(c, .7)) + poly([f(k, 1 - k, 0), f(1 - k, 1 - k, 0), f(1 - k, 1 - k, h), f(k, 1 - k, h)], shade(c, .85)) + poly([f(k, k, h), f(1 - k, k, h), f(1 - k, 1 - k, h), f(k, 1 - k, h)], c);
  }
  return `<svg class="city" viewBox="-190 -120 380 330" role="img" aria-label="Ilustrasi kota isometrik">${o}</svg>`;
}
const logo = `<div class="logo"><svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 30L32 8l24 22v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" fill="#14B88A"/><path d="M26 25l16 9-16 9z" fill="#fff"/></svg><span>MAROOM</span><small style="font-weight:600;letter-spacing:0">Studio</small></div>`;

/* ---------- layar ---------- */
function vAuth() {
  view.className = 'splash';
  view.innerHTML = isoCity() + logo + (sb ? `<form id="auth"><label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label><label class="field"><span>Kata sandi</span><input name="pw" type="password" minlength="6" autocomplete="${authMode === 'in' ? 'current-password' : 'new-password'}" required></label><button class="btn">${authMode === 'in' ? 'Masuk' : 'Daftar'}</button></form><p class="note">${authMode === 'in' ? 'Belum punya akun?' : 'Sudah punya akun?'} <button class="link" data-act="authmode">${authMode === 'in' ? 'Daftar' : 'Masuk'}</button> sekarang</p>`
    : `<button class="btn" data-act="start">Mulai berkarya</button><p class="note">Mode lokal: data tersimpan di perangkat ini. Hubungkan Supabase lewat config.js untuk akun dan sinkronisasi.</p>`);
  tabs.hidden = true;
}
function vHome() {
  const chips = [['Tulis naskah', 'pen', ['#14B88A', '#0A8FA3'], 'new:own'], ['Bantu AI', 'spark', ['#0FA3B1', '#2A6FDB'], 'new:ai'], ...STYLES.map(s => [s.name, 'film', s.g, 'tab:styles'])];
  const eps = [...D.episodes].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
  return `<div class="hello"><div><small>Hai</small><h1>${esc(D.name)}!</h1></div><div class="avatar" aria-hidden="true">${esc(D.name[0].toUpperCase())}</div></div>
  <div class="chips">${chips.map(c => `<button class="chip" style="--g1:${c[2][0]};--g2:${c[2][1]}" data-act="${c[3]}"><span class="ci">${ic(c[1], 24)}</span><b>${esc(c[0])}</b></button>`).join('')}</div>
  ${eps.length ? `<div class="sec"><h2>Episode terbaru</h2><button class="link" data-act="tab:episodes">Semua</button></div>${eps.map(epRow).join('')}`
    : `<div class="empty"><img src="${mascot()}" alt=""><h2>Belum ada episode</h2><p>Di sini kamu membuat video animasi: tulis ide sendiri atau minta AI, pilih gaya, lalu simpan sebagai episode.</p></div>`}
  <div class="cta"><button class="btn" data-act="new">Buat video</button></div>`;
}
const epRow = e => { const se = D.series.find(s => s.id === e.series_id);
  return `<button class="row" data-act="ep" data-id="${e.id}"><img class="th" src="${e.thumb || ''}" alt="" width="56" height="100"><span class="rt"><b>${esc(e.title)}</b><small>${esc(se?.title || '')} · Eps ${e.number} · ${esc(sty(e.style).name)}</small></span><span class="pill ${e.status}">${e.status === 'done' ? 'Selesai' : 'Draf'}</span></button>`; };
function vEpisodes() {
  const by = D.series.map(s => [s, D.episodes.filter(e => e.series_id === s.id).sort((a, b) => a.number - b.number)]).filter(x => x[1].length);
  return `<div class="sec" style="margin-top:0"><h1 style="font-size:24px">Episode</h1><button class="ib" data-act="new" aria-label="Buat episode baru">${ic('plus')}</button></div>
  ${by.length ? by.map(([s, es]) => `<div class="sec"><h2>${esc(s.title)}</h2><button class="link" data-act="new" data-series="${s.id}">+ Episode</button></div>${es.map(epRow).join('')}`).join('')
    : `<div class="empty"><img src="${mascot()}" alt=""><h2>Belum ada seri</h2><p>Episode dikelompokkan dalam seri. Buat video pertamamu dan tentukan serinya di langkah Episode.</p></div>`}`;
}
const vStyles = () => `<h1 style="font-size:24px;margin-bottom:14px">Gaya video</h1>${STYLES.map(s => `<div class="stylecard">${thumbImg(s.id)}<div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p><button class="btn sm ghost" data-act="demo" data-id="${s.id}">${ic('play', 18)} Lihat contoh</button><button class="btn sm" data-act="new" data-style="${s.id}">Pakai gaya</button></div></div>`).join('')}`;

function donut(data) {
  const tot = data.reduce((a, b) => a + b.v, 0), R = 70, C = 2 * Math.PI * R; let off = 0, a0 = 0;
  if (!tot) return `<svg class="donut" viewBox="0 0 200 200" role="img" aria-label="Belum ada data"><circle cx="100" cy="100" r="${R}" fill="none" stroke="#fff" stroke-width="34"/></svg>`;
  return `<svg class="donut" viewBox="0 0 200 200" role="img" aria-label="Episode per gaya: ${data.map(d => `${d.n} ${d.v}`).join(', ')}">${data.filter(d => d.v).map(d => { const len = d.v / tot * C, ang = (a0 + d.v / tot / 2) * 2 * Math.PI - Math.PI / 2; a0 += d.v / tot;
    const el = `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${d.c}" stroke-width="34" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 100 100)"/><text x="${100 + R * Math.cos(ang)}" y="${100 + R * Math.sin(ang) + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#14213D">${Math.round(d.v / tot * 100)}%</text>`; off += len; return el; }).join('')}</svg>`;
}
function vStats() {
  const days = { week: 7, month: 30, year: 365 }[statRange], since = Date.now() - days * 864e5;
  const es = D.episodes.filter(e => new Date(e.created_at) >= since);
  const data = STYLES.map(s => ({ n: s.name, c: s.c, v: es.filter(e => e.style === s.id).length })), tot = es.length, dur = es.reduce((a, e) => a + (e.dur || 0), 0);
  return `<h1 style="font-size:24px;margin-bottom:14px">Statistik</h1><div class="card"><div class="sec" style="margin:0"><h2 style="font-size:16px">Episode per gaya</h2><div class="seg" style="margin:0">${[['donut', 'Donat'], ['bar', 'Batang']].map(([k, l]) => `<button data-act="sv:${k}" aria-pressed="${statView === k}">${l}</button>`).join('')}</div></div>
  ${statView === 'donut' ? donut(data) : `<div class="bars">${data.map(d => `<div class="bar"><span>${esc(d.n)}</span><div><i style="width:${tot ? d.v / tot * 100 : 0}%;background:${d.c}"></i></div><b>${d.v}</b></div>`).join('')}</div>`}
  <div class="seg" role="group" aria-label="Rentang waktu">${[['week', 'Minggu'], ['month', 'Bulan'], ['year', 'Tahun']].map(([k, l]) => `<button data-act="sr:${k}" aria-pressed="${statRange === k}">${l}</button>`).join('')}</div>
  <div class="legend">${data.map(d => `<span><i style="background:${d.c}"></i>${esc(d.n)}: ${d.v}</span>`).join('')}</div></div>
  <div class="tiles"><div class="tile"><small>Jumlah episode</small><b>${tot}</b></div><div class="tile"><small>Total durasi</small><b>${Math.floor(dur / 60)}m ${Math.round(dur % 60)}d</b></div></div>`;
}
const vAccount = () => `<h1 style="font-size:24px;margin-bottom:14px">Akun</h1><label class="field"><span>Nama panggilan</span><input data-name value="${esc(D.name)}" maxlength="30"></label>
  <div class="card"><b>${sb ? 'Terhubung ke Supabase' : 'Mode lokal'}</b><p class="hint" style="margin-top:4px">${sb ? esc(user?.email || '') : 'Data tersimpan di perangkat ini. Isi config.js dengan URL dan kunci anon Supabase "Maroom-Studio" untuk akun dan sinkronisasi.'}</p></div>
  ${sb ? '<div class="cta"><button class="btn ghost" data-act="logout">Keluar</button></div>' : ''}<p class="note" style="margin-top:16px;text-align:center">Maroom Studio ${E ? '' : '· WebGL tidak tersedia di perangkat ini, pratinjau dimatikan'}</p>`;

const TABS = [['home', 'Beranda', 'home', vHome], ['episodes', 'Episode', 'film', vEpisodes], ['styles', 'Gaya', 'layers', vStyles], ['stats', 'Statistik', 'chart', vStats], ['account', 'Akun', 'user', vAccount]];
function render() {
  if (!started) return vAuth();
  view.className = '';
  view.innerHTML = TABS.find(t => t[0] === tab)[3]();
  tabs.hidden = false;
  tabs.innerHTML = TABS.map(t => `<button data-act="tab:${t[0]}" ${t[0] === tab ? 'aria-current="page"' : ''}>${ic(t[2])}${t[1]}</button>`).join('');
  applyThumbs();
}

/* ---------- sheet & wizard ---------- */
function openSheet(html) { sheet.innerHTML = `<div class="panel" role="dialog" aria-modal="true" tabindex="-1">${html}</div>`; sheet.hidden = false; $('.panel', sheet).focus(); }
function closeSheet() { E && E.stop(); sheet.hidden = true; sheet.innerHTML = ''; W = null; }
const stage = () => E ? '<div class="stage" id="stage"></div>' : '<p class="note">Pratinjau butuh WebGL2, yang tidak tersedia di perangkat ini.</p>';
const mountStage = story => { const s = $('#stage'); if (s && E) { s.appendChild(E.canvas); E.play(story); } };

function openWizard(init = {}) {
  init = Object.fromEntries(Object.entries(init).filter(([, v]) => v !== undefined));
  const first = D.series[0]?.id || 'new', sid = init.series_id || first;
  W = { step: init.id ? 1 : (init.mode || init.style ? 1 : 0), d: {
    id: init.id, mode: init.mode || 'own', title: '', script: '', topic: '', tone: 'Seru', scenes: 6, style: init.style || 'canyon',
    hero: { hat: 'cap', color: '#2a9d8f' }, guest: { on: false, hat: 'bowler', color: '#f4a261' }, voice: 'none',
    seriesId: sid, newSeries: '', number: sid === 'new' ? 1 : nextNo(sid), ...init, status: init.status } };
  wiz();
}
const STEPS = ['Cara membuat', 'Naskah', 'Gaya video', 'Tokoh & suara', 'Episode', 'Pratinjau'];
function wiz() {
  const d = W.d, s = W.step; E && E.stop();
  let body = '', foot = `<button class="btn" data-act="wnext">${s === 5 ? 'Simpan episode' : 'Lanjut'}</button>`;
  if (s === 0) body = [['own', 'pen', 'Tulis sendiri', 'Punya ide atau naskah? Ketik atau tempel langsung.'], ['ai', 'spark', 'Bantu AI', 'Tulis topiknya saja, AI menyusun naskah yang bisa kamu ubah.']]
    .map(m => `<button class="mode" data-act="wmode:${m[0]}" aria-pressed="${d.mode === m[0]}"><span class="mi">${ic(m[1], 26)}</span><span><b>${m[2]}</b><small>${m[3]}</small></span></button>`).join('');
  if (s === 1) body = (d.mode === 'ai' ? `<label class="field"><span>Topik cerita</span><input data-f="topic" value="${esc(d.topic)}" maxlength="200" placeholder="mis. kereta terakhir di gurun"></label>
    <div class="field"><span class="lbl">Nuansa</span><div class="opts">${TONES.map(t => `<button class="opt" data-act="wtone:${t}" aria-pressed="${d.tone === t}">${t}</button>`).join('')}</div></div>
    <div class="field"><span class="lbl">Jumlah adegan</span><div class="opts">${[4, 6, 8, 10].map(n => `<button class="opt" data-act="wsc:${n}" aria-pressed="${d.scenes === n}">${n}</button>`).join('')}</div></div>
    <button class="btn ghost" style="margin-bottom:16px" data-act="wgen">${ic('spark', 20)} Buatkan naskah</button>` : '')
    + `<label class="field"><span>Naskah narasi</span><textarea data-f="script" placeholder="Satu kalimat = satu adegan. Akhiri dengan . ! atau ?">${esc(d.script)}</textarea><span class="hint" id="cnt">${sentences(d.script).length} adegan · sekitar ${Math.round(estDur(d.script))} detik</span></label>`;
  if (s === 2) body = `<div class="pick">${STYLES.map(x => `<button data-act="wstyle:${x.id}" aria-pressed="${d.style === x.id}">${thumbImg(x.id)}<b>${esc(x.name)}</b></button>`).join('')}</div><p class="hint" style="margin-top:12px">${esc(sty(d.style).desc)}</p>`;
  if (s === 3) body = `<div class="who"><img src="${E ? E.sprite({ hat: d.hero.hat, hatColor: HATC[d.hero.hat], color: d.hero.color, emo: 'happy' }) : ''}" alt="Tokoh utama"><div><div class="field"><span class="lbl">Topi</span><div class="opts">${HATS.map(h => `<button class="opt" data-act="what:${h[0]}" aria-pressed="${d.hero.hat === h[0]}">${h[1]}</button>`).join('')}</div></div></div></div>
    <div class="field"><span class="lbl">Warna baju</span><div class="opts">${COLORS.map(c => `<button class="sw" data-act="wcol:${c[0]}" aria-label="${c[1]}" aria-pressed="${d.hero.color === c[0]}"><i style="background:${c[0]}"></i></button>`).join('')}</div></div>
    <div class="sw-on"><span>Tambah tokoh kedua</span><button class="opt" role="switch" aria-checked="${d.guest.on}" data-act="wguest">${d.guest.on ? 'Aktif' : 'Mati'}</button></div>
    ${sb && user ? `<label class="field"><span>Suara narasi (ElevenLabs)</span><select data-f="voice"><option value="none">Tanpa suara</option>${VOICES.map(v => `<option value="${v[0]}" ${d.voice === v[0] ? 'selected' : ''}>${esc(v[1])}</option>`).join('')}</select><span class="hint">Suara dibuat di langkah Pratinjau dan memakai kredit ElevenLabs.</span></label>` : '<p class="hint">Suara narasi tersedia setelah masuk dengan akun.</p>'}
    ${d.guest.on ? `<div class="field"><span class="lbl">Topi tokoh kedua</span><div class="opts">${HATS.map(h => `<button class="opt" data-act="wghat:${h[0]}" aria-pressed="${d.guest.hat === h[0]}">${h[1]}</button>`).join('')}</div></div>` : ''}`;
  if (s === 4) body = `<label class="field"><span>Seri</span><select data-f="seriesId">${D.series.map(x => `<option value="${x.id}" ${d.seriesId === x.id ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}<option value="new" ${d.seriesId === 'new' ? 'selected' : ''}>+ Seri baru…</option></select></label>
    ${d.seriesId === 'new' ? `<label class="field"><span>Nama seri baru</span><input data-f="newSeries" value="${esc(d.newSeries)}" maxlength="60"></label>` : ''}
    <label class="field"><span>Judul episode (Eps ${d.number})</span><input data-f="title" value="${esc(d.title)}" maxlength="80" placeholder="mis. Rel yang putus"></label>`;
  if (s === 5) { const vo = d.voice !== 'none' ? (abufs(d) ? `<p class="hint" style="text-align:center">Suara siap · ${sentences(d.script).length} kalimat</p>` : `<button class="btn ghost" style="margin-bottom:12px" data-act="wvoice">${ic('spark', 20)} Buat suara narasi (${d.script.trim().length} karakter)</button>`) : ''; body = vo + stage() + `<div class="script">${esc(d.script)}</div>`; foot += `<button class="btn ghost" data-act="wexport">${ic('down', 20)} Ekspor video (.webm)</button>`; }
  openSheet(`<header class="top"><button class="ib" data-act="wback" aria-label="${s ? 'Langkah sebelumnya' : 'Tutup'}">${ic(s ? 'back' : 'x')}</button><h2>${STEPS[s]}</h2><span class="ib"></span></header>
    <div class="steps" role="progressbar" aria-valuemin="1" aria-valuemax="6" aria-valuenow="${s + 1}" aria-label="Langkah ${s + 1} dari 6">${STEPS.map((_, i) => `<i class="${i <= s ? 'on' : ''}"></i>`).join('')}</div><div class="body">${body}</div><div class="foot">${foot}</div>`);
  if (s === 2) applyThumbs();
  if (s === 5) mountStage(mk(d));
}
function fallbackScript(topic, n) {
  const L = [`Hari ini kita bahas ${topic}.`, 'Semuanya dimulai dari hal yang sangat sederhana.', 'Tapi tidak ada yang menyangka apa yang terjadi berikutnya.', `Ada sesuatu yang aneh tentang ${topic}!`, 'Apa sebenarnya yang tersembunyi di baliknya?', 'Ternyata jawabannya jauh lebih seru dari dugaan.', 'Satu per satu, semua petunjuk mulai terhubung.', 'Dan di sinilah ceritanya berubah total!', 'Sekarang kamu tahu rahasianya.', 'Ikuti terus episode berikutnya.'];
  return [...L.slice(0, n - 1), L[9]].join(' ');
}
async function generate() {
  const d = W.d; if (d.topic.trim().length < 3) return toast('Tulis topik dulu');
  const btn = $('[data-act=wgen]'); btn.disabled = true; btn.textContent = 'Menyusun naskah…';
  try {
    if (sb && user) { const r = await sb.functions.invoke('ai-script', { body: { topic: d.topic.trim(), tone: d.tone, scenes: d.scenes } }); if (r.error || !r.data?.script) throw r.error || new Error('kosong'); d.script = r.data.script; }
    else { d.script = fallbackScript(d.topic.trim(), d.scenes); toast('AI belum tersambung (Supabase belum diisi): memakai kerangka otomatis'); }
  } catch (e) { d.script = fallbackScript(d.topic.trim(), d.scenes); toast('AI gagal (' + await fnErr(e) + '): memakai kerangka otomatis'); }
  wiz();
}
async function genVoice() {
  const d = W.d, parts = sentences(d.script), btn = $('[data-act=wvoice]');
  if (parts.some(p => p.length > 300)) return toast('Satu kalimat maksimal 300 karakter');
  btn.disabled = true; const raws = [];
  try {
    for (let i = 0; i < parts.length; i++) {
      btn.textContent = `Membuat suara ${i + 1}/${parts.length}…`;
      const r = await sb.functions.invoke('tts', { body: { text: parts[i], voice_id: d.voice } });
      if (r.error || !(r.data instanceof Blob)) throw r.error || new Error('audio kosong');
      raws.push(await r.data.arrayBuffer());
    }
    W.audio = { key: akey(d), raws, bufs: await Promise.all(raws.map(r => E.decode(r))) };
  } catch (e) { toast('Gagal membuat suara: ' + await fnErr(e)); }
  wiz();
}
async function loadAudio(e) {
  if (!e.voice || !sb || !user) return null;
  try {
    const raws = await Promise.all(sentences(e.script).map(async (_, i) => { const r = await sb.storage.from('voice').download(`${user.id}/${e.id}/${i}.mp3`); if (r.error) throw r.error; return r.data.arrayBuffer(); }));
    return { key: akey(e), raws, bufs: await Promise.all(raws.map(r => E.decode(r))) };
  } catch { toast('Audio episode tidak bisa dimuat'); return null; }
}
async function saveEp(done) {
  const d = W.d; let sid = d.seriesId;
  if (sid === 'new') sid = (await saveSeries(d.newSeries.trim() || d.title.trim())).id;
  const voiced = d.voice !== 'none';
  if (voiced && !abufs(d)) throw new Error('Buat suara narasi dulu di Pratinjau, atau pilih "Tanpa suara"');
  const story = mk(d), dur = E ? E.load(story) : estDur(d.script), thumb = E ? E.still(story, Math.min(1.2, dur / 2)) : '';
  const ep = { id: d.id || uid(), series_id: sid, number: d.number, title: d.title.trim(), script: d.script.trim(), style: d.style, hero: d.hero, guest: d.guest, voice: voiced ? d.voice : null, status: done ? 'done' : (d.status || 'draft'), dur: +dur.toFixed(1), thumb, created_at: d.created_at || new Date().toISOString() };
  await saveEpisode(ep);
  if (voiced) for (const [i, raw] of W.audio.raws.entries()) { const r = await sb.storage.from('voice').upload(`${user.id}/${ep.id}/${i}.mp3`, new Blob([raw], { type: 'audio/mpeg' }), { upsert: true, contentType: 'audio/mpeg' }); if (r.error) throw r.error; }
  Object.assign(d, { id: ep.id, created_at: ep.created_at, seriesId: sid, status: ep.status }); return ep;
}
async function wnext() {
  const d = W.d, s = W.step;
  if (s === 1 && sentences(d.script).length < 1) return toast('Tulis naskah dulu (minimal satu kalimat)');
  if (s === 4 && !d.title.trim()) return toast('Isi judul episode');
  if (s === 4 && d.seriesId === 'new' && !d.newSeries.trim()) d.newSeries = d.title.trim();
  if (s < 5) { W.step++; return wiz(); }
  try { await saveEp(false); closeSheet(); tab = 'episodes'; render(); toast('Episode tersimpan'); } catch (e) { toast('Gagal menyimpan: ' + (e.message || e)); }
}
async function exportVideo(story, saveAfter) {
  const b = $('[data-act=wexport]') || $('[data-act=dexport]'); if (!b) return; b.disabled = true;
  try {
    const blob = await E.record(story, p => b.textContent = `Merekam… ${Math.round(p * 100)}%`);
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (W?.d?.title || W?.ep?.title || 'maroom') + '.webm'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
    if (saveAfter) await saveAfter(); toast('Video diekspor');
  } catch (e) { toast('Ekspor gagal: ' + (e.message || e)); }
  b.disabled = false; b.innerHTML = `${ic('down', 20)} Ekspor video (.webm)`; E.play(story);
}
async function openEp(id) {
  const e = D.episodes.find(x => x.id === id), se = D.series.find(s => s.id === e.series_id); W = { ep: e };
  openSheet(`<header class="top"><button class="ib" data-act="close" aria-label="Tutup">${ic('x')}</button><h2>${esc(e.title)}</h2><span class="ib"></span></header><div class="body"><p class="hint" style="text-align:center">${esc(se?.title || '')} · Eps ${e.number} · ${esc(sty(e.style).name)}</p>${stage()}<div class="script">${esc(e.script)}</div></div>
  <div class="foot"><button class="btn" data-act="dexport">${ic('down', 20)} Ekspor video (.webm)</button><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn ghost" data-act="dedit">${ic('pen', 18)} Ubah</button><button class="btn danger" data-act="ddel">${ic('trash', 18)} Hapus</button></div></div>`);
  W.audio = await loadAudio(e); if (W?.ep === e) mountStage(mk(e));
}
function demo(id) {
  const story = buildStory({ script: DEMO, style: id, hero: { hat: 'cap', color: '#2a9d8f' }, guest: { on: false } });
  openSheet(`<header class="top"><button class="ib" data-act="close" aria-label="Tutup">${ic('x')}</button><h2>${esc(sty(id).name)}</h2><span class="ib"></span></header><div class="body">${stage()}</div><div class="foot"><button class="btn" data-act="new" data-style="${id}">Pakai gaya ini</button></div>`);
  mountStage(story);
}

/* ---------- aksi ---------- */
document.addEventListener('click', async ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const [a, v] = el.dataset.act.split(':'), d = W?.d;
  if (a === 'tab') { closeSheet(); tab = v; render(); scrollTo(0, 0); }
  else if (a === 'start') { started = true; lsSet(); render(); setTimeout(genThumbs, 30); }
  else if (a === 'authmode') { authMode = authMode === 'in' ? 'up' : 'in'; vAuth(); }
  else if (a === 'new') { closeSheet(); openWizard({ mode: v, style: el.dataset.style, series_id: el.dataset.series }); }
  else if (a === 'ep') openEp(el.dataset.id);
  else if (a === 'demo') demo(el.dataset.id);
  else if (a === 'close') closeSheet();
  else if (a === 'sv') { statView = v; render(); } else if (a === 'sr') { statRange = v; render(); }
  else if (a === 'logout') { await sb.auth.signOut(); user = null; started = false; D = { name: 'Kreator', series: [], episodes: [] }; render(); }
  else if (a === 'wback') W.step ? (W.step--, wiz()) : closeSheet();
  else if (a === 'wnext') wnext();
  else if (a === 'wmode') { d.mode = v; wiz(); } else if (a === 'wtone') { d.tone = v; wiz(); } else if (a === 'wsc') { d.scenes = +v; wiz(); }
  else if (a === 'wgen') generate(); else if (a === 'wstyle') { d.style = v; wiz(); }
  else if (a === 'what') { d.hero.hat = v; wiz(); } else if (a === 'wcol') { d.hero.color = v; wiz(); }
  else if (a === 'wguest') { d.guest.on = !d.guest.on; wiz(); } else if (a === 'wghat') { d.guest.hat = v; wiz(); }
  else if (a === 'wvoice') genVoice()
  else if (a === 'wexport') exportVideo(mk(d), async () => { await saveEp(true); });
  else if (a === 'dexport') { const e = W.ep; exportVideo(mk(e), async () => { e.status = 'done'; await saveEpisode(e); render(); }); }
  else if (a === 'dedit') { const e = W.ep, au = W.audio; closeSheet(); openWizard({ ...e, seriesId: e.series_id, mode: 'own', voice: e.voice || 'none' }); W.audio = au; }
  else if (a === 'ddel') { if (confirm('Hapus episode ini?')) { try { await removeEpisode(W.ep.id); closeSheet(); render(); toast('Episode dihapus'); } catch (e) { toast('Gagal menghapus') } } }
});
document.addEventListener('input', ev => {
  const f = ev.target.dataset.f; if (f && W?.d) { W.d[f] = ev.target.value; if (f === 'script') $('#cnt').textContent = `${sentences(W.d.script).length} adegan · sekitar ${Math.round(estDur(W.d.script))} detik`; }
  if (ev.target.dataset.name !== undefined) { D.name = ev.target.value.trim() || 'Kreator'; sb && user ? sb.auth.updateUser({ data: { name: D.name } }) : lsSet(); }
});
document.addEventListener('change', ev => { if (ev.target.dataset.f === 'seriesId') { const d = W.d; d.seriesId = ev.target.value; if (!d.id) d.number = d.seriesId === 'new' ? 1 : nextNo(d.seriesId); wiz(); } });
document.addEventListener('submit', async ev => {
  if (ev.target.id !== 'auth') return; ev.preventDefault();
  const f = new FormData(ev.target), cred = { email: f.get('email'), password: f.get('pw') }, btn = $('button', ev.target); btn.disabled = true;
  const r = authMode === 'in' ? await sb.auth.signInWithPassword(cred) : await sb.auth.signUp(cred); btn.disabled = false;
  if (r.error) return toast(r.error.message);
  if (!r.data.session) return toast('Cek emailmu untuk konfirmasi, lalu masuk');
  user = r.data.session.user; started = true; await load(); render(); setTimeout(genThumbs, 30);
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !sheet.hidden) closeSheet(); });

/* ---------- mulai ---------- */
function genThumbs() {
  if (!E) return;
  STYLES.forEach(s => { thumbs[s.id] = E.still(buildStory({ script: DEMO, style: s.id, hero: { hat: 'cap', color: '#2a9d8f' }, guest: { on: false } }), 1.0); });
  applyThumbs();
}
(async () => {
  if (sb) { const { data } = await sb.auth.getSession(); user = data.session?.user || null; started = !!user; }
  else started = !!lsGet();
  if (started) await load();
  render(); if (started) setTimeout(genThumbs, 30);
})();
})();

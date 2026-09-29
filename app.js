/* UI məntiqi: formu oxuyur, mühərriki çağırır, nəticəni göstərir. */
(function () {
  const T = window.TEMPLATES;
  const E = window.PromptEngine;
  const $ = id => document.getElementById(id);
  const STORE_KEY = 'mpg.settings.v2';

  const el = {
    idea: $('idea'), audience: $('audience'), goal: $('goal'), length: $('length'),
    domain: $('domain'), tone: $('tone'), rlang: $('rlang'), format: $('format'), detail: $('detail'),
    clarify: $('clarify'), thinking: $('thinking'),
    output: $('output'), copy: $('copyBtn'), stats: $('stats'), detected: $('detected'),
    modeHelp: $('modeHelp'), examples: $('examples'), toast: $('toast')
  };

  const MODE_HELP = {
    prompt: 'Şablonlarla dərhal qurulmuş prompt. Kopyalayın və Claude-a yapışdırın — lazım olsa, əvvəlcə burada düzəldin.',
    meta: 'Bu mətni Claude-a verin: o, lazım olsa suallar verəcək və ideyanız üçün xüsusi prompt yazacaq.'
  };

  let plang = 'en';
  let mode = 'prompt';

  /* ---------- Seçimləri doldur ---------- */
  function fillSelect(sel, obj, first) {
    const opts = first ? [first] : [];
    for (const [k, v] of Object.entries(obj)) opts.push([k, v.label]);
    sel.innerHTML = opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  }
  fillSelect(el.domain, T.DOMAINS, ['auto', 'Avtomatik']);
  fillSelect(el.tone, T.TONES);
  fillSelect(el.rlang, T.RESPONSE_LANGS);
  fillSelect(el.format, T.FORMATS);
  fillSelect(el.detail, T.DETAIL);
  el.detail.value = 'standard';

  T.EXAMPLES.forEach(text => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'example'; b.textContent = text; b.title = text;
    b.addEventListener('click', () => { el.idea.value = text; render(); el.idea.focus(); });
    el.examples.appendChild(b);
  });

  /* ---------- Parametrlərin yadda saxlanması (brauzerdə) ---------- */
  const SELECTS = ['domain', 'tone', 'rlang', 'format', 'detail'];
  const CHECKS = ['clarify', 'thinking'];

  function saveSettings() {
    const s = { plang, mode };
    SELECTS.forEach(f => (s[f] = el[f].value));
    CHECKS.forEach(f => (s[f] = el[f].checked));
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  }
  function loadSettings() {
    let s;
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch { s = null; }
    if (!s) return;
    SELECTS.forEach(f => { if ([...el[f].options].some(o => o.value === s[f])) el[f].value = s[f]; });
    CHECKS.forEach(f => (el[f].checked = !!s[f]));
    if (s.plang === 'az' || s.plang === 'en') plang = s.plang;
    if (s.mode === 'meta' || s.mode === 'prompt') mode = s.mode;
  }

  /* ---------- Render ---------- */
  const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function syncControls() {
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.plang === plang));
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    el.modeHelp.textContent = MODE_HELP[mode];
  }

  function updateStats() {
    const text = el.output.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    el.stats.textContent = text ? `${words} söz · ~${Math.ceil(text.length / 4)} token` : '';
    el.copy.disabled = !text;
  }

  function render() {
    syncControls();
    const idea = el.idea.value;
    if (!idea.trim()) {
      el.output.value = '';
      el.detected.innerHTML = '';
      updateStats();
      return;
    }
    const opts = {
      idea, plang,
      domain: el.domain.value, tone: el.tone.value, rlang: el.rlang.value,
      format: el.format.value, detail: el.detail.value,
      audience: el.audience.value, goal: el.goal.value, length: el.length.value,
      clarify: el.clarify.checked, thinking: el.thinking.checked
    };
    const { text, meta } = mode === 'meta' ? E.buildMeta(opts) : E.build(opts);
    el.output.value = text;

    const bits = [`Sahə: <b>${T.DOMAINS[meta.domainKey].label}</b>`];
    if (meta.tech.length) bits.push(`<b>${escapeHtml(meta.tech.join(', '))}</b>`);
    if (meta.platforms.length) bits.push(`<b>${meta.platforms.map(p => p[0].toUpperCase() + p.slice(1)).join(', ')}</b>`);
    if (mode === 'prompt') bits.push(`Format: <b>${T.FORMATS[meta.formatKey].label}</b>`);
    el.detected.innerHTML = bits.join(' · ');
    updateStats();
  }

  let timer;
  const renderSoon = () => { clearTimeout(timer); timer = setTimeout(render, 120); };

  /* ---------- Kopyalama ---------- */
  function toast(msg, isError) {
    el.toast.textContent = msg;
    el.toast.classList.toggle('error', !!isError);
    el.toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // file:// və köhnə brauzerlər üçün ehtiyat yol
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      if (!ok) throw new Error('copy failed');
    }
  }

  async function copyOutput() {
    const text = el.output.value.trim();
    if (!text) { toast('Əvvəlcə ideyanızı yazın', true); el.idea.focus(); return; }
    try {
      await copyText(text);
      toast(mode === 'meta' ? '✓ Kopyalandı — Claude-a yapışdırın, o, promptu yazacaq' : '✓ Prompt kopyalandı — Claude-a yapışdırın');
    } catch { toast('Kopyalamaq alınmadı', true); }
  }

  /* ---------- Hadisələr ---------- */
  el.copy.addEventListener('click', copyOutput);

  document.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => {
    plang = b.dataset.plang; saveSettings(); render();
  }));
  document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode; saveSettings(); render();
  }));

  [el.idea, el.audience, el.goal, el.length].forEach(i => i.addEventListener('input', renderSoon));
  [...SELECTS, ...CHECKS].forEach(f => el[f].addEventListener('change', () => { saveSettings(); render(); }));
  el.output.addEventListener('input', updateStats);

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); copyOutput(); }
  });

  loadSettings();
  render();
})();

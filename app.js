/* UI məntiqi: formu oxuyur, mühərriki çağırır, nəticəni göstərir. */
(function () {
  const T = window.TEMPLATES;
  const E = window.PromptEngine;
  const $ = id => document.getElementById(id);
  const STORE_KEY = 'mpg.settings.v1';
  const HIST_KEY = 'mpg.history.v1';

  const el = {
    idea: $('idea'), domain: $('domain'), tone: $('tone'), rlang: $('rlang'), format: $('format'),
    detail: $('detail'), style: $('style'), customRole: $('customRole'), audience: $('audience'),
    extra: $('extra'), output: $('output'), copy: $('copyBtn'), download: $('downloadBtn'),
    generate: $('generateBtn'), reset: $('resetBtn'), stats: $('stats'), toast: $('toast'),
    meter: $('meterFill'), quality: $('qualityLabel'), detected: $('detected'), hints: $('hints'),
    history: $('history'), sections: $('sections')
  };

  let plang = 'en';
  let current = '';

  /* ---------- Seçimləri doldur ---------- */
  function fillSelect(sel, obj, first) {
    const opts = first ? [[first[0], first[1]]] : [];
    for (const [k, v] of Object.entries(obj)) opts.push([k, v.label]);
    sel.innerHTML = opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  }
  fillSelect(el.domain, T.DOMAINS, ['auto', 'Avtomatik aşkarla']);
  fillSelect(el.tone, T.TONES);
  fillSelect(el.rlang, T.RESPONSE_LANGS);
  fillSelect(el.format, T.FORMATS);
  fillSelect(el.detail, T.DETAIL);
  el.detail.value = 'standard';

  /* ---------- Yaddaş (localStorage, təhlükəsiz) ---------- */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };
  const FIELDS = ['domain', 'tone', 'rlang', 'format', 'detail', 'style'];

  function saveSettings() {
    const s = { plang, sections: [...selectedSections()] };
    FIELDS.forEach(f => (s[f] = el[f].value));
    store.set(STORE_KEY, s);
  }
  function loadSettings() {
    const s = store.get(STORE_KEY, null);
    if (!s) return;
    FIELDS.forEach(f => { if (s[f] && [...el[f].options].some(o => o.value === s[f])) el[f].value = s[f]; });
    if (s.plang) setPlang(s.plang, true);
    if (Array.isArray(s.sections)) {
      el.sections.querySelectorAll('input').forEach(i => (i.checked = s.sections.includes(i.value)));
    }
  }

  /* ---------- Köməkçilər ---------- */
  const selectedSections = () =>
    new Set([...el.sections.querySelectorAll('input:checked')].map(i => i.value));

  const escapeHtml = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function highlight(text) {
    return escapeHtml(text)
      .replace(/&lt;\/?[a-z_]+&gt;/g, m => `<span class="tag">${m}</span>`)
      .replace(/^## .*$/gm, m => `<span class="hd">${m}</span>`)
      .replace(/\[[^\]\n]+\]/g, m => `<span class="ph">${m}</span>`);
  }

  function toast(msg, isError) {
    el.toast.textContent = msg;
    el.toast.classList.toggle('error', !!isError);
    el.toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  function setPlang(l, silent) {
    plang = l;
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.plang === l));
    if (!silent) { saveSettings(); render(); }
  }

  /* ---------- Əsas render ---------- */
  function renderAnalysis(idea, meta) {
    const a = E.analyze(idea);
    el.meter.style.width = (idea.trim() ? Math.max(a.score, 6) : 0) + '%';
    el.meter.style.background = a.score >= 70 ? 'var(--good)' : a.score >= 40 ? 'var(--warn)' : 'var(--bad)';
    el.quality.textContent = !idea.trim() ? 'Yazmağa başlayın…'
      : a.score >= 70 ? `Əla ideya təsviri (${a.score}/100)`
      : a.score >= 40 ? `Yaxşıdır, amma artırmaq olar (${a.score}/100)`
      : `Çox qısadır (${a.score}/100)`;
    el.hints.innerHTML = a.hints.map(h => `<li>${escapeHtml(h)}</li>`).join('');

    if (!meta) { el.detected.innerHTML = ''; return; }
    const bits = [`Sahə: <b>${T.DOMAINS[meta.domainKey].label}</b>`];
    if (meta.tech.length) bits.push(`Tex: <b>${escapeHtml(meta.tech.join(', '))}</b>`);
    bits.push(`Format: <b>${T.FORMATS[meta.formatKey].label}</b>`);
    el.detected.innerHTML = bits.join(' · ');
  }

  function render() {
    const idea = el.idea.value;
    if (!idea.trim()) {
      current = '';
      el.output.innerHTML = '<span class="empty">Sol tərəfdə ideyanızı yazın — prompt burada canlı yaranacaq.</span>';
      el.stats.textContent = '';
      el.copy.disabled = el.download.disabled = true;
      renderAnalysis(idea, null);
      return;
    }
    const { text, meta } = E.build({
      idea, plang, style: el.style.value, sections: selectedSections(),
      domain: el.domain.value, tone: el.tone.value, rlang: el.rlang.value,
      format: el.format.value, detail: el.detail.value,
      customRole: el.customRole.value, audience: el.audience.value, extra: el.extra.value
    });
    current = text;
    el.output.innerHTML = highlight(text) || '<span class="empty">Heç bir bölmə seçilməyib.</span>';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    el.stats.textContent = `${words} söz · ~${Math.ceil(text.length / 4)} token`;
    el.copy.disabled = el.download.disabled = !text;
    renderAnalysis(idea, meta);
  }

  let timer;
  const renderSoon = () => { clearTimeout(timer); timer = setTimeout(render, 120); };

  /* ---------- Kopyalama və tarixçə ---------- */
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

  function pushHistory(idea, prompt) {
    const list = store.get(HIST_KEY, []).filter(h => h.prompt !== prompt);
    list.unshift({ idea: idea.trim().slice(0, 120), prompt, at: Date.now() });
    store.set(HIST_KEY, list.slice(0, 10));
    renderHistory();
  }

  function renderHistory() {
    const list = store.get(HIST_KEY, []);
    if (!list.length) { el.history.innerHTML = '<li class="none">Hələ heç nə kopyalanmayıb.</li>'; return; }
    el.history.innerHTML = list.map((h, i) =>
      `<li><span title="${escapeHtml(h.idea)}">${escapeHtml(h.idea)}</span>` +
      `<button class="btn ghost small" data-i="${i}">Kopyala</button></li>`).join('');
  }

  el.history.addEventListener('click', async e => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    const h = store.get(HIST_KEY, [])[+b.dataset.i];
    if (!h) return;
    try { await copyText(h.prompt); toast('✓ Prompt kopyalandı'); }
    catch { toast('Kopyalamaq alınmadı', true); }
  });

  /* ---------- Hadisələr ---------- */
  el.copy.addEventListener('click', async () => {
    if (!current) return;
    try {
      await copyText(current);
      pushHistory(el.idea.value, current);
      toast('✓ Prompt kopyalandı — Claude-a yapışdırın');
    } catch { toast('Kopyalamaq alınmadı', true); }
  });

  el.download.addEventListener('click', () => {
    if (!current) return;
    const blob = new Blob([current], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'claude-prompt.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('✓ Fayl yükləndi');
  });

  el.generate.addEventListener('click', () => {
    render();
    if (!el.idea.value.trim()) { toast('Əvvəlcə ideyanızı yazın', true); el.idea.focus(); }
    else toast('✓ Prompt generasiya olundu');
  });

  el.reset.addEventListener('click', () => {
    el.idea.value = el.customRole.value = el.audience.value = el.extra.value = '';
    el.domain.value = 'auto'; el.tone.value = 'auto'; el.rlang.value = 'same';
    el.format.value = 'auto'; el.detail.value = 'standard'; el.style.value = 'xml';
    el.sections.querySelectorAll('input').forEach(i =>
      (i.checked = ['role', 'context', 'task', 'steps', 'constraints', 'format'].includes(i.value)));
    setPlang('en');
    el.idea.focus();
  });

  document.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => setPlang(b.dataset.plang)));

  [el.idea, el.customRole, el.audience, el.extra].forEach(i => i.addEventListener('input', renderSoon));
  FIELDS.forEach(f => el[f].addEventListener('change', () => { saveSettings(); render(); }));
  el.sections.addEventListener('change', () => { saveSettings(); render(); });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); el.generate.click(); }
  });

  loadSettings();
  renderHistory();
  render();
})();

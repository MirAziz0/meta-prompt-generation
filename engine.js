/*
 * Prompt mühərriki: istifadəçinin ideyasını analiz edir (sahə, niyyət,
 * texnologiya, platforma, dil) və iki növ nəticə qurur:
 *   build()     — şablonlarla hazırlanmış, strukturlaşdırılmış prompt
 *   buildMeta() — modeldən promptu özünün yazmasını xahiş edən meta-prompt
 * DOM-dan asılı deyil — həm brauzerdə, həm Node-da (testlər) işləyir.
 */
(function (root) {
  const T = root.TEMPLATES;

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 'az' locale "I"-ni "ı"-ya çevirir (Instagram → ınstagram), ona görə əl ilə normallaşdırırıq.
  const lower = s => s.replace(/İ/g, 'i').toLowerCase();

  // Aqqlütinativ dillər üçün prefiks uyğunluğu: "kodu", "python-da" də tapılır.
  function matches(text, kw, wholeWord) {
    if (kw !== kw.trim()) return (' ' + text + ' ').includes(kw);
    const tail = wholeWord ? '(?![\\p{L}\\p{N}])' : '';
    return new RegExp('(^|[^\\p{L}\\p{N}])' + esc(kw) + tail, 'u').test(text);
  }

  function detectDomain(text) {
    const t = lower(text);
    let best = 'general', bestScore = 0;
    for (const [key, d] of Object.entries(T.DOMAINS)) {
      const score = d.kw.reduce((n, kw) => n + (matches(t, kw) ? 1 : 0), 0) * (d.weight || 1);
      if (score > bestScore) { best = key; bestScore = score; }
    }
    return best;
  }

  function detectIntent(text) {
    const t = lower(text);
    for (const [key, it] of Object.entries(T.INTENTS)) {
      if (it.kw.some(kw => matches(t, kw))) return key;
    }
    return null;
  }

  function detectTech(text) {
    const t = lower(text);
    const found = [];
    for (const [kw, name] of Object.entries(T.TECH)) {
      if (matches(t, kw, true) && !found.includes(name)) found.push(name);
    }
    return found.slice(0, 4);
  }

  function detectPlatforms(text) {
    const t = lower(text);
    return Object.keys(T.PLATFORMS).filter(k => T.PLATFORMS[k].kw.some(kw => matches(t, kw)));
  }

  // Dil sözlərin əksəriyyətinə görə təyin olunur — tək bir yer adı (İçərişəhər) nəticəni dəyişmir.
  function detectLang(text) {
    const words = text.split(/[^\p{L}]+/u).filter(Boolean);
    if (!words.length) return 'en';
    const share = re => words.filter(w => re.test(w)).length / words.length;
    if (share(/[а-яё]/i) >= 0.3) return 'ru';
    const t = lower(text);
    if (/(^|\s)(ve|için|nasıl|bir şey|yazın)(\s|$)/.test(t)) return 'tr';
    if (share(/[əğıöüşç]/i) >= 0.15 || /(^|\s)(və|üçün|necə|bir|bu|et|edin|yaz|mənə|izah|hazırla|nədir)(\s|$)/.test(t)) return 'az';
    return 'en';
  }

  const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const block = (tag, body) => `<${tag}>\n${body}\n</${tag}>`;
  const getModel = key => T.MODELS[key] || T.MODELS.claude;

  // Hər iki rejim üçün ortaq analiz
  function analyze(opts) {
    const idea = opts.idea.trim();
    const domainKey = opts.domain === 'auto' ? detectDomain(idea) : opts.domain;
    const intentKey = detectIntent(idea);
    const intent = intentKey ? T.INTENTS[intentKey] : null;
    return {
      idea, domainKey, intentKey,
      tech: detectTech(idea),
      platforms: detectPlatforms(idea),
      formatKey: opts.format !== 'auto' ? opts.format : (intent && intent.format) || T.DOMAINS[domainKey].format,
      rlangKey: opts.rlang === 'same' ? detectLang(idea) : opts.rlang
    };
  }

  /*
   * opts: { idea, plang, model, domain, tone, rlang, format, detail,
   *         audience, goal, length, clarify, thinking }
   */
  function build(opts) {
    const L = opts.plang;
    const U = T.UI[L];
    const M = getModel(opts.model);
    const xml = M.style === 'xml';
    const section = (key, body) => xml ? block(key, body) : `## ${U.sec[key]}\n${body}`;
    const m = analyze(opts);
    const D = T.DOMAINS[m.domainKey];
    const vars = { tech: m.tech.length ? m.tech.join(', ') : U.defaultTech };
    const audience = (opts.audience || '').trim();
    const goal = (opts.goal || '').trim();
    const length = (opts.length || '').trim();

    const context = [fill(D.context[L], vars)];
    if (audience) context.push(U.audience(audience));
    if (goal) context.push(U.goal(goal));

    const task = [U.taskIntro, xml ? block('request', m.idea) : `"""\n${m.idea}\n"""`];
    if (m.intentKey) task.push(T.INTENTS[m.intentKey][L]);

    const constraints = [];
    const tone = T.TONES[opts.tone];
    if (tone && tone[L]) constraints.push(tone[L]);
    const rl = T.RESPONSE_LANGS[m.rlangKey];
    if (rl && rl[L]) constraints.push(U.respondIn(rl[L]));
    if (length) constraints.push(U.length(length));
    constraints.push(T.DETAIL[opts.detail][L]);
    m.platforms.forEach(p => constraints.push(T.PLATFORMS[p][L]));
    D.constraints[L].forEach(c => constraints.push(fill(c, vars)));
    constraints.push(U.honesty);

    const taskPart = section('task', task.join('\n\n'));
    const parts = [
      section('role', fill(D.role[L], vars)),
      section('context', context.join('\n')),
      taskPart,
      section('instructions', U.stepsIntro + '\n' + D.steps[L].map((s, i) => `${i + 1}. ${fill(s, vars)}`).join('\n')),
      section('constraints', constraints.map(c => `- ${c}`).join('\n')),
      section('output_format', T.FORMATS[m.formatKey][L])
    ];
    if (opts.clarify) parts.push(section('clarification', U.clarify));
    // Gemini: əsas tapşırıq kontekst və qaydalardan sonra, sonda gəlir
    if (M.taskLast) parts.push(parts.splice(parts.indexOf(taskPart), 1)[0]);
    if (opts.thinking) parts.push(xml ? U.thinking : U.thinkingPlain);

    return { text: parts.join('\n\n'), meta: m };
  }

  function buildMeta(opts) {
    const L = opts.plang;
    const M = T.META[L];
    const model = getModel(opts.model);
    const m = analyze(opts);
    const known = [];
    const add = (label, v) => { if (v && String(v).trim()) known.push(`- ${label}: ${String(v).trim()}`); };

    if (m.domainKey !== 'general') {
      add(M.labels.domain, T.DOMAINS[m.domainKey].label + (m.tech.length ? ` (${m.tech.join(', ')})` : ''));
    }
    add(M.labels.audience, opts.audience);
    add(M.labels.goal, opts.goal);
    add(M.labels.length, opts.length);
    if (T.TONES[opts.tone] && opts.tone !== 'auto') add(M.labels.tone, T.TONES[opts.tone].label);
    const rl = T.RESPONSE_LANGS[m.rlangKey];
    if (rl && rl.en) add(M.labels.lang, rl.en);

    const vars = {
      model: model.label,
      structure: M.structure[model.taskLast ? 'taskLast' : model.style]
    };
    const parts = [fill(M.intro, vars), block('idea', m.idea)];
    if (known.length) parts.push(M.known + '\n' + known.join('\n'));
    parts.push(fill(M.process.join('\n'), vars));
    return { text: parts.join('\n\n'), meta: m };
  }

  root.PromptEngine = { build, buildMeta, detectDomain, detectIntent, detectTech, detectPlatforms, detectLang };
})(typeof window !== 'undefined' ? window : globalThis);

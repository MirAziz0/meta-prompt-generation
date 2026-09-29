/*
 * Prompt mühərriki: istifadəçinin ideyasını analiz edir (sahə, niyyət,
 * texnologiya, dil, keyfiyyət) və strukturlaşdırılmış prompt qurur.
 * DOM-dan asılı deyil — təmiz funksiyalardır.
 */
(function () {
  const T = window.TEMPLATES;

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

  // İdeyanın nə qədər "prompt-a hazır" olduğunu qiymətləndirir və məsləhət verir.
  function analyze(text) {
    const t = lower(text.trim());
    const words = t ? t.split(/\s+/).length : 0;
    const checks = [
      { ok: words >= 6, pts: 25, hint: 'Bir az daha ətraflı yazın — nə etmək istədiyinizi 1-2 cümlə ilə açın.' },
      { ok: words >= 15, pts: 15, hint: 'Daha çox detal (şərtlər, nümunələr) nəticəni əhəmiyyətli dərəcədə yaxşılaşdırır.' },
      { ok: /(üçün|for |auditoriya|audience|tələbə|şagird|müştəri|customer|beginner|yeni başlayan|uşaq|mütəxəssis)/.test(t), pts: 20, hint: 'Kimin üçün olduğunu qeyd edin (auditoriya) — və ya "Əlavə" bölməsində doldurun.' },
      { ok: /(format|cədvəl|table|json|siyahı|list|söz|word|abzas|paragraph|sətir|slayd|slide|addım|step)/.test(t), pts: 15, hint: 'İstədiyiniz formatı və ya həcmi göstərin (məs: "5 maddə", "300 söz").' },
      { ok: /(məqsəd|goal|ki,|so that|in order|istəyirəm|want|lazımdır|need)/.test(t), pts: 15, hint: 'Son məqsədi yazın — nəticəni nə üçün istifadə edəcəksiniz?' },
      { ok: /\d/.test(t), pts: 10, hint: 'Konkret rəqəmlər (say, müddət, büdcə) Claude-a dəqiq hədəf verir.' }
    ];
    const score = checks.reduce((n, c) => n + (c.ok ? c.pts : 0), 0);
    return { score, words, hints: words ? checks.filter(c => !c.ok).map(c => c.hint).slice(0, 3) : [] };
  }

  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  }

  /*
   * opts: { idea, plang, style, sections:Set, domain, tone, rlang, format,
   *         detail, customRole, audience, extra }
   */
  function build(opts) {
    const L = opts.plang;
    const U = T.UI[L];
    const idea = opts.idea.trim();
    const domainKey = opts.domain === 'auto' ? detectDomain(idea) : opts.domain;
    const D = T.DOMAINS[domainKey];
    const intentKey = detectIntent(idea);
    const intent = intentKey ? T.INTENTS[intentKey] : null;
    const tech = detectTech(idea);
    const vars = { tech: tech.length ? tech.join(', ') : U.defaultTech };
    const xml = opts.style === 'xml';
    const has = k => opts.sections.has(k);

    const formatKey = opts.format !== 'auto' ? opts.format : (intent && intent.format) || D.format;
    const rlangKey = opts.rlang === 'same' ? detectLang(idea) : opts.rlang;

    const parts = [];
    const add = (key, body) => {
      if (!body) return;
      parts.push(xml
        ? `<${U.tag[key]}>\n${body}\n</${U.tag[key]}>`
        : `## ${U.sec[key]}\n${body}`);
    };

    if (has('role')) add('role', opts.customRole.trim()
      ? (L === 'en' ? `You are ${opts.customRole.trim()}.` : `Sənin rolun: ${opts.customRole.trim()}.`)
      : fill(D.role[L], vars));

    if (has('context')) {
      const ctx = [fill(D.context[L], vars)];
      if (opts.audience.trim()) ctx.push(U.audience(opts.audience.trim()));
      add('context', ctx.join('\n'));
    }

    if (has('task')) {
      const req = xml ? `<request>\n${idea}\n</request>` : `"""\n${idea}\n"""`;
      const lines = [U.taskIntro, req];
      if (intent) lines.push(intent[L]);
      add('task', lines.join('\n\n'));
    }

    if (has('steps')) {
      add('steps', U.stepsIntro + '\n' + D.steps[L].map((s, i) => `${i + 1}. ${fill(s, vars)}`).join('\n'));
    }

    if (has('constraints')) {
      const list = [];
      const tone = T.TONES[opts.tone];
      if (tone && tone[L]) list.push(tone[L]);
      const rl = T.RESPONSE_LANGS[rlangKey];
      if (rl && rl[L]) list.push(U.respondIn(rl[L]));
      list.push(T.DETAIL[opts.detail][L]);
      D.constraints[L].forEach(c => list.push(fill(c, vars)));
      opts.extra.split('\n').map(s => s.trim()).filter(Boolean).forEach(s => list.push(s));
      list.push(U.honesty);
      add('constraints', list.map(c => `- ${c}`).join('\n'));
    }

    if (has('format')) add('format', T.FORMATS[formatKey][L]);
    if (has('examples')) add('examples', xml ? U.examplesText : U.examplesTextMd);
    if (has('clarify')) add('clarify', U.clarifyText);
    if (has('thinking')) parts.push(xml ? U.thinking : U.thinkingMd);

    return {
      text: parts.join('\n\n'),
      meta: { domainKey, intentKey, tech, formatKey, rlangKey }
    };
  }

  window.PromptEngine = { build, analyze, detectDomain, detectIntent, detectTech, detectLang };
})();

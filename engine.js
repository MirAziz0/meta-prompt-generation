/*
 * Prompt mühərriki: istifadəçinin ideyasını analiz edir (sahə, niyyət,
 * texnologiya, platforma, dil) və iki növ nəticə qurur:
 *   build()     — hədəf modelə uyğun hazır prompt
 *   buildMeta() — modeldən promptu özünün yazmasını xahiş edən meta-prompt
 *
 * Qaydalar prompt-master skill-inə əsaslanır: gizli düşüncə tələbi yoxdur,
 * hər promptda uğur meyarı var, fakt tapşırıqlarında uydurmama qaydası,
 * gizli açarlar silinir, hər model öz strukturunda render olunur.
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

  // API açarları, tokenlər və parollar promptda qalmamalıdır.
  function stripSecrets(text) {
    let removed = false;
    let out = text;
    for (const re of T.SECRETS) {
      out = out.replace(re, (m, label, sep) => {
        removed = true;
        // Qrupsuz regex-lərdə 2-ci arqument mövqe rəqəmidir, mətn yox
        return typeof label === 'string' ? `${label}${sep}[REDACTED]` : '[REDACTED]';
      });
    }
    return { text: out, removed };
  }

  const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const xmlBlock = (tag, body) => `<${tag}>\n${body}\n</${tag}>`;
  const mdBlock = (title, body) => `## ${title}\n${body}`;
  const bullets = list => list.map(c => `- ${c}`).join('\n');
  const numbered = list => list.map((s, i) => `${i + 1}. ${s}`).join('\n');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const firstSentence = s => s.split(/(?<=\.)\s/)[0];
  const getModel = key => (T.MODELS[key] ? key : 'claude');

  // Hər iki rejim üçün ortaq analiz
  function analyze(opts) {
    const clean = stripSecrets(opts.idea.trim());
    const idea = clean.text;
    const domainKey = opts.domain === 'auto' ? detectDomain(idea) : opts.domain;
    const intentKey = detectIntent(idea);
    const intent = intentKey ? T.INTENTS[intentKey] : null;
    return {
      idea, secretsRemoved: clean.removed, domainKey, intentKey,
      modelKey: getModel(opts.model),
      tech: detectTech(idea),
      platforms: detectPlatforms(idea),
      formatKey: opts.format !== 'auto' ? opts.format : (intent && intent.format) || T.DOMAINS[domainKey].format,
      rlangKey: opts.rlang === 'same' ? detectLang(idea) : opts.rlang
    };
  }

  // Modeldən asılı olmayan məzmun: rol, kontekst, qaydalar, format, uğur meyarı…
  function gather(opts, m) {
    const L = opts.plang;
    const U = T.UI[L];
    const D = T.DOMAINS[m.domainKey];
    const vars = { tech: m.tech.length ? m.tech.join(', ') : U.defaultTech };
    const audience = (opts.audience || '').trim();
    const goal = (opts.goal || '').trim();
    const length = (opts.length || '').trim();

    const context = [fill(D.context[L], vars)];
    if (audience) context.push(U.audience(audience));
    if (goal) context.push(U.goal(goal));
    // Kopirayt üçün doldurulacaq yer tutucular
    if (m.domainKey === 'marketing') context.push(U.copyPlaceholders);

    // Ən vacib məhdudiyyətlər əvvəldə: dil, həcm, platforma, sonra sahə qaydaları
    const core = [];
    const rl = T.RESPONSE_LANGS[m.rlangKey];
    if (rl && rl[L]) core.push(U.respondIn(rl[L]));
    if (length) core.push(U.length(length));
    m.platforms.forEach(p => core.push(T.PLATFORMS[p][L]));
    const tone = T.TONES[opts.tone];
    if (tone && tone[L]) core.push(tone[L]);
    const domain = D.constraints[L].map(c => fill(c, vars));

    return {
      L, U, D,
      role: fill(D.role[L], vars),
      context,
      intentLine: m.intentKey ? T.INTENTS[m.intentKey][L] : '',
      steps: D.steps[L].map(s => fill(s, vars)),
      core, domain,
      detail: T.DETAIL[opts.detail][L],
      format: T.FORMATS[m.formatKey][L],
      done: D.done[L],
      grounded: !!D.grounded,
      // Məntiq/analiz tapşırıqlarında yoxlanıla bilən cavab strukturu avtomatik qoşulur
      audit: !!opts.reasoning || ['fix', 'compare'].includes(m.intentKey) || m.domainKey === 'data',
      clarify: !!opts.clarify,
      tech: vars.tech
    };
  }

  /* ---------- Hər model üçün render ---------- */

  const RENDER = {
    // Anthropic: XML teqləri, müsbət təlimatlar, aydın uğur meyarı
    claude(c, m) {
      const U = c.U;
      const constraints = [...c.core, c.detail, ...c.domain];
      if (c.grounded) constraints.push(U.grounding);
      constraints.push(U.honesty);
      const parts = [
        xmlBlock('role', c.role),
        xmlBlock('context', c.context.join('\n')),
        xmlBlock('task', [U.taskIntro, xmlBlock('request', m.idea), c.intentLine].filter(Boolean).join('\n\n')),
        xmlBlock('instructions', U.stepsIntro + '\n' + numbered(c.steps)),
        xmlBlock('constraints', bullets(constraints)),
        xmlBlock('output_format', c.format),
        xmlBlock('success_criteria', U.complete(c.done))
      ];
      if (c.audit) parts.push(xmlBlock('answer_structure', U.audit));
      if (c.clarify) parts.push(xmlBlock('clarification', U.clarify));
      return parts.join('\n\n');
    },

    // OpenAI GPT: yığcam Goal / Context / Constraints / Done, hər təlimat bir dəfə
    gpt(c, m) {
      const U = c.U, S = U.sec;
      const constraints = [...c.core, c.detail, ...c.domain];
      if (c.grounded) constraints.push(U.grounding);
      if (c.clarify) constraints.push(U.clarifyShort);
      else constraints.push(U.honesty);
      const done = [c.format, U.doneWhen(c.done)];
      if (c.audit) done.push(U.audit);
      return [
        c.role,
        mdBlock(S.goal, [`"""\n${m.idea}\n"""`, c.intentLine].filter(Boolean).join('\n\n')),
        mdBlock(S.context, c.context.join('\n')),
        mdBlock(S.constraints, bullets(constraints)),
        mdBlock(S.done, done.join('\n\n'))
      ].join('\n\n');
    },

    // Google Gemini: mənbə qaydası, format kilidi, əsas tapşırıq sonda
    gemini(c, m) {
      const U = c.U, S = U.sec;
      const constraints = [...c.core, c.detail, ...c.domain];
      if (c.grounded) constraints.push(U.grounding);
      constraints.push(U.cite, U.honesty);
      const parts = [
        mdBlock(S.role, c.role),
        mdBlock(S.context, c.context.join('\n')),
        mdBlock(S.instructions, U.stepsIntro + '\n' + numbered(c.steps)),
        mdBlock(S.constraints, bullets(constraints)),
        mdBlock(S.output_format, `${c.format}\n${U.formatLock}`),
        mdBlock(S.success_criteria, U.complete(c.done))
      ];
      if (c.audit) parts.push(mdBlock(S.answer_checks, U.audit));
      if (c.clarify) parts.push(mdBlock(S.clarification, U.clarify));
      parts.push(mdBlock(S.task, [U.taskIntro, `"""\n${m.idea}\n"""`, c.intentLine].filter(Boolean).join('\n\n')));
      return parts.join('\n\n');
    },

    // xAI Grok: nəticəyə fokuslu; aktual faktlar üçün axtarış və istinad
    grok(c, m) {
      const U = c.U, S = U.sec;
      const constraints = [...c.core, c.detail, ...c.domain];
      if (c.grounded) constraints.push(U.grounding);
      constraints.push(c.clarify ? U.clarifyShort : U.honesty);
      const done = [c.format, U.doneWhen(c.done)];
      if (c.audit) done.push(U.audit);
      return [
        c.role,
        mdBlock(S.goal, [`"""\n${m.idea}\n"""`, c.intentLine].filter(Boolean).join('\n\n')),
        mdBlock(S.input, c.context.join('\n')),
        mdBlock(S.constraints, bullets(constraints)),
        mdBlock(S.tools, U.search),
        mdBlock(S.done, done.join('\n\n'))
      ].join('\n\n');
    },

    // o3 / DeepSeek-R1: qısa, təmiz; heç bir düşüncə skeleti yoxdur
    reasoning(c, m) {
      const U = c.U, S = U.sec;
      const constraints = [...c.core, ...c.domain.slice(0, 2)];
      if (c.grounded) constraints.push(U.grounding);
      if (c.clarify) constraints.push(U.clarifyShort);
      const out = [
        `${S.goal}: ${m.idea}` + (c.intentLine ? `\n${c.intentLine}` : ''),
        `${S.context}: ${[firstSentence(c.context[0]), ...c.context.slice(1)].join(' ')}`,
        `${S.constraints}:\n${bullets(constraints)}`,
        `${S.output}: ${c.format}`,
        U.doneWhen(c.done)
      ];
      if (c.audit) out.push(U.audit);
      out.push(U.finalOnly);
      return out.join('\n\n');
    },

    // Llama / Mistral: qısa, düz struktur, açıq rol
    llama(c, m) {
      const U = c.U, S = U.sec;
      const rules = [...c.core, ...c.domain].slice(0, 5);
      if (c.grounded) rules.push(U.grounding);
      if (c.clarify) rules.push(U.clarifyShort);
      const out = [
        firstSentence(c.role),
        `${S.task}: ${m.idea}` + (c.intentLine ? `\n${c.intentLine}` : ''),
        `${S.rules}:\n${bullets(rules)}`,
        `${S.output_format}: ${c.format}`,
        U.doneWhen(c.done)
      ];
      if (c.audit) out.push(U.audit);
      return out.join('\n\n');
    },

    // Claude Code / Cursor: agent tapşırıq brifi (Template M)
    agent(c, m) {
      const U = c.U, A = U.agent;
      const constraints = [...c.core, ...c.domain.slice(0, 3), A.onlyRequested, A.noDeps];
      const parts = [
        mdBlock(A.objective, [m.idea, c.intentLine].filter(Boolean).join('\n')),
        mdBlock(A.context, bullets([A.stack(c.tech), A.files, A.tried])),
        mdBlock(A.target, U.complete(c.done)),
        mdBlock(A.scope, bullets([A.workIn, A.noTouch])),
        mdBlock(A.constraints, bullets(constraints)),
        mdBlock(A.acceptance, [cap(c.done), A.testsPass, A.addCheck].map(x => `- [ ] ${x}`).join('\n')),
        mdBlock(A.boundaries, bullets([A.proceed, A.stopAsk])),
        mdBlock(A.progress, A.evidence)
      ];
      if (c.clarify) parts.unshift(U.clarify);
      return parts.join('\n\n');
    }
  };

  /*
   * opts: { idea, plang, model, domain, tone, rlang, format, detail,
   *         audience, goal, length, clarify, reasoning }
   */
  function build(opts) {
    const m = analyze(opts);
    const c = gather(opts, m);
    return { text: RENDER[m.modelKey](c, m), meta: m };
  }

  function buildMeta(opts) {
    const L = opts.plang;
    const M = T.META[L];
    const m = analyze(opts);
    const model = T.MODELS[m.modelKey];
    const known = [];
    const add = (label, v) => { if (v && String(v).trim()) known.push(`- ${label}: ${stripSecrets(String(v).trim()).text}`); };

    if (m.domainKey !== 'general') {
      add(M.labels.domain, T.DOMAINS[m.domainKey].label + (m.tech.length ? ` (${m.tech.join(', ')})` : ''));
    }
    add(M.labels.audience, opts.audience);
    add(M.labels.goal, opts.goal);
    add(M.labels.length, opts.length);
    if (T.TONES[opts.tone] && opts.tone !== 'auto') add(M.labels.tone, T.TONES[opts.tone].label);
    const rl = T.RESPONSE_LANGS[m.rlangKey];
    if (rl && rl.en) add(M.labels.lang, rl.en);

    const vars = { model: model.label, tips: model.tips[L] };
    const parts = [fill(M.intro, vars), xmlBlock('idea', m.idea)];
    if (known.length) parts.push(M.known + '\n' + known.join('\n'));
    parts.push(fill(M.process.join('\n'), vars));
    return { text: parts.join('\n\n'), meta: m };
  }

  root.PromptEngine = { build, buildMeta, detectDomain, detectIntent, detectTech, detectPlatforms, detectLang, stripSecrets };
})(typeof window !== 'undefined' ? window : globalThis);

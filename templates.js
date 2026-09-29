/*
 * Şablon bazası: sahələr (domain), niyyətlər (intent), ton, format və s.
 * Hər mətn iki dildə saxlanılır: en (Claude üçün tövsiyə olunan) və az.
 * {tech} yer tutucusu mətndən aşkarlanan texnologiyalarla əvəz olunur.
 */
window.TEMPLATES = {

  DOMAINS: {
    code: {
      label: 'Proqramlaşdırma',
      kw: ['kod', 'code', 'coding', 'python', 'javascript', 'typescript', 'api', 'bug', 'xəta', 'error', 'funksiya', 'function', 'script', 'skript', 'sql', 'database', 'verilənlər bazası', 'react', 'vue', 'html', 'css', 'proqram', 'backend', 'frontend', 'algorithm', 'alqoritm', 'debug', 'deploy', 'docker', 'java', 'c++', 'c#', 'golang', 'rust', 'php', 'flask', 'django', 'node', 'regex', 'refactor', 'endpoint', 'server', 'git', 'bot', 'veb sayt', 'website', 'tətbiq yaz', 'app'],
      role: {
        en: 'You are a senior software engineer with deep, hands-on expertise in {tech}. You write clean, secure, production-ready code, reason carefully about edge cases, and explain trade-offs in plain language.',
        az: 'Sən {tech} üzrə dərin praktiki təcrübəyə malik senior proqram mühəndisisən. Təmiz, təhlükəsiz və istehsala hazır kod yazırsan, kənar halları diqqətlə nəzərə alırsan və seçimlərin üstünlük/çatışmazlıqlarını sadə dildə izah edirsən.'
      },
      context: {
        en: 'The request comes from someone who will use the result in a real project. Correctness, readability and maintainability matter more than cleverness. Assume a modern, stable version of the tools unless stated otherwise.',
        az: 'Bu sorğu nəticəni real layihədə istifadə edəcək şəxsdən gəlir. Düzgünlük, oxunaqlılıq və dəstəklənə bilmək "ağıllı" həllərdən daha vacibdir. Başqa cür qeyd olunmayıbsa, alətlərin müasir, stabil versiyasını nəzərdə tut.'
      },
      constraints: {
        en: ['Provide complete, runnable code — no "..." or TODO placeholders unless explicitly asked.', 'Follow idiomatic conventions for {tech}.', 'Handle errors and edge cases explicitly.', 'Comment only non-obvious logic; do not over-comment.', 'Do not invent APIs or library functions — if unsure, say so.'],
        az: ['Tam, işlək kod ver — xüsusi istənilməyibsə "..." və ya TODO yer tutucuları olmasın.', '{tech} üçün qəbul olunmuş yazı qaydalarına əməl et.', 'Xətaları və kənar halları açıq şəkildə idarə et.', 'Yalnız aydın olmayan hissələri şərh et; həddindən artıq şərh yazma.', 'Mövcud olmayan API və ya funksiyalar uydurma — əmin deyilsənsə, bunu bildir.']
      },
      steps: {
        en: ['Restate the requirement in one or two sentences and list any assumptions.', 'Outline the approach and key design decisions.', 'Write the full implementation.', 'Explain how to run and test it, and which edge cases are covered.'],
        az: ['Tələbi bir-iki cümlə ilə öz sözlərinlə təkrarla və fərziyyələri sadala.', 'Yanaşmanı və əsas dizayn qərarlarını qısaca göstər.', 'Tam implementasiyanı yaz.', 'Necə işə salmaq və test etmək lazım olduğunu, hansı kənar halların əhatə olunduğunu izah et.']
      },
      format: 'code'
    },

    writing: {
      label: 'Mətn yazımı / Kontent',
      weight: 0.8, // ümumi sözlər ("yaz", "mətn") — bərabərlikdə daha konkret sahə qalib gəlsin
      kw: ['məqalə', 'article', 'esse', 'essay', 'blog', 'hekayə', 'story', 'şeir', 'poem', 'mətn', 'text', 'yaz ', 'write', 'məktub', 'letter', 'email', 'e-poçt', 'məruzə', 'nitq', 'speech', 'ssenari', 'script for video', 'xəbər', 'redaktə', 'edit', 'rewrite', 'yenidən yaz', 'başlıq', 'headline', 'caption', 'post'],
      role: {
        en: 'You are an experienced writer and editor who adapts style and voice precisely to the audience. Your writing is clear, vivid and free of filler.',
        az: 'Sən üslubu və səsi auditoriyaya dəqiq uyğunlaşdıran təcrübəli yazıçı və redaktorsan. Yazdıqların aydın, canlı və lüzumsuz sözlərdən təmizdir.'
      },
      context: {
        en: 'The text will be read by real people, so it must hold attention, sound natural and serve a clear purpose.',
        az: 'Mətni real insanlar oxuyacaq, ona görə də diqqəti saxlamalı, təbii səslənməli və aydın məqsədə xidmət etməlidir.'
      },
      constraints: {
        en: ['Avoid clichés, filler phrases and generic AI-sounding wording.', 'Use short paragraphs and varied sentence length.', 'Keep a consistent voice from start to finish.'],
        az: ['Klişelərdən, boş ifadələrdən və "süni intellekt səsli" ümumi ifadələrdən qaç.', 'Qısa abzaslardan və müxtəlif uzunluqlu cümlələrdən istifadə et.', 'Əvvəldən sona qədər vahid üslubu qoru.']
      },
      steps: {
        en: ['Identify the core message and the reader\'s main question.', 'Draft a strong opening that hooks the reader.', 'Develop the body in a logical order.', 'End with a clear conclusion or call to action.'],
        az: ['Əsas mesajı və oxucunun əsas sualını müəyyən et.', 'Oxucunu cəlb edən güclü giriş yaz.', 'Əsas hissəni məntiqi ardıcıllıqla inkişaf etdir.', 'Aydın nəticə və ya fəaliyyətə çağırışla bitir.']
      },
      format: 'prose'
    },

    marketing: {
      label: 'Marketinq / SMM',
      kw: ['reklam', 'marketinq', 'marketing', 'smm', 'instagram', 'facebook', 'tiktok', 'linkedin', 'brend', 'brand', 'slogan', 'kampaniya', 'campaign', 'satış', 'sales', 'müştəri', 'customer', 'seo', 'landing', 'kopirayt', 'copywriting', ' ad ', ' ads ', 'advert', 'promo', 'endirim', 'məhsul təsviri', 'product description'],
      role: {
        en: 'You are a senior marketing strategist and conversion-focused copywriter who understands consumer psychology and platform-specific best practices.',
        az: 'Sən istehlakçı psixologiyasını və platformaya xas ən yaxşı təcrübələri bilən, konversiyaya fokuslanmış senior marketinq strateqi və kopirayterisən.'
      },
      context: {
        en: 'The goal is to capture attention quickly, communicate a clear value proposition and move the audience to act.',
        az: 'Məqsəd diqqəti tez cəlb etmək, dəyər təklifini aydın çatdırmaq və auditoriyanı hərəkətə keçirməkdir.'
      },
      constraints: {
        en: ['Lead with the benefit, not the feature.', 'Include a clear, specific call to action.', 'Respect the length conventions of the target platform.', 'Avoid exaggerated or unverifiable claims.'],
        az: ['Xüsusiyyətdən yox, faydadan başla.', 'Aydın və konkret fəaliyyətə çağırış (CTA) əlavə et.', 'Hədəf platformanın uzunluq normalarına riayət et.', 'Şişirdilmiş və ya yoxlanıla bilməyən iddialardan qaç.']
      },
      steps: {
        en: ['Define the target audience and their main pain point.', 'Formulate the core value proposition.', 'Write 2–3 variations with different angles.', 'Recommend the strongest variation and explain why.'],
        az: ['Hədəf auditoriyanı və onun əsas problemini müəyyən et.', 'Əsas dəyər təklifini formalaşdır.', 'Fərqli yanaşmalarla 2–3 variant yaz.', 'Ən güclü variantı tövsiyə et və səbəbini izah et.']
      },
      format: 'variants'
    },

    data: {
      label: 'Data analitika',
      kw: ['data', 'dataset', 'analiz', 'analysis', 'analyze', 'statistika', 'statistics', 'excel', 'csv', 'cədvəl', 'qrafik', 'chart', 'dashboard', 'pandas', 'numpy', 'machine learning', 'maşın öyrənməsi', 'model', 'proqnoz', 'forecast', 'metrika', 'kpi', 'power bi', 'tableau', 'regression', 'reqressiya'],
      role: {
        en: 'You are a senior data analyst with strong statistical grounding and experience in {tech}. You turn raw data into clear, decision-ready insights.',
        az: 'Sən güclü statistik biliyə və {tech} üzrə təcrübəyə malik senior data analitikisən. Xam datanı aydın, qərar qəbulu üçün hazır nəticələrə çevirirsən.'
      },
      context: {
        en: 'The analysis will support real decisions, so methodology must be sound and conclusions must be clearly separated from assumptions.',
        az: 'Analiz real qərarlara dayaq olacaq, ona görə də metodologiya düzgün olmalı, nəticələr fərziyyələrdən aydın şəkildə ayrılmalıdır.'
      },
      constraints: {
        en: ['State every assumption about the data explicitly.', 'Distinguish correlation from causation.', 'Quantify findings where possible and note uncertainty.', 'Never fabricate numbers — use placeholders if data is missing.'],
        az: ['Data ilə bağlı hər fərziyyəni açıq şəkildə qeyd et.', 'Korrelyasiya ilə səbəb-nəticəni fərqləndir.', 'Mümkün olduqda nəticələri rəqəmlərlə ifadə et və qeyri-müəyyənliyi göstər.', 'Heç vaxt rəqəm uydurma — data yoxdursa, yer tutucudan istifadə et.']
      },
      steps: {
        en: ['Clarify the question the data should answer.', 'Describe how to clean and prepare the data.', 'Perform or outline the analysis.', 'Summarize key insights and recommended actions.'],
        az: ['Datanın cavab verməli olduğu sualı aydınlaşdır.', 'Datanın necə təmizlənib hazırlanacağını təsvir et.', 'Analizi apar və ya planını göstər.', 'Əsas nəticələri və tövsiyə olunan addımları yekunlaşdır.']
      },
      format: 'report'
    },

    education: {
      label: 'Təhsil / İzah',
      kw: ['izah', 'explain', 'объясни', 'что такое', 'öyrət', 'teach', 'dərs', 'lesson', 'şagird', 'tələbə', 'student', 'müəllim', 'teacher', 'imtahan', 'exam', 'test sualları', 'quiz', 'mövzu', 'topic', 'kurs', 'course', 'sinif', 'məktəb', 'universitet', 'kollokvium', 'konspekt', 'nədir', 'what is', 'necə işləyir', 'how does'],
      role: {
        en: 'You are an expert teacher who makes complex ideas simple without losing accuracy. You use analogies, concrete examples and check for understanding.',
        az: 'Sən mürəkkəb anlayışları dəqiqliyi itirmədən sadələşdirən ekspert müəllimsən. Analogiyalardan, konkret nümunələrdən istifadə edir və başa düşülməni yoxlayırsan.'
      },
      context: {
        en: 'The learner wants genuine understanding, not just a definition. Build from what they likely already know toward the new concept.',
        az: 'Öyrənən sadəcə tərif yox, həqiqi anlayış istəyir. Onun artıq bildiyi şeylərdən başlayaraq yeni anlayışa doğru irəlilə.'
      },
      constraints: {
        en: ['Define every technical term the first time it appears.', 'Use at least one real-world analogy or example.', 'Move from simple to complex.', 'Keep factual accuracy — do not oversimplify into something false.'],
        az: ['Hər texniki termini ilk dəfə işləndiyi yerdə izah et.', 'Ən azı bir real həyat analogiyası və ya nümunəsi istifadə et.', 'Sadədən mürəkkəbə doğru irəlilə.', 'Faktiki dəqiqliyi qoru — yanlış olacaq qədər sadələşdirmə.']
      },
      steps: {
        en: ['Give a one-sentence intuitive summary.', 'Explain the concept step by step with an analogy.', 'Show a worked example.', 'Finish with 3 short questions to check understanding.'],
        az: ['Bir cümləlik intuitiv xülasə ver.', 'Anlayışı analogiya ilə addım-addım izah et.', 'Həll olunmuş nümunə göstər.', 'Başa düşülməni yoxlamaq üçün 3 qısa sualla bitir.']
      },
      format: 'lesson'
    },

    business: {
      label: 'Biznes / Strategiya',
      kw: ['biznes', 'business', 'startap', 'startup', 'strategiya', 'strategy', 'plan', 'biznes plan', 'investor', 'pitch', 'büdcə', 'budget', 'maliyyə', 'finance', 'rəqib', 'competitor', 'bazar', 'market', 'swot', 'layihə', 'project', 'menecment', 'management', 'komanda', 'team', 'okr', 'gəlir', 'revenue'],
      role: {
        en: 'You are a seasoned business consultant with experience across strategy, operations and finance. You give pragmatic, prioritized advice grounded in real constraints.',
        az: 'Sən strategiya, əməliyyatlar və maliyyə sahəsində təcrübəli biznes məsləhətçisisən. Real məhdudiyyətlərə əsaslanan, praktik və prioritetləşdirilmiş tövsiyələr verirsən.'
      },
      context: {
        en: 'The advice will guide real decisions with limited time and budget, so it must be actionable and prioritized, not generic.',
        az: 'Tövsiyələr məhdud vaxt və büdcə şəraitində real qərarlara istiqamət verəcək, ona görə də ümumi yox, icra oluna bilən və prioritetləşdirilmiş olmalıdır.'
      },
      constraints: {
        en: ['Prioritize recommendations by impact and effort.', 'Name the key risks and how to mitigate them.', 'Avoid buzzwords; be concrete and specific.', 'Mark any figures as estimates unless provided.'],
        az: ['Tövsiyələri təsir və tələb olunan səyə görə prioritetləşdir.', 'Əsas riskləri və onları azaltma yollarını göstər.', 'Dəbdə olan boş terminlərdən qaç; konkret ol.', 'Verilməyən rəqəmləri təxmini kimi qeyd et.']
      },
      steps: {
        en: ['Summarize the situation and the core objective.', 'Analyze options with pros and cons.', 'Recommend a course of action.', 'Lay out concrete next steps with owners and timeline.'],
        az: ['Vəziyyəti və əsas məqsədi yekunlaşdır.', 'Variantları üstünlük və çatışmazlıqları ilə təhlil et.', 'Konkret yol tövsiyə et.', 'Məsul şəxs və vaxt çərçivəsi ilə növbəti addımları göstər.']
      },
      format: 'report'
    },

    research: {
      label: 'Tədqiqat / Akademik',
      kw: ['tədqiqat', 'research', 'akademik', 'academic', 'elmi', 'scientific', 'dissertasiya', 'thesis', 'diplom', 'kurs işi', 'referat', 'mənbə', 'source', 'ədəbiyyat icmalı', 'literature review', 'hipotez', 'hypothesis', 'metodologiya', 'methodology', 'müqayisə et', 'compare', 'xülasə', 'summary', 'summarize'],
      role: {
        en: 'You are a rigorous academic researcher who synthesizes evidence carefully, distinguishes established facts from open questions, and writes with precision.',
        az: 'Sən dəlilləri diqqətlə sintez edən, təsdiqlənmiş faktları açıq suallardan ayıran və dəqiq yazan ciddi akademik tədqiqatçısan.'
      },
      context: {
        en: 'The output may be used in academic or professional work, so accuracy, balance and traceable reasoning are essential.',
        az: 'Nəticə akademik və ya peşəkar işdə istifadə oluna bilər, ona görə də dəqiqlik, balans və izlənilə bilən məntiq vacibdir.'
      },
      constraints: {
        en: ['Never fabricate citations, authors or statistics.', 'Clearly separate consensus, debate and your own inference.', 'Present multiple perspectives where they exist.', 'Use precise, formal language.'],
        az: ['Heç vaxt istinad, müəllif və ya statistika uydurma.', 'Konsensusu, mübahisəli məqamları və öz nəticəni aydın ayır.', 'Mövcud olduqda müxtəlif baxış bucaqlarını təqdim et.', 'Dəqiq, rəsmi dil işlət.']
      },
      steps: {
        en: ['Define the scope and key terms.', 'Summarize what is well established.', 'Discuss open questions and competing views.', 'Conclude with implications and gaps for further study.'],
        az: ['Əhatə dairəsini və əsas terminləri müəyyən et.', 'Yaxşı təsdiqlənmiş məlumatları yekunlaşdır.', 'Açıq sualları və fərqli baxışları müzakirə et.', 'Nəticələr və gələcək tədqiqat üçün boşluqlarla bitir.']
      },
      format: 'report'
    },

    design: {
      label: 'Dizayn / UI-UX',
      kw: ['dizayn', 'design', 'ui', 'ux', 'logo', 'loqo', 'figma', 'interfeys', 'interface', 'rəng', 'color', 'şrift', 'font', 'layout', 'maket', 'wireframe', 'prototip', 'prototype', 'banner', 'poster', 'vizual', 'visual', 'ikon', 'icon'],
      role: {
        en: 'You are a senior product designer with strong UI/UX fundamentals, accessibility knowledge and a sharp eye for visual hierarchy.',
        az: 'Sən güclü UI/UX əsaslarına, əlçatanlıq biliklərinə və vizual iyerarxiyaya iti baxışa malik senior məhsul dizaynerisən.'
      },
      context: {
        en: 'The design must serve real users: it should be usable, accessible and visually coherent, not just attractive.',
        az: 'Dizayn real istifadəçilərə xidmət etməlidir: sadəcə gözəl yox, istifadəsi rahat, əlçatan və vizual cəhətdən vahid olmalıdır.'
      },
      constraints: {
        en: ['Justify each design decision by its user benefit.', 'Meet WCAG AA contrast and accessibility basics.', 'Specify concrete values (colors in HEX, sizes in px) where relevant.'],
        az: ['Hər dizayn qərarını istifadəçiyə verdiyi faydaya görə əsaslandır.', 'WCAG AA kontrast və əlçatanlıq əsaslarına cavab ver.', 'Lazım olduqda konkret dəyərlər göstər (rənglər HEX, ölçülər px ilə).']
      },
      steps: {
        en: ['Identify the users and their primary goal.', 'Propose the structure and visual hierarchy.', 'Specify colors, typography and components.', 'List usability and accessibility checks.'],
        az: ['İstifadəçiləri və onların əsas məqsədini müəyyən et.', 'Strukturu və vizual iyerarxiyanı təklif et.', 'Rəngləri, tipoqrafiyanı və komponentləri dəqiqləşdir.', 'İstifadə rahatlığı və əlçatanlıq yoxlamalarını sadala.']
      },
      format: 'structured'
    },

    general: {
      label: 'Ümumi',
      kw: [],
      role: {
        en: 'You are a knowledgeable, thoughtful expert assistant who gives accurate, well-reasoned and practical answers.',
        az: 'Sən dəqiq, yaxşı əsaslandırılmış və praktik cavablar verən bilikli, diqqətli ekspert köməkçisən.'
      },
      context: {
        en: 'The user wants a genuinely useful answer they can act on immediately.',
        az: 'İstifadəçi dərhal tətbiq edə biləcəyi, həqiqətən faydalı cavab istəyir.'
      },
      constraints: {
        en: ['Be specific and practical rather than generic.', 'If something is uncertain, say so instead of guessing.'],
        az: ['Ümumi yox, konkret və praktik ol.', 'Əmin olmadığın şeyi təxmin etmək əvəzinə, bunu açıq bildir.']
      },
      steps: {
        en: ['Understand the real goal behind the request.', 'Address the request directly.', 'Add useful tips or next steps.'],
        az: ['Sorğunun arxasındakı əsl məqsədi anla.', 'Sorğuya birbaşa cavab ver.', 'Faydalı məsləhətlər və ya növbəti addımlar əlavə et.']
      },
      format: 'structured'
    }
  },

  /* Niyyət (feil) aşkarlanması — Task bölməsinə məqsəd cümləsi əlavə edir */
  INTENTS: {
    fix: {
      kw: ['düzəlt', 'fix', 'исправ', 'ошибк', 'debug', 'xəta', 'error', 'işləmir', 'not working', 'bug', 'problem'],
      en: 'Find the root cause first, explain it briefly, then provide the corrected solution.',
      az: 'Əvvəlcə problemin kök səbəbini tap, qısaca izah et, sonra düzəldilmiş həlli ver.'
    },
    explain: {
      kw: ['izah', 'explain', 'объясни', 'что такое', 'nədir', 'what is', 'necə işləyir', 'how does', 'niyə', 'why', 'anlat', 'başa sal'],
      en: 'Focus on building genuine understanding rather than just giving a definition.',
      az: 'Sadəcə tərif vermək yox, həqiqi anlayış yaratmağa fokuslan.',
      format: 'lesson'
    },
    summarize: {
      kw: ['xülasə', 'summar', 'qısalt', 'konspekt', 'tl;dr', 'əsas fikir'],
      en: 'Capture the essential points faithfully and concisely without adding new information.',
      az: 'Əsas məqamları yeni məlumat əlavə etmədən, dəqiq və yığcam çatdır.',
      format: 'bullets'
    },
    compare: {
      kw: ['müqayisə', 'compare', 'сравни', 'fərq', 'difference', ' vs ', 'versus', 'hansı daha yaxşı', 'which is better'],
      en: 'Compare the options on clear, consistent criteria and end with a recommendation for the stated situation.',
      az: 'Variantları aydın və eyni meyarlar üzrə müqayisə et və verilən vəziyyət üçün tövsiyə ilə bitir.',
      format: 'table'
    },
    translate: {
      kw: ['tərcümə', 'translate', 'çevir'],
      en: 'Translate faithfully, preserving meaning, tone and nuance rather than translating word for word.',
      az: 'Sözbəsöz yox, mənanı, tonu və incəlikləri qoruyaraq dəqiq tərcümə et.',
      format: 'prose'
    },
    improve: {
      kw: ['təkmilləşdir', 'improve', 'yaxşılaşdır', 'optimize', 'optimallaşdır', 'review', 'yoxla', 'rəy ver', 'feedback', 'refactor'],
      en: 'Evaluate the current state critically, list concrete issues by priority, then provide the improved version.',
      az: 'Mövcud vəziyyəti tənqidi qiymətləndir, konkret problemləri prioritetə görə sadala, sonra təkmilləşdirilmiş versiyanı ver.'
    },
    plan: {
      kw: ['plan', 'roadmap', 'cədvəl qur', 'schedule', 'addım-addım', 'step by step', 'strategiya'],
      en: 'Produce an actionable plan with clear phases, concrete steps and realistic timing.',
      az: 'Aydın mərhələləri, konkret addımları və real vaxt çərçivəsi olan icra oluna bilən plan hazırla.',
      format: 'steps'
    },
    brainstorm: {
      kw: ['ideya', 'idea', 'brainstorm', 'təklif et', 'suggest', 'variant', 'adlar', 'names'],
      en: 'Generate a diverse set of ideas, ranging from safe to bold, and highlight the most promising ones.',
      az: 'Təhlükəsizdən cəsarətliyə qədər müxtəlif ideyalar yarat və ən perspektivlilərini vurğula.',
      format: 'bullets'
    },
    create: {
      kw: ['yarat', 'create', 'напиши', 'создай', 'yaz', 'write', 'hazırla', 'make', 'build', 'qur', 'generate', 'düzəlt'],
      en: 'Deliver a complete, ready-to-use result rather than an outline, unless an outline is requested.',
      az: 'Xüsusi istənilməyibsə, plan yox, tam və istifadəyə hazır nəticə təqdim et.'
    }
  },

  /* Aşkarlanan texnologiyalar → rolda görünən adlar */
  TECH: {
    'python': 'Python', 'javascript': 'JavaScript', 'typescript': 'TypeScript', 'react': 'React', 'vue': 'Vue',
    'angular': 'Angular', 'node': 'Node.js', 'java': 'Java', 'c++': 'C++', 'c#': 'C#', '.net': '.NET', 'golang': 'Go',
    'rust': 'Rust', 'php': 'PHP', 'laravel': 'Laravel', 'django': 'Django', 'flask': 'Flask', 'fastapi': 'FastAPI',
    'sql': 'SQL', 'postgres': 'PostgreSQL', 'mysql': 'MySQL', 'mongodb': 'MongoDB', 'html': 'HTML', 'css': 'CSS',
    'tailwind': 'Tailwind CSS', 'docker': 'Docker', 'kubernetes': 'Kubernetes', 'aws': 'AWS', 'flutter': 'Flutter',
    'kotlin': 'Kotlin', 'swift': 'Swift', 'pandas': 'pandas', 'excel': 'Excel', 'power bi': 'Power BI',
    'tableau': 'Tableau', 'figma': 'Figma', 'next.js': 'Next.js', 'nextjs': 'Next.js', 'telegram': 'Telegram Bot API'
  },

  TONES: {
    auto:         { label: 'Avtomatik', en: '', az: '' },
    professional: { label: 'Peşəkar', en: 'Use a professional, confident and clear tone.', az: 'Peşəkar, inamlı və aydın ton işlət.' },
    friendly:     { label: 'Səmimi', en: 'Use a warm, friendly and conversational tone.', az: 'İsti, səmimi və danışıq tonunda yaz.' },
    academic:     { label: 'Akademik', en: 'Use a formal, precise academic tone.', az: 'Rəsmi, dəqiq akademik ton işlət.' },
    persuasive:   { label: 'İnandırıcı', en: 'Use a persuasive, energetic tone that motivates action.', az: 'Hərəkətə təşviq edən inandırıcı, enerjili ton işlət.' },
    simple:       { label: 'Çox sadə (ELI5)', en: 'Explain as if to a curious 12-year-old: simple words, no jargon.', az: 'Maraqlı 12 yaşlı uşağa izah edirmiş kimi yaz: sadə sözlər, jarqonsuz.' },
    technical:    { label: 'Texniki', en: 'Use a precise, technical tone suited to experts.', az: 'Mütəxəssislər üçün dəqiq, texniki ton işlət.' }
  },

  RESPONSE_LANGS: {
    same:    { label: 'İdeyanın dili ilə eyni' },
    az:      { label: 'Azərbaycan dili', en: 'Azerbaijani', az: 'Azərbaycan dilində' },
    en:      { label: 'İngilis dili', en: 'English', az: 'ingilis dilində' },
    ru:      { label: 'Rus dili', en: 'Russian', az: 'rus dilində' },
    tr:      { label: 'Türk dili', en: 'Turkish', az: 'türk dilində' }
  },

  DETAIL: {
    brief:    { label: 'Qısa', en: 'Keep the response concise — only what is essential.', az: 'Cavabı yığcam saxla — yalnız vacib olanlar.' },
    standard: { label: 'Standart', en: 'Balance completeness and brevity.', az: 'Tamlıq və yığcamlıq arasında balans saxla.' },
    deep:     { label: 'Ətraflı', en: 'Be thorough: cover nuances, edge cases and supporting detail.', az: 'Ətraflı ol: incəlikləri, kənar halları və dəstəkləyici detalları əhatə et.' }
  },

  FORMATS: {
    auto:       { label: 'Avtomatik (sahəyə görə)' },
    structured: { label: 'Başlıqlı Markdown',
      en: 'Use Markdown with clear ## headings, short paragraphs and bullet points where they aid scanning.',
      az: 'Aydın ## başlıqlar, qısa abzaslar və lazım olduqda maddələrlə Markdown formatından istifadə et.' },
    bullets:    { label: 'Maddələr siyahısı',
      en: 'Respond as a bulleted list; each bullet is one self-contained point. Bold the key phrase of each bullet.',
      az: 'Cavabı maddələr siyahısı kimi ver; hər maddə bir müstəqil fikirdir. Hər maddənin açar ifadəsini qalın yaz.' },
    steps:      { label: 'Addım-addım',
      en: 'Respond as a numbered, step-by-step sequence. Each step: a short title, then 1–3 sentences of detail.',
      az: 'Cavabı nömrələnmiş addımlar ardıcıllığı kimi ver. Hər addım: qısa başlıq, sonra 1–3 cümlə izah.' },
    table:      { label: 'Cədvəl',
      en: 'Present the core comparison or data as a Markdown table, followed by a 2–3 sentence takeaway.',
      az: 'Əsas müqayisəni və ya datanı Markdown cədvəli kimi təqdim et, ardınca 2–3 cümləlik nəticə yaz.' },
    json:       { label: 'JSON',
      en: 'Return only valid JSON with no text before or after it. Use clear, consistent camelCase keys.',
      az: 'Yalnız etibarlı JSON qaytar, əvvəlində və sonunda heç bir mətn olmasın. Aydın, ardıcıl camelCase açarlar işlət.' },
    code:       { label: 'Kod + izah',
      en: '1) One-paragraph overview of the approach. 2) Full code in fenced code blocks with the language tag. 3) "How to run" instructions. 4) Short notes on edge cases and possible improvements.',
      az: '1) Yanaşmanın bir abzaslıq icmalı. 2) Dil teqi ilə kod bloklarında tam kod. 3) "Necə işə salmalı" təlimatı. 4) Kənar hallar və mümkün təkmilləşdirmələr haqqında qısa qeydlər.' },
    prose:      { label: 'Axıcı mətn',
      en: 'Write flowing prose in well-structured paragraphs. Do not use bullet points or headings unless the piece naturally requires them.',
      az: 'Yaxşı qurulmuş abzaslarla axıcı mətn yaz. Mətn təbii olaraq tələb etmirsə, maddə və başlıq işlətmə.' },
    variants:   { label: 'Variantlar',
      en: 'Provide 3 clearly labeled variations (Variant A/B/C), each with a one-line note on its angle, then recommend the best one.',
      az: 'Aydın işarələnmiş 3 variant ver (Variant A/B/C), hər birinin yanaşması haqqında bir sətirlik qeyd əlavə et, sonra ən yaxşısını tövsiyə et.' },
    report:     { label: 'Hesabat',
      en: 'Structure as a report: **Summary** (2–3 sentences) → **Analysis** (with headings) → **Recommendations** (numbered) → **Assumptions & limitations**.',
      az: 'Hesabat kimi qur: **Xülasə** (2–3 cümlə) → **Təhlil** (başlıqlarla) → **Tövsiyələr** (nömrələnmiş) → **Fərziyyələr və məhdudiyyətlər**.' },
    lesson:     { label: 'Dərs formatı',
      en: 'Structure as a mini-lesson: **In one sentence** → **Explanation** (with an analogy) → **Example** → **Common mistakes** → **Check yourself** (3 questions).',
      az: 'Mini-dərs kimi qur: **Bir cümlədə** → **İzah** (analogiya ilə) → **Nümunə** → **Tipik səhvlər** → **Özünü yoxla** (3 sual).' }
  },

  /* Platformalar — mətndə aşkarlananda əlavə məhdudiyyət verir */
  PLATFORMS: {
    instagram: {
      kw: ['instagram', 'insta'],
      en: 'Instagram: put the hook in the first line (before "more"), stay under ~2,200 characters, use line breaks for readability and end with 5–10 relevant hashtags.',
      az: 'Instagram: diqqətçəkən ifadəni ilk sətirdə yaz ("daha çox"-dan əvvəl), ~2200 simvoldan az saxla, oxunaqlılıq üçün sətir fasilələri qoy və sonda 5–10 uyğun hashtag əlavə et.'
    },
    tiktok: {
      kw: ['tiktok', 'reels', 'shorts'],
      en: 'Short-form video: hook in the first 2 seconds, spoken-style lines, 15–45 seconds total, plus on-screen text suggestions.',
      az: 'Qısa video: ilk 2 saniyədə diqqəti cəlb et, danışıq dilində sətirlər yaz, ümumi müddət 15–45 saniyə olsun, ekran mətni üçün təkliflər əlavə et.'
    },
    linkedin: {
      kw: ['linkedin'],
      en: 'LinkedIn: professional but human voice, a strong first two lines, short paragraphs, at most 3 hashtags.',
      az: 'LinkedIn: peşəkar, amma canlı səs, güclü ilk iki sətir, qısa abzaslar, ən çoxu 3 hashtag.'
    },
    facebook: {
      kw: ['facebook'],
      en: 'Facebook: conversational style, ideally 40–80 words, one clear call to action, minimal hashtags.',
      az: 'Facebook: danışıq üslubu, ideal olaraq 40–80 söz, bir aydın fəaliyyətə çağırış, minimum hashtag.'
    },
    email: {
      kw: ['email', 'e-mail', 'e-poçt', 'newsletter', 'məktub'],
      en: 'Email: include a subject line (under 50 characters) and preview text; keep one main call to action.',
      az: 'E-poçt: mövzu sətri (50 simvoldan az) və önizləmə mətni əlavə et; bir əsas fəaliyyətə çağırış saxla.'
    }
  },

  /* Prompt bölmələri və ümumi ifadələr */
  UI: {
    en: {
      defaultTech: 'the relevant technologies',
      taskIntro: 'Here is the request you need to fulfill:',
      audience: a => `The target audience is: ${a}. Tailor vocabulary, depth and examples to them.`,
      goal: g => `The end goal: ${g}. Optimize the result for this goal.`,
      length: l => `Length / scope: ${l}.`,
      respondIn: l => `Respond in ${l}.`,
      honesty: 'If any part of the request is ambiguous, state your assumption explicitly and proceed.',
      stepsIntro: 'Work through the task in this order:',
      clarify: 'Before starting, if essential information is missing, ask me up to 3 short, specific clarifying questions and wait for my answers. If everything needed is clear, proceed directly.',
      thinking: 'Before answering, think through the problem step by step inside <thinking> tags. Then give your final response inside <answer> tags.'
    },
    az: {
      defaultTech: 'müvafiq texnologiyalar',
      taskIntro: 'Yerinə yetirməli olduğun sorğu budur:',
      audience: a => `Hədəf auditoriya: ${a}. Söz ehtiyatını, dərinliyi və nümunələri onlara uyğunlaşdır.`,
      goal: g => `Son məqsəd: ${g}. Nəticəni bu məqsədə uyğun optimallaşdır.`,
      length: l => `Həcm / əhatə: ${l}.`,
      respondIn: l => `Cavabı ${l} ver.`,
      honesty: 'Sorğunun hər hansı hissəsi qeyri-müəyyəndirsə, fərziyyəni açıq bildir və davam et.',
      stepsIntro: 'Tapşırığı bu ardıcıllıqla yerinə yetir:',
      clarify: 'Başlamazdan əvvəl, vacib məlumat çatışmırsa, mənə ən çoxu 3 qısa, konkret aydınlaşdırıcı sual ver və cavablarımı gözlə. Hər şey aydındırsa, birbaşa başla.',
      thinking: 'Cavab verməzdən əvvəl problemi <thinking> teqləri içində addım-addım düşün. Sonra yekun cavabı <answer> teqləri içində ver.'
    }
  },

  /* Meta-prompt: Claude-dan promptu özünün yazmasını xahiş edir */
  META: {
    en: {
      intro: 'You are an expert prompt engineer who specializes in writing prompts for Claude. Turn my rough idea below into a precise, high-quality prompt.',
      known: 'What I already know:',
      labels: { domain: 'Domain', audience: 'Audience', goal: 'Goal', length: 'Length / format', tone: 'Tone', lang: 'The answer should be in' },
      process: [
        'Work in two steps:',
        '1. If essential information is missing (goal, audience, scope or output format), first ask me up to 3 short, specific questions and wait for my answers. If the idea is already clear enough, skip this step.',
        '2. Write the final prompt. It must: assign a fitting expert role; explain the context and why the task matters; state the task clearly and specifically; list concrete constraints; define the exact output format; separate sections with XML tags (<role>, <context>, <task>, <constraints>, <output_format>); use [square-bracket placeholders] for anything I still need to fill in.',
        '',
        'Return the final prompt in a single code block, then add 2–3 short notes on how I could adapt it.'
      ]
    },
    az: {
      intro: 'Sən Claude üçün prompt yazmaq üzrə ixtisaslaşmış ekspert prompt mühəndisisən. Aşağıdakı kobud ideyamı dəqiq, yüksək keyfiyyətli prompta çevir.',
      known: 'Artıq bildiklərim:',
      labels: { domain: 'Sahə', audience: 'Auditoriya', goal: 'Məqsəd', length: 'Həcm / format', tone: 'Ton', lang: 'Cavabın dili' },
      process: [
        'İki addımla işlə:',
        '1. Vacib məlumat çatışmırsa (məqsəd, auditoriya, həcm və ya cavab formatı), əvvəlcə mənə ən çoxu 3 qısa, konkret sual ver və cavablarımı gözlə. İdeya kifayət qədər aydındırsa, bu addımı keç.',
        '2. Yekun promptu yaz. Prompt: uyğun ekspert rolu təyin etməli; konteksti və tapşırığın niyə vacib olduğunu izah etməli; tapşırığı aydın və konkret ifadə etməli; konkret məhdudiyyətləri sadalamalı; dəqiq cavab formatını müəyyən etməli; bölmələri XML teqləri ilə ayırmalı (<role>, <context>, <task>, <constraints>, <output_format>); hələ doldurmalı olduğum hissələr üçün [kvadrat mötərizəli yer tutucular] işlətməlidir.',
        '',
        'Yekun promptu bir kod blokunda qaytar, sonra onu necə uyğunlaşdıra biləcəyim barədə 2–3 qısa qeyd əlavə et.'
      ]
    }
  },

  /* Boş başlanğıc üçün nümunə ideyalar */
  EXAMPLES: [
    'Python-da CSV faylını oxuyub aylıq satış hesabatı çıxaran skript yaz',
    'Yeni açılan kafe üçün Instagram reklam postu hazırla',
    '10-cu sinif şagirdlərinə fotosintezi sadə dillə izah et'
  ]
};

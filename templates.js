/*
 * Şablon bazası: sahələr (domain), niyyətlər (intent), ton, format və s.
 * Hər mətn iki dildə saxlanılır: en (modellər üçün tövsiyə olunan) və az.
 * {tech} yer tutucusu mətndən aşkarlanan texnologiyalarla əvəz olunur.
 */
window.TEMPLATES = {

  /*
   * Hədəf modellər. Hər birinin öz render funksiyası engine.js-dədir.
   * why  — UI-da "💡" sətri (nə optimallaşdırıldı)
   * tips — "özü yazsın" rejimində modelə ötürülən, həmin hədəfə xas qaydalar
   */
  MODELS: {
    claude: {
      label: 'Claude', main: true,
      why: 'XML bölmələr, aydın uğur meyarı, gizli düşüncə tələbi yoxdur',
      tips: {
        en: 'Separate sections with XML tags (<context>, <task>, <constraints>, <output_format>). Be clear and direct and explain why a rule matters when it affects judgment. Prefer positive instructions over long lists of prohibitions.',
        az: 'Bölmələri XML teqləri ilə ayır (<context>, <task>, <constraints>, <output_format>). Aydın və birbaşa yaz, qayda qərara təsir edirsə, səbəbini izah et. Uzun qadağa siyahıları əvəzinə müsbət təlimatlara üstünlük ver.'
      }
    },
    gpt: {
      label: 'ChatGPT', main: true,
      why: 'Yığcam 4 bölmə — Goal, Context, Constraints, Done; hər təlimat bir dəfə',
      tips: {
        en: 'Start lean: four compact sections — Goal, Context, Constraints, Done. State each instruction once. Specify hard constraints and success criteria, but do not prescribe every reasoning step.',
        az: 'Yığcam başla: dörd qısa bölmə — Goal, Context, Constraints, Done. Hər təlimatı bir dəfə yaz. Sərt məhdudiyyətləri və uğur meyarını göstər, amma hər düşüncə addımını diktə etmə.'
      }
    },
    gemini: {
      label: 'Gemini', main: true,
      why: 'Mənbə qaydası, sərt format kilidi, əsas tapşırıq kontekstdən sonra',
      tips: {
        en: 'Use clear Markdown headings and place the main task after the context. Add "Cite only sources you are certain of. If uncertain, say [uncertain]." Lock the output format explicitly, because Gemini can drift from it.',
        az: 'Aydın Markdown başlıqları işlət və əsas tapşırığı kontekstdən sonra yerləşdir. "Yalnız əmin olduğun mənbələrə istinad et. Əmin deyilsənsə, [uncertain] yaz." qaydasını əlavə et. Cavab formatını açıq şəkildə kilidlə, çünki Gemini formatdan yayına bilər.'
      }
    },
    grok: {
      label: 'Grok',
      why: 'Nəticəyə fokuslu bölmələr; aktual faktlar üçün Web/X axtarışı və istinad',
      tips: {
        en: 'Keep it outcome-focused: Goal, Context/Input, Constraints, Tools, Done. If the task needs current facts, explicitly require Web Search or X Search with citations. Do not ask for chain-of-thought.',
        az: 'Nəticəyə fokuslan: Goal, Context/Input, Constraints, Tools, Done. Tapşırıq aktual fakt tələb edirsə, açıq şəkildə Web Search və ya X Search və istinad tələb et. Düşüncə zənciri istəmə.'
      }
    },
    reasoning: {
      label: 'o3 / DeepSeek-R1',
      why: 'Qısa və təmiz: "addım-addım düşün" və ya düşüncə skeleti yoxdur',
      tips: {
        en: 'This is a reasoning model: keep the prompt short (under 200 words) and state only the goal, key constraints, output format and what done looks like. Never add "think step by step" or any reasoning scaffolding — it degrades output.',
        az: 'Bu, reasoning modelidir: promptu qısa saxla (200 sözdən az) və yalnız məqsədi, əsas məhdudiyyətləri, cavab formatını və "hazır" meyarını yaz. Heç vaxt "addım-addım düşün" və ya düşüncə skeleti əlavə etmə — nəticəni pisləşdirir.'
      }
    },
    llama: {
      label: 'Llama / Mistral',
      why: 'Qısa, düz struktur və açıq rol — açıq modellər dərin iyerarxiyada çaşır',
      tips: {
        en: 'Open-weight model: keep the prompt short with a flat structure (no nested sections), always start with a clear role, and be more explicit than you would be with Claude or GPT.',
        az: 'Açıq model: promptu qısa və düz strukturda saxla (iç-içə bölmələr olmasın), həmişə aydın rolla başla və Claude və ya GPT ilə müqayisədə daha açıq ifadə et.'
      }
    },
    agent: {
      label: 'Claude Code / Cursor', agent: true,
      why: 'Hədəf vəziyyət, əhatə kilidi, qəbul meyarları və dayanma sərhədləri',
      tips: {
        en: 'This is an agentic coding tool with real file and terminal access. Use sections: Objective, Context, Target State, Scope (work only in / do not touch), Constraints, Acceptance Criteria (binary checkboxes), Action Boundaries (stop and ask before destructive actions), Progress Evidence. Add "Only make changes directly requested."',
        az: 'Bu, fayllara və terminala real çıxışı olan agent alətidir. Bölmələr: Objective, Context, Target State, Scope (yalnız burada işlə / toxunma), Constraints, Acceptance Criteria (hə/yox tipli yoxlamalar), Action Boundaries (dağıdıcı əməliyyatlardan əvvəl dayan və soruş), Progress Evidence. "Yalnız birbaşa istənilən dəyişiklikləri et." qaydasını əlavə et.'
      }
    }
  },

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
      format: 'code',
      done: {
        en: 'the code runs as-is, meets every stated requirement and handles the listed edge cases.',
        az: 'kod dəyişiklik edilmədən işləyir, bütün tələblərə cavab verir və sadalanan kənar halları idarə edir.'
      }
    },

    writing: {
      label: 'Mətn yazımı / Kontent',
      weight: 0.8, // ümumi sözlər ("yaz", "mətn") — bərabərlikdə daha konkret sahə qalib gəlsin
      kw: ['məqalə', 'article', 'esse', 'essay', 'blog', 'hekayə', 'story', 'şeir', 'poem', 'mətn', 'text', 'yaz ', 'write', 'məktub', 'letter', 'email', 'e-poçt', 'məruzə', 'nitq', 'speech', 'ssenari', 'script for video', 'xəbər', 'redaktə', 'edit', 'rewrite', 'yenidən yaz', 'başlıq', 'headline'],
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
      format: 'prose',
      done: {
        en: 'the text delivers its core message clearly, fits the audience and needs no further editing before use.',
        az: 'mətn əsas mesajı aydın çatdırır, auditoriyaya uyğundur və istifadədən əvvəl əlavə redaktə tələb etmir.'
      }
    },

    marketing: {
      label: 'Marketinq / SMM',
      kw: ['reklam', 'marketinq', 'marketing', 'smm', 'instagram', 'facebook', 'tiktok', 'linkedin', 'brend', 'brand', 'slogan', 'kampaniya', 'campaign', 'post', 'caption', 'satış', 'sales', 'müştəri', 'customer', 'seo', 'landing', 'kopirayt', 'copywriting', ' ad ', ' ads ', 'advert', 'promo', 'endirim', 'məhsul təsviri', 'product description'],
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
      format: 'variants',
      done: {
        en: 'each variation states a clear benefit and a specific call to action within the platform’s length limits.',
        az: 'hər variant aydın fayda və konkret fəaliyyətə çağırış ehtiva edir və platformanın uzunluq limitinə sığır.'
      }
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
      format: 'report',
      done: {
        en: 'every conclusion is tied to a specific data point or clearly marked as an assumption.',
        az: 'hər nəticə konkret data nöqtəsinə əsaslanır və ya açıq şəkildə fərziyyə kimi qeyd olunub.'
      },
      grounded: true
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
      format: 'lesson',
      done: {
        en: 'a learner at the stated level could answer the check questions correctly after reading it.',
        az: 'göstərilən səviyyədəki öyrənən oxuduqdan sonra yoxlama suallarına düzgün cavab verə bilir.'
      },
      grounded: true
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
      format: 'report',
      done: {
        en: 'the recommendations are prioritized and each one has a concrete next step.',
        az: 'tövsiyələr prioritetləşdirilib və hər birinin konkret növbəti addımı var.'
      }
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
      format: 'report',
      done: {
        en: 'every claim is either well established or explicitly marked as debated or uncertain.',
        az: 'hər iddia ya yaxşı təsdiqlənib, ya da açıq şəkildə mübahisəli və ya qeyri-müəyyən kimi qeyd olunub.'
      },
      grounded: true
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
      format: 'structured',
      done: {
        en: 'every design decision has concrete values and a stated user benefit.',
        az: 'hər dizayn qərarının konkret dəyərləri və göstərilmiş istifadəçi faydası var.'
      }
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
      format: 'structured',
      done: {
        en: 'the answer directly resolves the request and can be acted on immediately.',
        az: 'cavab sorğunu birbaşa həll edir və dərhal tətbiq oluna bilər.'
      },
      grounded: true
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

  /* Prompt bölmələri və ümumi ifadələr (prompt-master qaydalarına əsasən) */
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
      clarifyShort: 'If essential information is missing, ask at most 3 short questions before starting.',
      grounding: 'Use only information you are highly confident is accurate. If uncertain, write [uncertain] next to the claim. Do not fabricate citations or statistics.',
      cite: 'Cite only sources you are certain of. If uncertain, say [uncertain].',
      formatLock: 'Follow this output format exactly. Do not add sections that are not listed.',
      audit: 'Structure the answer so it can be checked:\n1. Conclusion\n2. Assumptions\n3. Key evidence or intermediate results\n4. Verification checks performed\n5. Remaining uncertainty, if any\nKeep the rationale concise and decision-relevant; do not include a hidden reasoning trace.',
      doneWhen: d => `Done when ${d}`,
      complete: d => `The task is complete when ${d}`,
      search: 'If the task depends on current facts, use Web Search or X Search and cite your sources.',
      finalOnly: 'Do not output <think> tags; give only the final answer in the format above.',
      copyPlaceholders: 'Product: [PRODUCT NAME]. Brand voice: [BRAND VOICE].',
      sec: {
        role: 'Role', goal: 'Goal', context: 'Context', task: 'Task', instructions: 'Instructions',
        constraints: 'Constraints', output_format: 'Output Format', success_criteria: 'Success Criteria',
        answer_checks: 'Answer Structure', clarification: 'Clarification', tools: 'Tools', done: 'Done',
        input: 'Context / Input', output: 'Output', rules: 'Rules'
      },
      agent: {
        objective: 'Objective', context: 'Context', target: 'Target State', scope: 'Scope',
        constraints: 'Constraints', acceptance: 'Acceptance Criteria', boundaries: 'Action Boundaries', progress: 'Progress Evidence',
        stack: t => `Stack: ${t}`,
        files: 'Relevant files: [path/to/relevant/files]',
        tried: 'Already tried: [what was tried and why it failed — or "nothing yet"]',
        workIn: 'Work only in: [specific files and directories]',
        noTouch: 'Do NOT touch: .env, lock files, CI/config files, or anything outside the scope above',
        onlyRequested: 'Only make changes directly requested. Do not add features, abstractions or files beyond what was asked.',
        noDeps: 'Do not add new dependencies without asking first.',
        testsPass: 'Existing tests still pass',
        addCheck: '[Add one more binary check specific to this task]',
        proceed: 'Proceed with reversible, in-scope inspection, edits and validation.',
        stopAsk: 'Stop and ask before deleting files, adding dependencies, changing the database schema, pushing to git or any other external write.',
        evidence: 'After each major step output: ✅ [what was completed]. Ground every completion claim in a tool result or test output. At the end, list every file changed.'
      }
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
      clarifyShort: 'Vacib məlumat çatışmırsa, başlamazdan əvvəl ən çoxu 3 qısa sual ver.',
      grounding: 'Yalnız dəqiqliyinə tam əmin olduğun məlumatdan istifadə et. Əmin deyilsənsə, iddianın yanına [uncertain] yaz. İstinad və ya statistika uydurma.',
      cite: 'Yalnız əmin olduğun mənbələrə istinad et. Əmin deyilsənsə, [uncertain] yaz.',
      formatLock: 'Bu cavab formatına dəqiq əməl et. Sadalanmayan bölmələr əlavə etmə.',
      audit: 'Cavabı yoxlanıla bilən şəkildə qur:\n1. Nəticə\n2. Fərziyyələr\n3. Əsas dəlillər və ya aralıq nəticələr\n4. Aparılan yoxlamalar\n5. Qalan qeyri-müəyyənlik (varsa)\nƏsaslandırmanı qısa və qərara aid saxla; gizli düşüncə izini daxil etmə.',
      doneWhen: d => `Hazır sayılır, əgər ${d}`,
      complete: d => `Tapşırıq o zaman tamamlanmış sayılır ki, ${d}`,
      search: 'Tapşırıq aktual faktlardan asılıdırsa, Web Search və ya X Search istifadə et və mənbələri göstər.',
      finalOnly: '<think> teqləri çıxarma; yalnız yuxarıdakı formatda yekun cavabı ver.',
      copyPlaceholders: 'Məhsul: [PRODUCT NAME]. Brend səsi: [BRAND VOICE].',
      sec: {
        role: 'Rol', goal: 'Məqsəd', context: 'Kontekst', task: 'Tapşırıq', instructions: 'Təlimatlar',
        constraints: 'Məhdudiyyətlər', output_format: 'Cavab formatı', success_criteria: 'Uğur meyarı',
        answer_checks: 'Cavabın strukturu', clarification: 'Aydınlaşdırma', tools: 'Alətlər', done: 'Hazır meyarı',
        input: 'Kontekst / Giriş', output: 'Cavab', rules: 'Qaydalar'
      },
      agent: {
        objective: 'Məqsəd', context: 'Kontekst', target: 'Hədəf vəziyyət', scope: 'Əhatə',
        constraints: 'Məhdudiyyətlər', acceptance: 'Qəbul meyarları', boundaries: 'Fəaliyyət sərhədləri', progress: 'İrəliləyiş sübutu',
        stack: t => `Texnologiyalar: ${t}`,
        files: 'Aidiyyəti fayllar: [path/to/relevant/files]',
        tried: 'Artıq sınanıb: [nə sınanıb və niyə alınmayıb — və ya "hələ heç nə"]',
        workIn: 'Yalnız burada işlə: [konkret fayllar və qovluqlar]',
        noTouch: 'Toxunma: .env, lock faylları, CI/konfiqurasiya faylları və yuxarıdakı əhatədən kənar hər şey',
        onlyRequested: 'Yalnız birbaşa istənilən dəyişiklikləri et. İstənilməyən funksiya, abstraksiya və ya fayl əlavə etmə.',
        noDeps: 'Soruşmadan yeni asılılıq (dependency) əlavə etmə.',
        testsPass: 'Mövcud testlər keçir',
        addCheck: '[Bu tapşırığa xas daha bir hə/yox yoxlaması əlavə edin]',
        proceed: 'Geri qaytarıla bilən, əhatə daxilində araşdırma, dəyişiklik və yoxlamaları sərbəst et.',
        stopAsk: 'Fayl silməzdən, asılılıq əlavə etməzdən, verilənlər bazası sxemini dəyişməzdən, git-ə push etməzdən və ya digər xarici yazmadan əvvəl dayan və soruş.',
        evidence: 'Hər əsas addımdan sonra yaz: ✅ [nə tamamlandı]. Hər "hazırdır" iddiasını alət nəticəsi və ya test çıxışı ilə əsaslandır. Sonda dəyişdirilən bütün faylları sadala.'
      }
    }
  },

  /* Meta-prompt: modeldən promptu özünün yazmasını xahiş edir (prompt-master prinsipləri ilə) */
  META: {
    en: {
      intro: 'You are an expert prompt engineer. Turn my rough idea below into a single production-ready prompt for {model}.',
      known: 'What I already know:',
      labels: { domain: 'Domain', audience: 'Audience', goal: 'Goal', length: 'Length / format', tone: 'Tone', lang: 'The answer should be in' },
      process: [
        'Work in two steps:',
        '1. Check the idea for: task, output format, constraints, audience and success criteria. If something critical is missing, ask me at most 3 short questions and wait. Otherwise skip this step.',
        '2. Write the prompt. It must: assign a specific expert role; state the task with a precise verb; include the relevant context and audience; list concrete constraints; lock the output format and length; define a binary success criterion ("Done when …"); add a grounding rule for any factual content. Every sentence must be load-bearing. Do not request hidden chain-of-thought — ask for conclusions, assumptions and checks instead. Never include API keys or secrets.',
        '',
        '{model} specifics: {tips}',
        '',
        'Return the prompt in a single code block, then exactly one line: "🎯 Target: {model} — 💡 [what was optimized and why]". No other explanation.'
      ]
    },
    az: {
      intro: 'Sən ekspert prompt mühəndisisən. Aşağıdakı kobud ideyamı {model} üçün istifadəyə tam hazır, tək bir prompta çevir.',
      known: 'Artıq bildiklərim:',
      labels: { domain: 'Sahə', audience: 'Auditoriya', goal: 'Məqsəd', length: 'Həcm / format', tone: 'Ton', lang: 'Cavabın dili' },
      process: [
        'İki addımla işlə:',
        '1. İdeyanı yoxla: tapşırıq, cavab formatı, məhdudiyyətlər, auditoriya və uğur meyarı. Kritik məlumat çatışmırsa, mənə ən çoxu 3 qısa sual ver və gözlə. Əks halda bu addımı keç.',
        '2. Promptu yaz. Prompt: konkret ekspert rolu təyin etməli; tapşırığı dəqiq feillə ifadə etməli; lazımi konteksti və auditoriyanı daxil etməli; konkret məhdudiyyətləri sadalamalı; cavabın formatını və həcmini kilidləməli; hə/yox tipli uğur meyarı ("Hazır sayılır, əgər …") müəyyən etməli; faktlara aid hissələr üçün uydurmama qaydası əlavə etməlidir. Hər cümlə iş görməlidir, boş söz olmasın. Gizli düşüncə zənciri istəmə — bunun yerinə nəticə, fərziyyə və yoxlamalar istə. Heç vaxt API açarı və ya gizli məlumat daxil etmə.',
        '',
        '{model} üçün xüsusi qaydalar: {tips}',
        '',
        'Promptu bir kod blokunda qaytar, sonra düz bir sətir yaz: "🎯 Hədəf: {model} — 💡 [nə optimallaşdırıldı və niyə]". Başqa izah yazma.'
      ]
    }
  },

  /* Promptda qalmamalı olan gizli məlumatlar (API açarları, tokenlər, parollar) */
  SECRETS: [
    /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{16,}/g,
    /\bAKIA[0-9A-Z]{16}\b/g,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g,
    /\bxox[abprs]-[A-Za-z0-9-]{10,}/g,
    /\bAIza[0-9A-Za-z_-]{30,}/g,
    /\b(api[_ -]?key|token|password|parol|secret)(\s*[:=]\s*)\S+/gi
  ],

  /* Boş başlanğıc üçün nümunə ideyalar */
  EXAMPLES: [
    'Python-da CSV faylını oxuyub aylıq satış hesabatı çıxaran skript yaz',
    'Yeni açılan kafe üçün Instagram reklam postu hazırla',
    '10-cu sinif şagirdlərinə fotosintezi sadə dillə izah et'
  ]
};

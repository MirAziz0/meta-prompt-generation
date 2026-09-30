// İşə salmaq: node --test tests/engine.test.js
const test = require('node:test');
const assert = require('node:assert');

globalThis.window = globalThis;
require('../templates.js');
require('../engine.js');
const E = globalThis.PromptEngine;

const base = {
  plang: 'en', domain: 'auto', tone: 'auto', rlang: 'same', format: 'auto', detail: 'standard',
  audience: '', goal: '', length: '', clarify: false, reasoning: false
};

test('sahə aşkarlanması', () => {
  const cases = {
    'Python-da CSV faylını oxuyub satış hesabatı çıxaran skript yaz': 'code',
    'Kafe üçün Instagram reklam mətni hazırla': 'marketing',
    'Write an Instagram ad for a new coffee shop': 'marketing',
    '10-cu sinif şagirdlərinə fotosintezi izah et': 'education',
    'Mənə biznes plan hazırla, büdcə 5000 AZN': 'business',
    'Bu gün nə bişirim?': 'general'
  };
  for (const [idea, want] of Object.entries(cases)) assert.strictEqual(E.detectDomain(idea), want, idea);
});

test('niyyət aşkarlanması', () => {
  assert.strictEqual(E.detectIntent('Bu kod işləmir, xəta verir'), 'fix');
  assert.strictEqual(E.detectIntent('React vs Vue müqayisə et'), 'compare');
  assert.strictEqual(E.detectIntent('Объясни как работает Docker'), 'explain');
  assert.strictEqual(E.detectIntent('Bu mətnin xülasəsini ver'), 'summarize');
});

test('texnologiya və platforma', () => {
  assert.deepStrictEqual(E.detectTech('React və Node ilə sayt'), ['React', 'Node.js']);
  assert.deepStrictEqual(E.detectTech('JavaScript funksiyası'), ['JavaScript']); // "Java" səhvən tapılmamalıdır
  assert.deepStrictEqual(E.detectPlatforms('Instagram və LinkedIn üçün post'), ['instagram', 'linkedin']);
});

test('dil aşkarlanması', () => {
  assert.strictEqual(E.detectLang('Write an ad for a coffee shop in İçərişəhər'), 'en');
  assert.strictEqual(E.detectLang('10-cu sinif şagirdlərinə fotosintezi izah et'), 'az');
  assert.strictEqual(E.detectLang('Объясни как работает Docker'), 'ru');
});

test('prompt bütün əsas bölmələri və istifadəçi detallarını ehtiva edir', () => {
  const { text } = E.build({ ...base, idea: 'Instagram post yaz', audience: 'tələbələr', goal: 'qeydiyyat', length: '100 söz' });
  for (const tag of ['role', 'context', 'task', 'instructions', 'constraints', 'output_format']) {
    assert.ok(text.includes(`<${tag}>`) && text.includes(`</${tag}>`), tag);
  }
  assert.ok(text.includes('tələbələr') && text.includes('qeydiyyat') && text.includes('100 söz'));
  assert.ok(text.includes('Instagram:'), 'platforma qaydası əlavə olunmalıdır');
  assert.ok(!text.includes('<clarification>'));
});


const MODELS = ['claude', 'gpt', 'gemini', 'grok', 'reasoning', 'llama', 'agent'];
const noPlaceholders = t => !/\{\w+\}/.test(t) && !t.includes('undefined');

test('opsional bölmələr və AZ dili', () => {
  const { text } = E.build({ ...base, plang: 'az', idea: 'Python skript yaz', clarify: true, reasoning: true });
  assert.ok(text.includes('<clarification>'));
  assert.ok(text.includes('<answer_structure>'));
  assert.ok(text.includes('Python üzrə'));
  assert.ok(noPlaceholders(text));
});

test('prompt-master: heç bir modeldə gizli düşüncə tələbi yoxdur', () => {
  for (const model of MODELS) {
    for (const plang of ['en', 'az']) {
      const { text } = E.build({ ...base, plang, model, idea: 'Bu kod işləmir, xəta verir', reasoning: true, clarify: true });
      assert.ok(!/<thinking>|step by step inside|chain-of-thought|addım-addım düşün/i.test(text), `${model}/${plang}`);
      assert.ok(noPlaceholders(text), `${model}/${plang} doldurulmamış yer tutucu`);
    }
  }
});

test('prompt-master: hər modeldə uğur meyarı var', () => {
  for (const model of MODELS) {
    const { text } = E.build({ ...base, model, idea: 'Python skript yaz' });
    assert.ok(/Done when|complete when/.test(text), model);
  }
});

test('prompt-master: fakt tapşırıqlarında uydurmama qaydası, yaradıcıda yox', () => {
  const research = E.build({ ...base, idea: 'Süni intellektin təhsilə təsiri haqqında tədqiqat xülasəsi' }).text;
  assert.ok(research.includes('[uncertain]'));
  const ad = E.build({ ...base, idea: 'Kafe üçün Instagram reklam postu' }).text;
  assert.ok(!ad.includes('Do not fabricate citations'));
  assert.ok(ad.includes('[PRODUCT NAME]') && ad.includes('[BRAND VOICE]'), 'kopirayt yer tutucuları');
});

test('prompt-master: səhv tapma və müqayisədə yoxlanıla bilən cavab avtomatik', () => {
  assert.ok(E.build({ ...base, idea: 'Bu kod xəta verir' }).text.includes('Verification checks'));
  assert.ok(E.build({ ...base, idea: 'React vs Vue müqayisə et' }).text.includes('Verification checks'));
  assert.ok(!E.build({ ...base, idea: 'Dəniz haqqında şeir yaz' }).text.includes('Verification checks'));
});

test('modellərin strukturu', () => {
  const idea = 'Python skript yaz';
  const r = model => E.build({ ...base, idea, model }).text;

  const claude = r('claude');
  assert.ok(claude.includes('<role>') && claude.includes('<success_criteria>') && !claude.includes('## '));

  const gpt = r('gpt');
  for (const h of ['## Goal', '## Context', '## Constraints', '## Done']) assert.ok(gpt.includes(h), h);
  assert.ok(!gpt.includes('<role>') && !gpt.includes('## Instructions'), 'GPT hər addımı diktə etməməlidir');

  const gemini = r('gemini');
  assert.ok(gemini.includes('[uncertain]') && gemini.includes('Follow this output format exactly'));
  assert.ok(gemini.indexOf('## Task') > gemini.indexOf('## Output Format'), 'Gemini-də tapşırıq sonda');

  assert.ok(r('grok').includes('Web Search or X Search'));

  const reasoning = r('reasoning');
  assert.ok(reasoning.split(/\s+/).length < 200, 'reasoning promptu 200 sözdən qısa olmalıdır');
  assert.ok(!reasoning.includes('Work through the task') && reasoning.includes('Do not output <think> tags'));

  const llama = r('llama');
  assert.ok(!llama.includes('## ') && llama.startsWith('You are'), 'Llama: düz struktur, rol ilə başlayır');

  const agent = r('agent');
  for (const h of ['## Objective', '## Target State', '## Scope', '## Acceptance Criteria', '## Action Boundaries', '## Progress Evidence']) {
    assert.ok(agent.includes(h), h);
  }
  assert.ok(agent.includes('- [ ] ') && agent.includes('Only make changes directly requested'));
});

test('gizli açarlar promptdan silinir', () => {
  const idea = 'Bu açarla OpenAI API-yə sorğu göndərən skript yaz: sk-proj-abcdefghijklmnop1234567890 və password=hunter2';
  const { text, meta } = E.build({ ...base, idea });
  assert.ok(meta.secretsRemoved);
  assert.ok(!text.includes('sk-proj-abc') && !text.includes('hunter2'));
  assert.ok(text.includes('[REDACTED]') && text.includes('password=[REDACTED]'));
  assert.ok(!E.build({ ...base, idea: 'Python skript yaz' }).meta.secretsRemoved);
});

test('meta-prompt', () => {
  const { text } = E.buildMeta({ ...base, idea: 'Kafe üçün reklam', audience: 'gənclər' });
  assert.ok(text.includes('<idea>\nKafe üçün reklam\n</idea>'));
  assert.ok(text.includes('Audience: gənclər'));
  assert.ok(text.includes('Azerbaijani'));
  assert.ok(text.includes('at most 3 short questions') && text.includes('🎯 Target: Claude'));
});

test('meta-prompt seçilmiş modelə uyğunlaşır', () => {
  for (const model of MODELS) {
    for (const plang of ['en', 'az']) {
      const t = E.buildMeta({ ...base, plang, idea: 'Kafe reklamı', model }).text;
      assert.ok(noPlaceholders(t), `${model}/${plang}`);
    }
  }
  assert.ok(E.buildMeta({ ...base, idea: 'x', model: 'gpt' }).text.includes('Goal, Context, Constraints, Done'));
  assert.ok(E.buildMeta({ ...base, idea: 'x', model: 'reasoning' }).text.includes('under 200 words'));
  assert.ok(E.buildMeta({ ...base, plang: 'az', idea: 'x', model: 'gemini' }).text.includes('Gemini üçün xüsusi qaydalar'));
});

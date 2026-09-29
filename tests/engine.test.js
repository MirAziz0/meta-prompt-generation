// İşə salmaq: node --test tests/engine.test.js
const test = require('node:test');
const assert = require('node:assert');

globalThis.window = globalThis;
require('../templates.js');
require('../engine.js');
const E = globalThis.PromptEngine;

const base = {
  plang: 'en', domain: 'auto', tone: 'auto', rlang: 'same', format: 'auto', detail: 'standard',
  audience: '', goal: '', length: '', clarify: false, thinking: false
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

test('opsional bölmələr və AZ dili', () => {
  const { text } = E.build({ ...base, plang: 'az', idea: 'Python skript yaz', clarify: true, thinking: true });
  assert.ok(text.includes('<clarification>'));
  assert.ok(text.includes('<thinking>'));
  assert.ok(text.includes('Python üzrə'));
  assert.ok(!/\{\w+\}/.test(text), 'doldurulmamış yer tutucu qalmamalıdır');
});

test('meta-prompt', () => {
  const { text } = E.buildMeta({ ...base, idea: 'Kafe üçün reklam', audience: 'gənclər' });
  assert.ok(text.includes('<idea>\nKafe üçün reklam\n</idea>'));
  assert.ok(text.includes('Audience: gənclər'));
  assert.ok(text.includes('Azerbaijani'));
});

test('modellər: Claude XML, ChatGPT Markdown, Gemini tapşırıq sonda', () => {
  const idea = 'Python skript yaz';
  const claude = E.build({ ...base, idea, model: 'claude' }).text;
  const gpt = E.build({ ...base, idea, model: 'gpt', thinking: true }).text;
  const gemini = E.build({ ...base, idea, model: 'gemini' }).text;

  assert.ok(claude.includes('<role>') && !claude.includes('## Role'));
  assert.ok(gpt.includes('## Role') && !gpt.includes('<role>') && !gpt.includes('<thinking>'));
  assert.ok(gemini.includes('## Role'));
  assert.ok(gemini.indexOf('## Task') > gemini.indexOf('## Output Format'), 'Gemini-də tapşırıq sonda olmalıdır');
  assert.ok(gpt.indexOf('## Task') < gpt.indexOf('## Constraints'));
});

test('meta-prompt seçilmiş modelə uyğunlaşır', () => {
  const gpt = E.buildMeta({ ...base, idea: 'Kafe reklamı', model: 'gpt' }).text;
  assert.ok(gpt.includes('prompts for ChatGPT') && gpt.includes('Markdown headings'));
  const az = E.buildMeta({ ...base, plang: 'az', idea: 'Kafe reklamı', model: 'gemini' }).text;
  assert.ok(az.includes('Gemini üçün') && az.includes('sonda'));
  assert.ok(!/\{\w+\}/.test(gpt + az));
});

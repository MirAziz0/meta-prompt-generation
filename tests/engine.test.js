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

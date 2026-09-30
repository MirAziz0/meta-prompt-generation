# meta-prompt-generation

Sadə ideyanı **Claude, ChatGPT, Gemini və digər AI modelləri** üçün strukturlaşdırılmış, güclü prompta çevirən veb tətbiq. Tam brauzerdə işləyir — API açarı lazım deyil.

**Canlı:** https://miraziz0.github.io/meta-prompt-generation/

## Modellər

Hər model üçün prompt onun rəsmi tövsiyəsinə və [prompt-master](https://github.com/nidhinjs/prompt-master) qaydalarına uyğun qurulur:

| Model | Struktur |
|---|---|
| Claude | XML teqləri, aydın uğur meyarı |
| ChatGPT | Yığcam Goal / Context / Constraints / Done |
| Gemini | Mənbə qaydası, sərt format kilidi, tapşırıq sonda |
| Grok | Nəticəyə fokuslu; aktual faktlar üçün Web/X axtarışı |
| o3 / DeepSeek-R1 | Qısa (<200 söz), heç bir düşüncə skeleti olmadan |
| Llama / Mistral | Qısa, düz struktur, açıq rol |
| Claude Code / Cursor | Agent brifi: hədəf vəziyyət, əhatə kilidi, qəbul meyarları, dayanma sərhədləri |

**Bütün modellərdə:** gizli düşüncə (chain-of-thought) tələb olunmur; hər promptda "Done when" uğur meyarı var; fakt tapşırıqlarında uydurmama qaydası; səhv tapma və müqayisədə yoxlanıla bilən cavab strukturu; API açarları və parollar avtomatik silinir.

## İki rejim

- **Hazır prompt** — ideya dərhal Role / Context / Task / Instructions / Constraints / Output Format bölmələri olan seçilmiş modelə uyğun prompta çevrilir.
- **Model özü yazsın** — modelə veriləcək meta-prompt: model lazım olsa suallar verir və ideyanız üçün xüsusi prompt yazır.

## Nələri özü tanıyır

- Sahə (kod, marketinq, təhsil, biznes, data, tədqiqat, dizayn, yazı)
- Niyyət (düzəlt, izah et, müqayisə et, xülasə, plan…) → uyğun cavab formatı
- Texnologiya (Python, React…) və platforma (Instagram, TikTok, LinkedIn, e-poçt)
- İdeyanın dili → cavab dili

## İşə salmaq

- `index.html` faylını brauzerdə açın, **və ya**
- `start.bat` ilə `http://localhost:8080` ünvanında işə salın.

Testlər: `node --test tests/engine.test.js`

## Struktur

| Fayl | Təyinat |
|---|---|
| `index.html`, `styles.css` | İnterfeys |
| `templates.js` | Şablon bazası — yeni sahə, format və ya platforma buraya əlavə olunur |
| `engine.js` | Analiz və prompt qurma məntiqi |
| `app.js` | UI hadisələri və kopyalama |

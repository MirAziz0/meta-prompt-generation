# meta-prompt-generation

Sadə ideyanı Claude üçün strukturlaşdırılmış, güclü prompta çevirən veb tətbiq. Tam brauzerdə işləyir — API açarı lazım deyil.

**Canlı:** https://miraziz0.github.io/meta-prompt-generation/

## İki rejim

- **Hazır prompt** — ideya dərhal Role / Context / Task / Instructions / Constraints / Output Format bölmələri olan XML-strukturlu prompta çevrilir.
- **Claude özü yazsın** — Claude-a veriləcək meta-prompt: Claude lazım olsa suallar verir və ideyanız üçün xüsusi prompt yazır.

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

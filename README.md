# meta-prompt-generation

Sadə ideyanı Claude üçün strukturlaşdırılmış, ətraflı prompta çevirən veb tətbiq. Tam klient tərəfində işləyir — API açarı lazım deyil.

## İşə salmaq

- `index.html` faylını brauzerdə birbaşa açın, **və ya**
- `start.bat` ilə `http://localhost:8080` ünvanında işə salın (Python və ya Node lazımdır).

## Xüsusiyyətlər

- Sahə, niyyət, texnologiya və dilin avtomatik aşkarlanması
- Role / Context / Task / Instructions / Constraints / Output Format bölmələri
- XML teqlər və ya Markdown struktur
- Prompt dili (EN/AZ) və cavab dili ayrıca seçilir
- İdeyanın keyfiyyət qiymətləndirməsi və məsləhətlər
- Copy Prompt, `.txt` yükləmə, son kopyalananların tarixçəsi

## Struktur

| Fayl | Təyinat |
|---|---|
| `index.html` | İnterfeys |
| `styles.css` | Dizayn (dark mode) |
| `templates.js` | Şablon bazası — yeni sahə/format buraya əlavə olunur |
| `engine.js` | Analiz və prompt qurma məntiqi |
| `app.js` | UI hadisələri, kopyalama, tarixçə |

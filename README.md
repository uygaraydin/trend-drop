# TrendDrop

Haftalık moda trend istihbarat platformu. Bir AI agent her hafta global moda kaynaklarını tarayıp analiz eder, sonuçları otomatik olarak web sitesinde yayınlar. Tamamen otonom — insan müdahalesi gerektirmez.

**Canlı Site:** https://site-next-gold.vercel.app/

---

## Ne Yapar?

- 30+ moda sitesini tarar (Zara, H&M, Bershka, Mango, ASOS, Nike, Trendyol...)
- Genel web araması ile global trend sinyallerini yakalar
- Trendleri skorlar ve sıralar (top 10)
- Renk ve kumaş trendlerini çıkarır
- Her trende momentum, risk ve aksiyon analizi ekler
- Sonuçları haftalık olarak web sitesinde yayınlar

---

## Nasıl Çalışır?

Her Pazartesi saat 12:00'de (TR) sistem otomatik olarak başlar:

```
GitHub Actions tetiklenir
        ↓
Claude Code agent'ı çalıştırır
        ↓
Agent 4 skill'i sırayla çalıştırır:
  1. Web Tarama    → siteleri + web aramasını tarar
  2. Analiz        → veriyi skorlar ve sıralar
  3. Rapor         → Türkçe haftalık rapor üretir
  4. İstihbarat    → momentum, risk, aksiyon analizi
        ↓
build.py → report.json üretir
        ↓
git push → Vercel otomatik deploy
        ↓
Site güncellenir
```

---

## Veri Kaynakları

Agent iki yöntemle veri toplar:

**Sabit Siteler (Playwright ile tarama):**

| Tier | Kaynaklar | Sıklık |
|------|-----------|--------|
| 1 | Zara, H&M, Bershka, Pull&Bear, Stradivarius, Shein | Her tarama |
| 2 | Mango, ASOS, Nike, Trendyol, Koton | Haftada 2-3 |
| 3 | Who What Wear, Hypebeast, Highsnobiety, Pinterest, TikTok | Haftalık |
| 4 | Vogue, Elle, Tagwalk | Aylık |

**Genel Web Araması (WebSearch):**

Her taramada global aramalar yapılır:
- "fashion trends 2026 spring summer"
- "gen z fashion trends this week"
- "streetwear trends 2026"
- "color trends fashion 2026"
- "fabric trends 2026"

İlk 5-10 sonuç açılıp taranır — sabit listede olmayan yeni kaynakları yakalar.

---

## Agent Pipeline

| Sıra | Skill | Girdi | Çıktı |
|------|-------|-------|-------|
| 1 | WEB_TREND_SCANNING | Siteler + web araması | `scan-data.json` |
| 2 | TREND_ANALYSIS | scan-data.json | `analysis.json` |
| 3 | REPORT_GENERATION | analysis.json | `weekly-report.md` |
| 4 | TREND_INTELLIGENCE | weekly-report.md | `intelligence.json` |

Her skill bir öncekinin çıktısını girdi olarak alır. Çıktılar `agent/data/outputs/YYYY-MM-DD/` altında haftalık klasörlerde saklanır.

---

## Arayüz

Site 6 bölümden oluşur:

- **Hafta dropdown** — geçmiş haftalara geçiş
- **Öne çıkanlar** — haftanın 3 ana sinyali
- **Trend kartları** — skor, kategori, yaşam döngüsü, intelligence butonu
- **Renk trendleri** — renk, durum, nerede giyilir, kombin önerisi
- **Kumaş trendleri** — kumaş adı, yönü, kullanım alanı
- **Gelecek hafta** — beklentiler ve tahminler

Her trend kartına tıklayınca detay modal açılır (nedir, neden şimdi, nasıl giyilir, kaynaklar). Intelligence butonuyla momentum skoru, güven skoru, aksiyon önerisi ve risk analizi görüntülenir.

---

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| AI Agent | Claude Code + Claude API (Anthropic) |
| Web Scraping | Playwright MCP |
| Web Araması | WebSearch + WebFetch |
| Frontend | Next.js 16, Tailwind CSS, TypeScript |
| Font | IBM Plex Sans + IBM Plex Mono |
| Hosting | Vercel (otomatik deploy) |
| CI/CD | GitHub Actions (haftalık cron) |
| Veri Akışı | Agent çıktıları → build.py → report.json → Next.js |

---

## Proje Yapısı

```
trenddrop/
├── agent/
│   ├── AGENT.md                # Agent tanımı
│   ├── skills/                 # 4 skill dosyası
│   │   ├── WEB_TREND_SCANNING.md
│   │   ├── TREND_ANALYSIS.md
│   │   ├── REPORT_GENERATION.md
│   │   └── TREND_INTELLIGENCE.md
│   └── data/outputs/           # Haftalık çıktılar (tarih bazlı)
├── knowledge/
│   ├── AUDIENCE.md             # Hedef kitle tanımı
│   ├── BRAND.md                # Marka stratejisi
│   └── STRATEGY.md             # Genel strateji
├── src/
│   ├── app/page.tsx            # Ana sayfa
│   ├── components/
│   │   ├── trend-modal.tsx     # Trend detay modal
│   │   └── intelligence-panel.tsx
│   └── lib/
│       ├── report.json         # build.py'nin ürettiği veri
│       └── report-data.ts      # TypeScript tipleri
├── build.py                    # Agent çıktıları → report.json
├── deploy.sh                   # Manuel deploy scripti
└── .github/workflows/
    └── weekly-trends.yml       # Pazartesi otomatik çalışma
```

---

## Kurulum

```bash
# Repo'yu klonla
git clone https://github.com/uygaraydin/trenddrop.git
cd trenddrop

# Bağımlılıkları kur
npm install

# report.json oluştur (mevcut agent çıktılarından)
python3 build.py

# Geliştirme sunucusunu başlat
npm run dev
```

Site http://localhost:3000 adresinde açılır.

---

## Deploy

**Otomatik:** GitHub Actions her Pazartesi 12:00 (TR) çalışır. Manuel tetiklemek için: GitHub repo → Actions → "Run workflow".

**Manuel:** Agent çalıştıktan sonra `bash deploy.sh` — build eder, commit eder, push'lar, Vercel otomatik deploy eder.

---

Yapımcı: Claude Code Agent + Uygar Aydın

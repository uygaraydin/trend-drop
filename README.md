# TrendDrop

Haftalık moda trend istihbarat platformu. AI agent her hafta moda kaynaklarını tarayıp analiz eder, sonuçları otomatik olarak web sitesinde yayınlar.

**Canlı Site:** https://site-next-gold.vercel.app/

---

## Ne Yapar?

TrendDrop, moda dünyasındaki trendleri otomatik olarak takip eden bir sistemdir:

- Zara, H&M, Who What Wear gibi siteleri + genel web araması ile tarar
- Trendleri skorlar ve sıralar (top 10)
- Renk ve kumaş trendlerini çıkarır
- Her trende momentum, risk ve aksiyon analizi ekler
- Sonuçları haftalık olarak web sitesinde yayınlar

Hedef kitle: Türkiye'deki Gen Z moda takipçileri.

---

## Nasıl Çalışır?

```
Her Pazartesi 12:00 (TR)
    |
    v
GitHub Actions başlar
    |
    v
Claude Code, agent'ı çalıştırır (4 skill sırayla)
    |
    v
build.py → report.json üretir
    |
    v
git push → Vercel otomatik deploy
    |
    v
Site güncellenir
```

---

## Agent Pipeline

Agent 4 skill'den oluşur, sırayla çalışır:

| Sıra | Skill | Ne Yapar |
|------|-------|----------|
| 1 | WEB_TREND_SCANNING | Moda sitelerini Playwright ile tarar, ham veri toplar |
| 2 | TREND_ANALYSIS | Toplanan veriyi skorlar, kategorize eder, sıralar |
| 3 | REPORT_GENERATION | Türkçe haftalık rapor üretir (top 10 trend, renkler, kumaşlar) |
| 4 | TREND_INTELLIGENCE | Her trende momentum, risk, aksiyon analizi ekler |

Agent çıktıları `agent/data/outputs/YYYY-MM-DD/` altına yazılır.

---

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| AI Agent | Claude Code + Claude API |
| Web Scraping | Playwright MCP |
| Frontend | Next.js 16, Tailwind CSS, TypeScript |
| Font | IBM Plex Sans + IBM Plex Mono |
| Hosting | Vercel (otomatik deploy) |
| CI/CD | GitHub Actions (haftalık cron) |
| Veri | JSON (agent çıktıları → build.py → report.json) |

---

## Proje Yapısı

```
trenddrop/
  agent/                      # AI agent tanımları
    AGENT.md                  # Agent tanımı
    skills/                   # 4 skill dosyası
    data/outputs/             # Haftalık çıktılar
  knowledge/                  # Hedef kitle ve strateji
  src/
    app/page.tsx              # Ana sayfa
    components/
      trend-modal.tsx         # Trend detay modal
      intelligence-panel.tsx  # Intelligence paneli
    lib/
      report.json             # build.py'nin ürettiği veri
      report-data.ts          # TypeScript tipleri
  build.py                    # Agent çıktıları → report.json
  deploy.sh                   # Manuel deploy scripti
  .github/workflows/
    weekly-trends.yml         # Pazartesi otomatik çalışma
```

---

## Arayüz Özellikleri

- **Hafta dropdown** — Geçmiş haftalara geçiş
- **Trend kartları** — Skor, kategori, yaşam döngüsü badge'i
- **Trend detay modal** — Nedir, neden şimdi, nasıl giyilir, kaynaklar
- **Intelligence paneli** — Momentum, güven skoru, aksiyon, risk
- **Renk trendleri** — Renk, durum, nerede giyilir, kombin önerisi
- **Kumaş trendleri** — Kumaş adı, yönü, kullanım
- **Gelecek hafta** — Beklentiler ve tahminler

---

## Lokal Geliştirme

```bash
# Bağımlılıkları kur
npm install

# report.json oluştur
python3 build.py

# Geliştirme sunucusunu başlat
npm run dev
```

Site http://localhost:3000 adresinde açılır.

---

## Manuel Deploy

```bash
# Agent çalıştıktan sonra:
bash deploy.sh
```

Bu komut: `build.py` çalıştırır, değişiklikleri commit eder, GitHub'a push'lar. Vercel otomatik deploy eder.

---

## Otomatik Deploy

GitHub Actions her Pazartesi 12:00 (TR) otomatik çalışır. Manuel tetiklemek için: GitHub repo → Actions → "Run workflow".

---

Yapımcı: Claude Code Agent + Uygar Aydın

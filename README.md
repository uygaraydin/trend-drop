# TrendDrop

Haftalik moda trend istihbarat platformu. AI agent her hafta moda kaynaklarini tarayip analiz eder, sonuclari otomatik olarak web sitesinde yayinlar.

**Canli Site:** https://site-next-gold.vercel.app/

---

## Ne Yapar?

TrendDrop, moda dunyasindaki trendleri otomatik olarak takip eden bir sistemdir:

- Zara, H&M, Who What Wear gibi kaynaklari tarar
- Trendleri skorlar ve siralar (top 10)
- Renk ve kumas trendlerini cikarir
- Her trende momentum, risk ve aksiyon analizi ekler
- Sonuclari haftalik olarak web sitesinde yayinlar

Hedef kitle: Turkiye'deki Gen Z moda takipcileri.

---

## Nasil Calisir?

```
Her Pazartesi 12:00 (TR)
    |
    v
GitHub Actions baslar
    |
    v
Claude Code, agent'i calistirir (4 skill sirayla)
    |
    v
build.py --> report.json uretir
    |
    v
git push --> Vercel otomatik deploy
    |
    v
Site guncellenir
```

---

## Agent Pipeline

Agent 4 skill'den olusur, sirayla calisir:

| Sira | Skill | Ne Yapar |
|------|-------|----------|
| 1 | WEB_TREND_SCANNING | Moda sitelerini Playwright ile tarar, ham veri toplar |
| 2 | TREND_ANALYSIS | Toplanan veriyi skorlar, kategorize eder, siralar |
| 3 | REPORT_GENERATION | Turkce haftalik rapor uretir (top 10 trend, renkler, kumaslar) |
| 4 | TREND_INTELLIGENCE | Her trende momentum, risk, aksiyon analizi ekler |

Agent ciktilari `agent/data/outputs/YYYY-MM-DD/` altina yazilir.

---

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| AI Agent | Claude Code + Claude API |
| Web Scraping | Playwright MCP |
| Frontend | Next.js 16, Tailwind CSS, TypeScript |
| Font | IBM Plex Sans + IBM Plex Mono |
| Hosting | Vercel (otomatik deploy) |
| CI/CD | GitHub Actions (haftalik cron) |
| Veri | JSON (agent ciktilari --> build.py --> report.json) |

---

## Proje Yapisi

```
trenddrop/
  agent/                  # AI agent tanimlari
    AGENT.md              # Agent tanimi
    skills/               # 4 skill dosyasi
    data/outputs/         # Haftalik ciktilar
  knowledge/              # Hedef kitle ve strateji
  src/
    app/page.tsx          # Ana sayfa
    components/
      trend-modal.tsx     # Trend detay modal
      intelligence-panel.tsx  # Intelligence paneli
    lib/
      report.json         # build.py'nin urettigi veri
      report-data.ts      # TypeScript tipleri
  build.py                # Agent ciktilari --> report.json
  deploy.sh               # Manuel deploy scripti
  .github/workflows/
    weekly-trends.yml     # Pazartesi otomatik calisma
```

---

## Arayuz Ozellikleri

- **Hafta dropdown** -- Gecmis haftalara gecis
- **Trend kartlari** -- Skor, kategori, yasam dongusu badge'i
- **Trend detay modal** -- Nedir, neden simdi, nasil giyilir, kaynaklar
- **Intelligence paneli** -- Momentum, guven skoru, aksiyon, risk
- **Renk trendleri** -- Renk, durum, nerede giyilir, kombin onerisi
- **Kumas trendleri** -- Kumas adi, yonu, kullanim
- **Gelecek hafta** -- Beklentiler ve tahminler

---

## Lokal Gelistirme

```bash
# Bagimliliklari kur
npm install

# report.json olustur
python3 build.py

# Gelistirme sunucusunu baslat
npm run dev
```

Site http://localhost:3000 adresinde acilir.

---

## Manuel Deploy

```bash
# Agent calistiktan sonra:
bash deploy.sh
```

Bu komut: `build.py` calistirir, degisiklikleri commit eder, GitHub'a push'lar. Vercel otomatik deploy eder.

---

## Otomatik Deploy

GitHub Actions her Pazartesi 12:00 (TR) otomatik calisir. Manuel tetiklemek icin: GitHub repo --> Actions --> "Run workflow".

---

Yapimci: Claude Code Agent + Uygar Aydin

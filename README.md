# Social Media Auto Pilot 🚀

Automatically posts YouTube videos & shorts to TikTok, Instagram, Facebook, X (Twitter), Telegram, Pinterest, Dailymotion – **free, no approval needed**!

## Features
- **Full Automation**: Oldest-first posting (videos + shorts)
- **YouTube Sync**: Real API v3 fetch (Channel ID + API Key)
- **GetLate.dev Integration**: Single API for all platforms
- **AI Captions**: Engaging Hebrew/English + hashtags/emojis
- **Dashboard**: Stats, queue, errors
- **RTL Hebrew UI**: Dark modern theme
- **AdSense Ready**: Verified for monetization

## Quick Start
```bash
cd app
npm install
npm run dev  # http://localhost:5173
```

1. **Settings** → YouTube API Key ([console.developers.google.com](https://console.developers.google.com)) + Channel ID → Sync
2. **Settings** → GetLate API Key ([getlate.dev/signup](https://getlate.dev/signup))
3. **Automation/Schedule** → Enable → Auto-posts!

## Screenshots
![Dashboard](תמונות מסך של האפליקציית ווב שלי שקיימת אבל לא כול כך טובה/dashboard.png)
<!-- Add more screenshots from folder -->

## Deploy
```bash
npm run build  # dist/
```
Vercel/Netlify – AdSense auto-verifies.

## Tech
- React 19 + Vite + Tailwind-like CSS
- LocalStorage state
- YouTube Data API v3 + GetLate API

**Live Demo**: [localhost:5173](http://localhost:5173)

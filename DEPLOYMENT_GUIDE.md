# MamaMaps ZW - Deployment Guide

## Overview
MamaMaps ZW is a React PWA (Progressive Web App) that reads listings from your Google Sheet, displays them with trust signals, and integrates WhatsApp for direct commerce.

**Features:**
✅ Real-time data from Google Sheets
✅ WhatsApp pre-filled messaging
✅ 👍/👎 ratings system (saved locally)
✅ Bookmark/save listings
✅ Search & category filtering
✅ Featured listings ranking
✅ Warm, nurturing design for moms
✅ Mobile-first responsive design
✅ PWA-ready (installable, works offline with caching)

---

## Quick Start (5 minutes)

### Option 1: Deploy on Vercel (Recommended - Free Tier)

1. **Create a Vercel account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub or email

2. **Create a GitHub repo** (if you don't have one)
   ```bash
   git init
   git remote add origin https://github.com/YOUR_USERNAME/mamamaps-zw.git
   git branch -M main
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - In Vercel: Click "New Project"
   - Import your GitHub repo
   - Framework: Select "React"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click "Deploy"

4. **Your app is live!** Share the URL

---

### Option 2: Run Locally (Development)

**Requirements:**
- Node.js 16+ installed
- npm or yarn

**Steps:**

1. **Create project directory**
   ```bash
   mkdir mamamaps-zw
   cd mamamaps-zw
   ```

2. **Initialize with Vite (fastest React setup)**
   ```bash
   npm create vite@latest . -- --template react
   npm install
   ```

3. **Copy the component**
   - Replace `src/App.jsx` with the `mamamaps-zw-app.jsx` file provided
   - Or paste the component code into `src/App.jsx`

4. **Install dependencies**
   ```bash
   npm install lucide-react
   ```

5. **Start dev server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Click the local URL (usually `http://localhost:5173`)

---

## Project Structure

```
mamamaps-zw/
├── src/
│   ├── App.jsx           (MamaMaps component)
│   ├── main.jsx          (Entry point)
│   └── index.css         (Styles - can be empty, component uses inline styles)
├── public/
│   ├── manifest.json     (PWA manifest - see below)
│   └── favicon.svg       (Optional)
├── index.html            (HTML template)
├── vite.config.js        (Vite config)
├── package.json          (Dependencies)
└── .env.local            (Optional - for API key, currently hardcoded)
```

---

## Making It a PWA (Optional but Recommended)

PWA = Installable on home screen, works offline with cached data

### 1. Create `public/manifest.json`
```json
{
  "name": "MamaMaps ZW",
  "short_name": "MamaMaps",
  "description": "Where moms go, not guess. Trusted baby products & services in Zimbabwe.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#D4537E",
  "background_color": "#FFFAF8",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

### 2. Link manifest in `index.html`
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#D4537E">
```

### 3. Register Service Worker (optional)
Add to `src/main.jsx`:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed'));
}
```

---

## Configuration

### API Key & Sheet ID
Currently hardcoded in the component. To move to environment variables:

**In `src/App.jsx`, change:**
```javascript
const SHEET_ID = '1aVOYA1EvDdgvx1Wn5qsSseh_4uI2ejzmbyiwlrHUTfw';
const API_KEY = 'AIzaSyAcsSXWKoMbQHSzkOrPijFk31wRLJxzo18';
```

**To:**
```javascript
const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const API_KEY = import.meta.env.VITE_API_KEY;
```

**Create `.env.local`:**
```
VITE_SHEET_ID=1aVOYA1EvDdgvx1Wn5qsSseh_4uI2ejzmbyiwlrHUTfw
VITE_API_KEY=AIzaSyAcsSXWKoMbQHSzkOrPijFk31wRLJxzo18
```

---

## Build & Deploy Commands

### Build for production
```bash
npm run build
```
- Creates `dist/` folder with optimized files
- Ready to deploy anywhere

### Deploy to Vercel (from CLI)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop dist/ folder to netlify.com
```

---

## How It Works

### Data Flow
1. **User opens app**
2. **Component fetches from Google Sheets API** using `SHEET_ID` and `API_KEY`
3. **Filters active listings** (status = "active")
4. **Sorts by:** Featured → Top Picks → Priority Score → Rating %
5. **Displays to user**

### User Actions
- **Search:** Filters by name, tags, description
- **Category:** Filters by category (diapers, formula, etc.)
- **Save:** Stores listing ID in browser localStorage (no backend needed)
- **Rate:** Increments 👍/👎 counts in component state (demo only - use backend to persist)
- **WhatsApp:** Opens pre-filled message: "Hi, I found you on MamaMaps ZW. Do you have [item]?"

### Storage
- **Saved listings:** localStorage (persists on user's device)
- **Ratings:** Component state (resets on page refresh - upgrade to Supabase for persistence)

---

## Customization

### Change Colors (Warm/Nurturing Theme)
All colors are in hex. Search for these in `App.jsx`:

**Primary Pink (#D4537E)** - Main brand color
- Change to: `#C2185B`, `#E91E63`, `#F06292`

**Background Gradient (#FEE4E1 to #F8D7DA)**
- Change to: Your favorite warm pastels

**Example: Modern Teal instead of Pink**
```javascript
// Replace all:
#D4537E → #00897B
#FFD4D8 → #80CBC4
#FEE4E1 → #E0F2F1
#5C3D5C → #004D40
```

### Change Icons
Using Lucide React icons. Replace with:
```javascript
import { IconName } from 'lucide-react';
```

Available: Heart, MapPin, MessageCircle, Search, Star, ThumbsUp, ThumbsDown, Home, Navigation, Bookmark, User, Loader

### Add More Categories
In `categories` array:
```javascript
{ value: 'toys', label: 'Toys', emoji: '🧸' },
```

### Modify WhatsApp Message
Line: `const message = ...`
Change to:
```javascript
const message = `Hi! Looking for ${listing.name} in ${listing.location}. Do you have stock? 💚`;
```

---

## Troubleshooting

### "No data appears"
1. **Check API key & Sheet ID** in the code
2. **Check sheet is public** (Share → "Anyone with the link")
3. **Check column names** match the headers in Sheet row 1
4. **Check status = "active"** for listings to show

### "WhatsApp doesn't open"
- Ensure phone number starts with `+263` (Zimbabwe)
- Check WhatsApp is installed on the device

### "Ratings don't persist after refresh"
- Ratings are stored in component state (demo)
- To persist: upgrade to Supabase or Firebase Realtime DB

### "Search is slow"
- This is normal for 100+ listings
- Upgrade to Algolia or Firestore for instant search

---

## Next Steps (Phase 2 & 3)

### Phase 2: Advanced Ratings
- Add text reviews (not just 👍/👎)
- Persist ratings to Supabase
- Show review comments on listing detail page

### Phase 3: Deals & Promotions
- Add countdown timers for deals
- Notify users when deals expire
- Track deal performance

### Phase 4: Admin Dashboard
- Add login for admins
- Manage listings directly in app
- View click analytics
- Accept featured listing payments

### Phase 5: Monetization
- **Stripe integration** for featured listing payments
- **Affiliate tracking** on WhatsApp links
- **Commission tracking** per store

---

## Monitoring & Analytics

### Add Google Analytics (Optional)
```bash
npm install react-ga4
```

In `src/App.jsx`:
```javascript
import GA4 from 'react-ga4';
GA4.initialize('GA_MEASUREMENT_ID');
```

### Monitor API Usage
- Google Sheets API: 300 requests/minute per user
- Current setup: 1 request on app load
- Scale to thousands of users without issue

---

## Support & Troubleshooting

**Error: "Cannot read property 'map' of undefined"**
- Sheet is empty or has no active listings
- Check row 2+ has data with status="active"

**Error: "CORS error"**
- Google Sheets API blocks some origins
- Use Vercel deployment (whitelisted) or add CORS header

**Error: "WhatsApp link not working"**
- User doesn't have WhatsApp installed
- Phone number format is wrong (should be +263774974660)

---

## File Reference

### Key Files to Update

1. **src/App.jsx** - Main component (replace with provided code)
2. **.env.local** - API credentials (create this file)
3. **public/manifest.json** - PWA metadata (create for PWA)
4. **vite.config.js** - Already set up by Vite

---

## Live Demo
Once deployed, share the Vercel URL with moms in Harare. They can:
- Open on any device (desktop, mobile, tablet)
- Bookmark it as home screen icon
- Search for needs (diapers, formula, clinics)
- Find trusted places (verified, rated)
- Message directly on WhatsApp
- Save favorites for next time

---

## Revenue Checklist

✅ Featured listings showing at top (paid placements)
✅ Top Picks badge (curation + trust)
✅ Verified badge (builds trust)
✅ WhatsApp CTA (conversion engine)
✅ Deals section (drives traffic)
✅ Ratings (social proof)

Next: Add payment processing for featured listings.

---

**Questions? Let's build!** 🚀

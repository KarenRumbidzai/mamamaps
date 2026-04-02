# MamaMaps ZW - "Where moms go, not guess."

A React PWA (Progressive Web App) that connects Zimbabwean moms with trusted baby products, services, and clinics.

## 🎯 What It Does

- **Real-time listings** from Google Sheets (no database needed to start)
- **WhatsApp integration** for direct commerce (pre-filled messages)
- **Trust signals**: Verified badges, 👍/👎 ratings, mom reviews
- **Smart filtering**: Search by need (diapers, clinics, formula), not just category
- **Bookmarking**: Save favorite places locally
- **Mobile-first**: Designed for moms on Android/iOS
- **PWA**: Installable as home screen app, works offline

## 🚀 Quick Start (2 minutes)

### Prerequisites
- Node.js 16+ and npm
- Your Google Sheet with listings (see schema below)

### Installation

```bash
# Clone or create project
mkdir mamamaps-zw && cd mamamaps-zw

# Initialize with Vite + React
npm create vite@latest . -- --template react

# Copy the app component
# Replace src/App.jsx with the MamaMaps component code

# Install dependencies
npm install lucide-react

# Start development server
npm run dev
```

Open `http://localhost:5173` 🎉

## 📊 Google Sheet Schema

Your sheet needs these columns:

| id | name | category | subcategory | location | tags | whatsapp | description | verified | helpful_votes | not_helpful_votes | featured | top_pick | priority_score | deals | hours_status | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| mm_001 | BabyWorld | diapers | pampers | Avondale | affordable,delivery | +263774974660 | Affordable diapers, same-day delivery | TRUE | 18 | 2 | TRUE | TRUE | 9 | Diaper Bundle $18 | open | active |

**Key requirements:**
- Column order must match above (A through V minimum)
- Only rows with `status="active"` will show
- `whatsapp` must start with `+263` (Zimbabwe)
- Set sheet to **publicly viewable** (Share → "Anyone with the link")

## 🔑 Configuration

### Google Sheets API

1. Get your Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
   ```

2. Create API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable "Google Sheets API"
   - Create API Key (Restrict to Google Sheets API)

3. Add to `src/App.jsx`:
   ```javascript
   const SHEET_ID = 'your-sheet-id';
   const API_KEY = 'your-api-key';
   ```

Or use `.env.local`:
   ```
   VITE_SHEET_ID=your-sheet-id
   VITE_API_KEY=your-api-key
   ```

And update component:
   ```javascript
   const SHEET_ID = import.meta.env.VITE_SHEET_ID;
   const API_KEY = import.meta.env.VITE_API_KEY;
   ```

## 🛠 Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Deploy

### Vercel (Recommended - Free)

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo in Vercel dashboard.

### Netlify

```bash
npm run build
# Drag dist/ folder to netlify.com
```

### Traditional Hosting

```bash
npm run build
# Upload dist/ folder to any web server
```

## 🎨 Customization

### Colors (Warm/Nurturing Theme)

Edit hex colors in `src/App.jsx`:

- `#D4537E` - Primary pink (brand color)
- `#FEE4E1` - Light warm background
- `#5C3D5C` - Dark warm text

**Example: Change to teal**
```
#D4537E → #00897B (primary)
#FFD4D8 → #80CBC4 (accent)
#FEE4E1 → #E0F2F1 (background)
```

### Categories

In `categories` array, add your own:
```javascript
{ value: 'toys', label: 'Toys', emoji: '🧸' },
```

### WhatsApp Message

Customize pre-filled message:
```javascript
const message = `Hi! I found ${listing.name} on MamaMaps ZW. Do you have [item]?`;
```

## 💰 Revenue Model

### Phase 1: Featured Listings
- Store pays $5-15/month
- Appears at top of search results
- Gets "Featured" badge

### Phase 2: Affiliate Links
- 5-10% commission on sales referred via app
- Track with unique referral codes

### Phase 3: Ads
- Sponsored "Deals" section
- Promotional slots

## 📈 Growth Roadmap

- [x] Phase 1: Core directory + WhatsApp
- [ ] Phase 2: Ratings + Reviews
- [ ] Phase 3: Deals section
- [ ] Phase 4: Admin dashboard
- [ ] Phase 5: Payments (Stripe)
- [ ] Phase 6: Mom community features

## 🐛 Troubleshooting

**"No listings appear"**
- Check Sheet is public
- Verify `status="active"` in sheet
- Check API key is valid

**"WhatsApp doesn't open"**
- Phone number must be `+263774974660` format
- WhatsApp app must be installed on device

**"Ratings disappear after refresh"**
- Currently stored in component state (demo)
- Upgrade to Supabase/Firebase to persist

**"Sheet data is stale"**
- App fetches on page load
- Hard refresh browser (Cmd+Shift+R)

## 📦 Dependencies

- **react** - UI framework
- **react-dom** - React rendering
- **lucide-react** - Icons
- **vite** - Build tool (dev dependency)

## 📄 License

MIT - Use freely, just credit MamaMaps ZW

## 👩‍💻 Built for Moms

Designed with warmth, simplicity, and a focus on what moms actually need: **Fast answers when they're in a moment of need.**

---

**Need help?** Check DEPLOYMENT_GUIDE.md for detailed setup.

**Have ideas?** Create an issue or contribute!

🚀 Let's make baby shopping easier for moms in Zimbabwe.

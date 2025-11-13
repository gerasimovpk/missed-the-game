# Missed The Game

A mobile-first Progressive Web App (PWA) for watching football highlights without spoilers. Never miss the thrill of a match by experiencing replays as if they're live!

## Features

- 🚫 **Spoiler Protection**: Masks scores in titles, descriptions, and thumbnails
- 📱 **Mobile-First PWA**: Install on your phone for quick access
- ⚽ **Football Highlights**: Curated content from top European leagues
- 🔄 **Cross-Device Sync**: Favorites and preferences sync across devices
- 🎯 **Smart Ranking**: Featured matches and top-5 cross-league selection
- 💝 **Donation Support**: Support the project via Buy Me a Coffee
- 📊 **Analytics**: Privacy-focused usage tracking with GA4

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + Radix UI
- **Authentication**: Firebase Auth (email link + Google/Apple SSO)
- **Database**: Supabase (PostgreSQL with RLS)
- **Email**: Mailchimp integration
- **Analytics**: Google Analytics 4 with Consent Mode v2
- **PWA**: next-pwa with service worker
- **Proxy**: Cloudflare Worker for API access

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Firebase project
- Mailchimp account
- Google Analytics 4 property

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd missed-the-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Google Analytics 4
   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
   
   # Scorebat API (via Cloudflare Worker proxy)
   NEXT_PUBLIC_SCOREBAT_PROXY_URL=https://your-worker.workers.dev
   
   # Top competitions (JSON array)
   NEXT_PUBLIC_TOP_COMPETITIONS=["Premier League","UEFA Champions League","La Liga","Serie A","Bundesliga"]
   
   # Firebase Auth
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Mailchimp
   MAILCHIMP_API_KEY=your_mailchimp_api_key
   MAILCHIMP_SERVER_PREFIX=us10
   MAILCHIMP_AUDIENCE_ID=your_audience_id
   
   # Buy Me a Coffee
   NEXT_PUBLIC_BMAC_PROFILE=your_handle
   NEXT_PUBLIC_DONATION_RETURN_URL=https://yourdomain.com/thanks
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL migration from `src/lib/supabase-schema.sql`
   - Enable Row Level Security (RLS) policies

5. **Deploy Cloudflare Worker**
   ```bash
   cd cloudflare-worker
   npm install -g wrangler
   wrangler login
   wrangler publish
   ```
   Update `NEXT_PUBLIC_SCOREBAT_PROXY_URL` with your worker URL.

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── game/[id]/         # Individual video pages
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── thanks/            # Donation return handler
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── VideoItem.tsx     # Video card component
│   ├── VideoComponent.tsx # Video player with overlays
│   ├── SpoilerToggle.tsx # Spoiler protection toggle
│   ├── CookieBanner.tsx  # Consent management
│   └── InstallTooltip.tsx # PWA install prompts
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── supabase.ts       # Supabase client and helpers
│   ├── ga4.ts           # Analytics wrapper
│   ├── scoreMask.ts     # Spoiler masking utilities
│   └── mailchimp.ts     # Email list integration
├── redux/               # State management
│   ├── store.ts         # Redux store configuration
│   ├── slices/          # Redux slices
│   └── services/        # RTK Query services
└── hooks/               # Custom React hooks
```

## Key Features Implementation

### Spoiler Protection
- **Text Masking**: Regex patterns replace scores with ⚽ emojis
- **Thumbnail Blur**: CSS blur filter on images when spoilers are on
- **YouTube Overlays**: Black bars hide title and scrubber areas
- **Smooth Transitions**: CSS transitions for reveal/hide animations

### PWA Features
- **Manifest**: Complete PWA manifest with icons and shortcuts
- **Service Worker**: Caching strategy for static assets and API responses
- **Install Prompts**: iOS and Android-specific installation guidance
- **Offline Support**: Basic offline functionality (no video caching)

### Analytics & Privacy
- **Consent Mode v2**: GDPR-compliant analytics with user consent
- **Event Tracking**: Comprehensive GA4 event tracking for user behavior
- **Privacy-First**: Minimal data collection, user control over tracking

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Setup

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password, Google, Apple)
3. Get your Firebase config values
4. Set up Firebase Auth emulator for development

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL migration
3. Enable RLS policies
4. Get your project URL and anon key

### Mailchimp Setup
1. Create a Mailchimp account
2. Create an audience/list
3. Get your API key and audience ID
4. Set up marketing permissions

### Google Analytics 4
1. Create a GA4 property
2. Set up Consent Mode v2
3. Configure conversion events
4. Get your measurement ID

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@missedthegame.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/missed-the-game/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/missed-the-game/discussions)

## Roadmap

- [ ] Additional football leagues
- [ ] Push notifications for new highlights
- [ ] Social sharing features
- [ ] Advanced spoiler customization
- [ ] Mobile app (React Native)
- [ ] Offline video caching
- [ ] Multi-language support

---

**Made with ⚽ by football fans, for football fans.**
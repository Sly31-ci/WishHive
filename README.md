# WishHive - Make Wishes Real

WishHive is a social wishlist platform that connects users, sellers, and gift-givers in a fun, secure, and gamified experience. Create wishlists for any occasion, share them with loved ones, and discover amazing gifts from verified sellers.

## Vision

Become the reference social app for creating, sharing, and purchasing wishlists for birthdays, weddings, Christmas, births, celebrations, and more.

**Tagline**: "Wish. Share. Gift."

## Features

### Core Features
- Create and organize wishlists by event type
- Add products with photos, links, prices, and variations
- Share wishlists via links, QR codes, or social media
- **Cagnotte (Group Gifting)**: Collective funding for expensive gifts
- **Real-time Chat**: Dedicated chat rooms for circles and shared wishlists
- **SEO & Social Previews**: Rich OG meta-tags for beautiful social sharing
- Purchase verification system to prevent spoiling
- Anonymous viewing and messaging options
- **Live Interactions**: Real-time reactions and messages
- **Real-time Notifications**: Instant alerts for views and interactions
- Marketplace with seller integration
- Gamification with points, badges, and levels

### Gamification
- Earn points for creating wishlists, gifting, and social interactions
- Unlock badges for achievements
- Level up to access exclusive features
- Leaderboards for friendly competition

### Security & Privacy
- Row Level Security on all database tables
- Multiple privacy levels: public, private, code-only
- Anonymous interactions support
- Verified purchase system

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Analytics**: Mixpanel & Sentry
- **Haptics**: Expo Haptics Integration

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- Supabase account (free tier available)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database migrations:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of the migration files from the database setup
   - Execute the migrations in order

3. Copy your Supabase credentials:
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

### 4. Set Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the Development Server

```bash
npm run dev
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Scan QR code with Expo Go app on iOS/Android
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator

## Project Structure

```
project/
├── app/                    # App screens and navigation
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation screens
│   ├── wishlists/         # Wishlist management screens
│   └── _layout.tsx        # Root layout with auth routing
├── components/            # Reusable UI components
├── constants/             # Theme and constants
├── contexts/              # React contexts (Auth)
├── docs/                  # Project documentation and web assets
│   ├── project_history/   # Archivage des analyses et rapports
│   └── w/                 # Web viewer assets
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (Supabase client)
├── scripts/               # Utility scripts and migrations
├── supabase/              # Supabase configuration and SQL
├── types/                 # TypeScript type definitions
└── utils/                 # General utility functions
```

## Database Schema

The app uses the following main tables:

- **profiles**: User profiles with gamification data
- **wishlists**: User-created wish collections
- **wishlist_items**: Products in wishlists
- **products**: Marketplace product catalog
- **sellers**: Registered vendors
- **orders**: Purchase tracking
- **badges**: Achievement definitions
- **user_badges**: Earned achievements
- **reactions**: Social engagement
- **follows**: Social connections
- **transactions**: Points and rewards ledger

All tables have Row Level Security enabled to protect user data.

## Building for Production

### Web

```bash
npm run build:web
```

This creates an optimized build in the `dist/` directory.

### iOS (requires Mac)

1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform ios`

### Android

1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform android`

## Key Workflows

### User (Creator)
1. Sign up and complete onboarding
2. Create a wishlist with title, type, and privacy settings
3. Add products from marketplace or custom items
4. **Collaborate**: Chat with friends or set up a Group Gift (Cagnotte)
5. Share wishlist via link/QR code
6. Monitor views, reactions, and purchases with **Live Notifications**
7. Earn rewards and unlock badges

### Buyer
1. Find wishlist via shared link
2. Browse items and select gifts
3. Choose delivery options
4. Complete purchase with verification
5. Earn points and badges for gifting

### Seller
1. Register shop with KYC verification
2. Create product listings
3. Manage orders and confirm shipments
4. View analytics and conversion rates
5. Run promotions and boost products

## Color Palette

- **Primary**: #E69100 (HoneyGlow - Joy & CTA)
- **Secondary**: #6B44FF (HivePurple - Modern Identity)
- **Accent**: #00B37E (MintFresh - Trust & Success)
- **Dark**: #1E1C2E (CharcoalDeep)
- **Light**: #F7F8FA (CloudWhite)

## Contributing

This is a personal project. For major changes or feature requests, please open an issue first.

## License

Proprietary - All rights reserved

## Support

For questions or issues, please contact the development team.

---

**WishHive** - Making wishes come true, one gift at a time!

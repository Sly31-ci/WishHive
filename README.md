# WishHive - Make Wishes Real

WishHive is a social wishlist platform that connects users, sellers, and gift-givers in a fun, secure, and gamified experience. Create wishlists for any occasion, share them with loved ones, and discover amazing gifts from verified sellers.

## Vision

Become the reference social app for creating, sharing, and purchasing wishlists for birthdays, weddings, Christmas, births, celebrations, and more.

**Tagline**: "Wish. Share. Gift."

## ✨ Features

### Core Features
- **Wishlists**: Create and organize wishlists by event type (birthday, wedding, Christmas, etc.)
- **Product Management**: Add products with photos, links, prices, and variations
- **Smart Sharing**: Share wishlists via links, QR codes, or social media with rich previews
- **Cagnotte (Group Gifting)**: Collective funding for expensive gifts
- **Real-time Chat**: Dedicated chat rooms for wishlists with mentions and replies
- **Wishlist Interactions**: Comments and reactions on wishlists and items
- **Live Notifications**: Instant alerts for views, messages, mentions, and replies
- **Purchase Verification**: Prevent spoiling with proof-of-purchase system
- **Anonymous Mode**: View and message anonymously
- **Marketplace**: Discover products from verified sellers

### Social Features
- **Reactions**: Express yourself with emojis on wishlists and items
- **Comments**: Leave messages and feedback on wishlists
- **Follows**: Follow friends and favorite sellers
- **Referral System**: Invite friends and earn rewards
- **Chat Messages**: Direct messaging with mentions and threading

### Gamification
- **Points System**: Earn points for creating wishlists, gifting, and social interactions
- **Badges**: Unlock achievements (Starter, Gifter, Social Butterfly, Seller Pro, Trendsetter)
- **Levels**: Progress through levels to access exclusive features
- **Transactions**: Track your points history and rewards

### Security & Privacy
- **Row Level Security**: All database tables protected with RLS policies
- **Privacy Levels**: Public, private, or code-only wishlists
- **Anonymous Support**: Browse and interact without revealing identity
- **Verified Purchases**: OCR and admin review for purchase verification

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase Local (PostgreSQL + Auth + Realtime + Storage)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Analytics**: Mixpanel & Sentry
- **Haptics**: Expo Haptics Integration

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Docker Desktop installed (for Supabase Local)
- Expo CLI installed (`npm install -g expo-cli`)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd WishHive
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase Local

#### Start Supabase Local
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose up -d
```

#### Import Database Schema
```bash
cd ~/Téléchargements/WishHive
./scripts/import-schema.sh
```

This will create all 18 tables:
- profiles, badges, public_themes
- sellers, products
- wishlists, wishlist_items, wishlist_interactions
- orders, purchase_verifications
- follows, reactions
- transactions, user_badges, referrals
- notifications, chat_messages, chat_reactions

#### Access Supabase Studio
Open http://localhost:3000 in your browser to manage your local database.

### 4. Set Environment Variables

Your `.env` file should already be configured for local development:

```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_DEV_MODE=true
```

### 5. Start the Development Server

The easiest way to start the project (Database + App) is to use the automated script:

```bash
./start-dev.sh
```

This script will:
1. Start Supabase Local (Docker) if it's not running
2. Display access URLs for Supabase Studio
3. Start the Expo development server

Alternatively, you can run them manually:
```bash
npm run dev
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Scan QR code with Expo Go app on iOS/Android
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator

## 📁 Project Structure

```
WishHive/
├── app/                    # App screens and navigation
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation screens
│   ├── wishlists/         # Wishlist management screens
│   └── _layout.tsx        # Root layout with auth routing
├── components/            # Reusable UI components
├── constants/             # Theme and constants
├── contexts/              # React contexts (Auth)
├── docs/                  # Project documentation
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (Supabase client, services)
├── scripts/               # Migration and utility scripts
│   ├── import-schema.sh           # Import database schema
│   ├── migrate-supabase-data.js   # Migrate data from Cloud to Local
│   └── fix-constraints-triggers.sql # Database fixes
├── schema_*.sql           # Database schema files
├── types/                 # TypeScript type definitions
└── utils/                 # General utility functions
```

## 🗄 Database Schema

The app uses 18 main tables organized by feature:

### Core Tables
- **profiles**: User profiles with gamification data (points, level, referral codes)
- **badges**: Achievement definitions (Starter, Gifter, Social Butterfly, etc.)
- **public_themes**: Shared wishlist themes

### Marketplace
- **sellers**: Registered vendors with KYC verification
- **products**: Product catalog with images, prices, and variations

### Wishlists
- **wishlists**: User-created wish collections with privacy settings
- **wishlist_items**: Products in wishlists (marketplace or custom)
- **wishlist_interactions**: Comments and reactions on wishlists

### Orders
- **orders**: Purchase tracking with delivery options
- **purchase_verifications**: Proof-of-purchase with OCR support

### Social Features
- **follows**: User and seller connections
- **reactions**: Emoji reactions on wishlists and products

### Gamification
- **transactions**: Points history and rewards ledger
- **user_badges**: Earned achievements
- **referrals**: Referral system tracking

### Communication
- **notifications**: Real-time alerts for views, messages, mentions
- **chat_messages**: Direct and group messages with mentions
- **chat_reactions**: Emoji reactions to messages

All tables have **Row Level Security** enabled to protect user data.

## 🔧 Database Management

### View Local Database
```bash
# Access Supabase Studio
open http://localhost:3000

# Or connect via psql
psql postgresql://postgres:bDeXdxrmmJ+18a8qzVmZ2YEBDV1ioAGL@localhost:5432/postgres
```

### Restore Triggers (After Migration)
```bash
cat schema_functions.sql | docker exec -i supabase-db psql -U postgres -d postgres
```

### Test Connection
```bash
node test-supabase.js
```

## 📦 Building for Production

### Web
```bash
npm run build:web
```

### iOS (requires Mac)
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform ios`

### Android
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform android`

## 🎯 Key Workflows

### User (Creator)
1. Sign up and complete onboarding
2. Create a wishlist with title, type, and privacy settings
3. Add products from marketplace or custom items
4. **Collaborate**: Chat with friends or set up a Group Gift (Cagnotte)
5. Share wishlist via link/QR code with rich social previews
6. Monitor views, reactions, and purchases with **Live Notifications**
7. Respond to comments and messages with mentions
8. Earn rewards and unlock badges

### Buyer
1. Find wishlist via shared link or QR code
2. Browse items and react with emojis
3. Leave comments and questions
4. Select gifts and choose delivery options
5. Complete purchase with verification
6. Earn points and badges for gifting

### Seller
1. Register shop with KYC verification
2. Create product listings with images and variations
3. Manage orders and confirm shipments
4. Verify purchases and provide support
5. View analytics and conversion rates
6. Run promotions and boost products

## 🎨 Color Palette

- **Primary**: #E69100 (HoneyGlow - Joy & CTA)
- **Secondary**: #6B44FF (HivePurple - Modern Identity)
- **Accent**: #00B37E (MintFresh - Trust & Success)
- **Dark**: #1E1C2E (CharcoalDeep)
- **Light**: #F7F8FA (CloudWhite)

## 📚 Documentation

- **Migration Guide**: `GUIDE_MIGRATION_CLOUD_TO_LOCAL.md`
- **Supabase Setup**: `SUPABASE_LOCAL_SETUP.md`
- **Quick Start**: `QUICKSTART_SUPABASE.md`
- **Architecture**: `ARCHITECTURE.md`
- **Roadmap**: `ROADMAP.md`

## 🤝 Contributing

This is a personal project. For major changes or feature requests, please open an issue first.

## 📄 License

Proprietary - All rights reserved

## 💬 Support

For questions or issues, please contact the development team.

---

**WishHive** - Making wishes come true, one gift at a time! 🎁✨

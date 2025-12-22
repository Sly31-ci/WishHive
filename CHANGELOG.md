# Changelog

All notable changes to WishHive will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0-beta] - 2025-12-22

### Added
- **Social V2**: Real-time Chat integration for Friend Circles and Collaborative Wishlists.
- **Group Gifting (Cagnotte)**: Collective funding system with progress tracking.
- **SEO & Social**: Rich OpenGraph meta-tags and dynamic deep linking (`wishhive://`).
- **Offline Mode**: Basic data caching for wishlists and profiles.
- **Engagement**: Real-time Notification system and Activity History for collaborative lists.
- **Analytics**: Mixpanel and Sentry integration for monitoring and tracking.
- **UI/UX**: Staggered entrance animations, haptic feedback foundation, and skeleton loaders.

### Fixed
- Authentication profile creation trigger issues.
- Responsive layout fixes for marketplace and public views.
- Contrast compliance for "HoneyGlow" brand color (HoneyGlow is now darker).
- Image rendering performance using hardware-accelerated `expo-image`.

### Database
- New tables: `group_gifts`, `gift_contributions`, `chat_rooms`, `chat_messages`, `notifications`, `friend_circles`, `circle_members`, `collaborative_wishlists`, `wishlist_activities`.

## [Unreleased]

### Added
- Initial project structure with Expo and React Native
- Complete database schema with 12 tables
- Row Level Security policies for all tables
- Authentication system with Supabase
- Core components: WishlistCard, ProductCard, Badge, Button, Card, Input
- Custom hooks: useWishlists, useProducts, useGamification
- Utility functions for formatting, validation, and calculations
- Haptic feedback system
- Wishlist sharing functionality
- Complete design system with colors, typography, and spacing
- TypeScript types for database
- Comprehensive documentation (README, GUIDE_DEMARRAGE, ARCHITECTURE, CONTRIBUTING)

### Database
- profiles table with gamification support
- wishlists table with privacy levels
- wishlist_items table for products
- products table for marketplace
- sellers table with KYC verification
- orders table with purchase tracking
- purchase_verifications table
- badges and user_badges for achievements
- reactions for social engagement
- follows for social connections
- transactions for points ledger
- Starter badges seeded

### Components
- WishlistCard: Display wishlist with stats
- ProductCard: Marketplace product display
- Badge: Achievement display with tiers
- Button: Reusable button component
- Card: Container component
- Input: Form input component

### Hooks
- useWishlists: CRUD operations for wishlists
- useProducts: Fetch and search products
- useGamification: Points, badges, and transactions management

### Utilities
- formatCurrency: Currency formatting
- formatDate: Date formatting
- generateAccessCode: Random code generation
- calculateLevel: Level calculation from points
- Haptic feedback functions
- Wishlist sharing functions

## [1.0.0] - TBD

### Planned
- First stable release
- App Store and Google Play deployment
- Production Supabase configuration
- Analytics integration
- Push notifications
- In-app payments

---

[Unreleased]: https://github.com/yourusername/wishhive/compare/v1.1.0-beta...HEAD
[1.1.0-beta]: https://github.com/yourusername/wishhive/releases/tag/v1.1.0-beta
[1.0.0]: https://github.com/yourusername/wishhive/releases/tag/v1.0.0

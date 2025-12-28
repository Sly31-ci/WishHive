# Changelog

All notable changes to WishHive will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-01-28

### Added
- **Web Viewer (Public Sharing)**: Static web viewer hosted on GitHub Pages for public wishlist sharing.
- **Universal & App Links**: Cross-platform deep linking enabled for `https://Sly31-ci.github.io/WishHive/w/`.
- **Custom Event Types**: Fully customizable event types with Emoji + Label picker.
- **Privacy "Code Only"**: New privacy layer requiring a specific code to access a wishlist.
- **QR Code Sharing**: Dynamic QR code generation for quick physical sharing.

### Fixed
- **Mobile Input UX**: Complete refactor of the "Create Wishlist" form using native UI components. Fixed keyboard closing/focus issues.
- **Project Structure**: Cleaned up root directory, archived history, and centralized scripts in `/scripts`.

### Changed
- Refactored `lib/shareWishlist.ts` to use GitHub Pages URLs as the primary sharing method.
- Updated `app.json` for proper associated domains (iOS) and intent filters (Android).

## [1.1.0-beta] - 2024-12-22

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

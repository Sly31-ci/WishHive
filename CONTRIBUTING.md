# Contributing to WishHive

Thank you for your interest in contributing to WishHive! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/wishhive.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push and create a Pull Request

## Development Setup

See [README.md](./README.md) for detailed setup instructions using Docker.

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define interfaces for all props and data structures
- Avoid `any` types when possible
- Use meaningful variable names

### React Native
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

### Naming Conventions
- Components: PascalCase (e.g., `WishlistCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useWishlists.ts`)
- Utilities: camelCase (e.g., `formatCurrency`)
- Constants: UPPER_SNAKE_CASE

### File Organization
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.styles.ts (if needed)
└── index.ts (re-export)
```

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add wishlist sharing via QR code`

## Pull Request Process

1. Update README.md if needed
2. Update documentation
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test on both iOS and Android
- Test on web if applicable

## Database Changes

If modifying the database schema:
1. Identify the relevant module in `database/schema/` (e.g., `schema_core.sql`)
2. Add your changes ensuring idempotency (`IF NOT EXISTS`, `CREATE OR REPLACE`)
3. Document any new RLS policies
4. Update TypeScript types in `types/database.ts`
5. Document changes in ARCHITECTURE.md

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

---

Thank you for contributing to WishHive! 🎁

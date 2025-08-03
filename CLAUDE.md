# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Essential Development Scripts:**
- `npm run dev` - Start Next.js development server on localhost:3000
- `npm run build` - Build production application 
- `npm run lint` - Run ESLint with Next.js TypeScript config
- `npm test` - Run Vitest test suite with jsdom environment

**Database Management:**
- `npm run db:seed` - Populate database with realistic test data (25 students, 8 tests, homework records, grammar errors)
- `npm run db:clear` - Wipe all data from database tables (development only)

**Internationalization:**
- `npm run i18n:extract` - Extract i18n keys from TypeScript/TSX files to locale JSON files

**Testing:**
- Tests use Vitest with jsdom environment
- Test files use `.test.ts` or `.test.tsx` extension
- Alias `@/` resolves to `src/` directory

## Architecture Overview

**Technology Stack:**
- Next.js 15 with TypeScript and App Router
- SQLite database with better-sqlite3 (local-first design)
- Radix UI + shadcn/ui components with Tailwind CSS
- React Hook Form with Zod validation
- i18next for internationalization (English/Chinese)

**Database Architecture:**
The SQLite database (`chinaprof.db`) uses a comprehensive schema supporting:
- **Students & Classes**: Student management with class associations
- **Subjects & Lesson Plans**: Subject organization with structured lesson planning
- **Assessment Tracking**: Homework completion, weekly tests, exams, essay feedback
- **Grammar Error Logging**: CN-ESL specific error code tracking
- **Comments System**: Rich-text feedback with evidence tracking

Key database patterns:
- Singleton database connection via `src/lib/db/database.ts`
- Schema-first design with `src/lib/db/schema.sql`
- Built-in migration system for schema updates
- Comprehensive foreign key relationships with cascading deletes

**Project Structure:**
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard page
│   ├── students/          # Student management
│   ├── subjects/          # Subject/lesson planning
│   ├── homework/          # Homework tracking
│   ├── weekly-tests/      # Test management
│   ├── grammar-errors/    # Error logging
│   ├── comments/          # Feedback system
│   └── reports/           # Progress reports
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # App layout components
│   └── features/         # Feature-specific components
├── lib/
│   ├── db/              # Database layer (database.ts, queries.ts, schema.sql)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
└── hooks/               # Custom React hooks
```

**Component Architecture:**
- Uses AppLayout wrapper with sidebar navigation
- Feature-based component organization
- Consistent design system with custom CSS variables
- Form validation with react-hook-form + Zod schemas

**Data Flow:**
- Database queries centralized in `src/lib/db/queries.ts`
- Server-side data fetching in page components
- Client-side state management with React hooks
- Form submissions use server actions

## Key Development Patterns

**Database Operations:**
- Always use the singleton `getDatabase()` function
- SQL queries are prepared statements for performance
- Use transactions for multi-table operations
- Foreign key constraints are enabled

**UI Development:**
- Follow existing shadcn/ui component patterns
- Use Tailwind CSS with custom design tokens
- Implement responsive design with mobile-first approach
- Maintain consistent 4/8pt spacing grid

**Form Handling:**
- Use react-hook-form with Zod validation schemas
- Implement proper error states and loading indicators
- Follow accessibility best practices for form controls

**Testing:**
- Write unit tests for database queries and utilities
- Use Testing Library for component testing
- Mock database connections in tests

**Phase 1 Constraints:**
- Local-only application (no authentication yet)
- Single-user desktop experience
- SQLite database stored in project root
- No external API dependencies

## Code Quality Standards

- ESLint configuration extends Next.js TypeScript rules
- Prettier formatting with consistent code style
- Husky pre-commit hooks for code quality
- TypeScript strict mode enabled
- Component and function documentation for complex logic
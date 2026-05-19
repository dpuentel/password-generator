# AGENTS.md

## Project Overview

Password Generator — an Astro + React static site with TailwindCSS. Generates cryptographically secure passwords using `window.crypto.getRandomValues()`.

## Tech Stack

- **Astro 6.3** — Static site generator
- **React 19** — Interactive UI components
- **TailwindCSS 4** — Styling (via `@tailwindcss/vite`, CSS-first config)
- **Vitest 4 + Testing Library** — Testing
- **ESLint 10** — Linting (flat config via `neostandard`)
- **Prettier 3** — Code formatting

## Code Style

- **neostandard** — JavaScript style guide (flat config, ESLint 10 compatible).
- **Prettier** — Code formatting. Run `pnpm run format` before committing.
- **Tabs** for indentation, **single quotes**, **semicolons omitted**.
- No comments unless explicitly requested.

## Git Workflow

- **Always create a new branch** for any modification. Never commit directly to `main`.
- Branch naming convention: `<type>/<short-description>` (e.g., `fix/shuffle-bias`, `feat/lowercase-toggle`, `test/add-entropy-tests`).
- **Conventional Commits** — All commit messages must follow the format:
  ```
  <type>(<scope>): <description>
  ```
  Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  Examples:
  - `fix(security): replace biased shuffle with Fisher-Yates`
  - `test: add vitest test suite for useGeneratePassword hook`
- **All code and commit messages in English.**

## Testing

- **Always run tests** after making any code changes: `pnpm test`
- Run with coverage to verify no regressions: `pnpm test:coverage`
- Target: **~100% line/statement coverage**.
- Test files live in `src/__tests__/` with `.test.js` or `.test.jsx` extension.
- Mock `window.crypto` and `navigator.clipboard` in `src/__tests__/setup.js`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm run format` | Format code with Prettier |
| `pnpm run lint:eslint` | Lint with ESLint |
| `pnpm run lint:eslint:fix` | Auto-fix ESLint issues |

## Project Structure

```
src/
├── components/       # React and Astro UI components
├── hooks/            # React custom hooks (useGeneratePassword)
├── layouts/          # Astro page layouts
├── pages/            # Astro pages (routing)
├── services/         # Shared constants (Patterns.js)
└── __tests__/        # Vitest test files
```

## Security Notes

- Password generation uses `crypto.getRandomValues()` — never replace with `Math.random()`.
- Shuffle must use **Fisher-Yates** algorithm — never `Array.sort()` with random comparator.
- Character selection must use **direct charset indexing** — never rejection sampling with regex.

## Available Skills

The following skills are installed in `.agents/skills/` and should be consulted when working on related tasks:

| Skill | When to use |
|-------|-------------|
| **react-best-practices** | Any React component changes (hooks, rendering, memoization, effects) |
| **vitest** | Writing or modifying tests, coverage setup, mocking strategies |
| **tailwind-css-patterns** | Styling changes, responsive design, animations, accessibility in CSS |
| **accessibility** | ARIA attributes, keyboard navigation, WCAG compliance |
| **astro** | Astro-specific patterns (islands, hydration directives, SSR/SSG) |
| **seo** | Meta tags, semantic HTML, performance optimization |
| **frontend-design** | UI/UX improvements and visual design decisions |
| **typescript-advanced-types** | If migrating to TypeScript or adding type definitions |
| **composition-patterns** | Component composition and prop patterns |
| **nodejs-best-practices** | Node.js patterns for build scripts and tooling |
| **nodejs-backend-patterns** | Only if adding server-side functionality |

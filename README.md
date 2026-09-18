# Gastos at Grasya

A personal finance tracker for logging income and expenses, keeping recurring bills on autopilot, tracking budgets, and reviewing everything through monthly, annual, and all-time reports — installable as a PWA, with an AI assistant for asking questions about your own data.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Prisma](https://www.prisma.io) + PostgreSQL, via the [Neon](https://neon.tech) serverless driver
- [Auth.js (NextAuth v5)](https://authjs.dev) — Google OAuth and email/password credentials
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives)
- [react-hook-form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms and validation
- [Recharts](https://recharts.org) for dashboard charts
- [Resend](https://resend.com) + [React Email](https://react.email) for verification emails
- [OpenAI API](https://platform.openai.com) for the "Ask AI" finance chat assistant
- [Vitest](https://vitest.dev) for unit tests
- Vercel Cron for daily recurring-transaction generation, PWA (manifest + service worker)

## Features

- Email/password sign-up with email verification, or Google sign-in
- Transaction CRUD: type (income/expense), category, subcategory, payment method, credit card type, amount, description, date
- **Manage page** — fully editable, per-user catalogs (create/edit/delete) for Categories, Sub Categories, Payment Methods, and Credit Card Types, each with an icon picker
- **Recurring transactions** — set up a monthly bill/subscription by day-of-month; a daily Vercel Cron job generates the actual transaction on its due date (or immediately, if created on its due day)
- **Budget limits** — set an optional monthly spending cap per expense category, with color-coded progress on the Dashboard
- **Budget rule split** — adjustable Reward/Budget/Savings percentage breakdown of net income, shown on the Transactions page
- Inline editing of type/category/subcategory/payment method/credit card type directly from the Monthly Reports table
- Search and filter on the Transactions page (by text, type, or category)
- **Ask AI** — a chat assistant (OpenAI) that answers questions about your own income, expenses, and budgets; Q&A only, it never creates or edits transactions
- Installable as a PWA (add to home screen on iOS/Android/desktop)
- Dashboard with an income vs. expense chart, budget status, and recent transactions
- Light/dark theme toggle
- Reports:
  - **Monthly** — breakdown by category, subcategory, payment method, and credit card type
  - **Annual** — month-by-month table for a selected year
  - **All Reports** — year-over-year totals and net income

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (this project is built around [Neon](https://neon.tech))

### 1. Install dependencies

```bash
npm install
```

This also runs `prisma generate` via the `postinstall` script.

### 2. Configure environment variables

Create a `.env` file in the project root:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon) |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign Auth.js session JWTs |
| `NEXTAUTH_URL` | Yes in production | Base app URL Auth.js uses to build redirect URLs (e.g. `https://your-domain.com`) — **must not be left as `localhost` in a deployed environment**, or sign-in will redirect back to localhost |
| `NEXTAUTH_URL_INTERNAL` | No | Overrides the URL used for server-to-server Auth.js calls, if different from `NEXTAUTH_URL` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `RESEND_API_KEY` | Yes | Resend API key, used to send verification emails |
| `CRON_SECRET` | Yes | Bearer token the Vercel Cron job uses to authenticate against `/api/cron/recurring-transactions` |
| `OPENAI_API_KEY` | No | Enables the "Ask AI" chat assistant; the feature is skipped if unset |
| `NEXT_PUBLIC_SERVER_URL` | No | Base app URL used in redirects and verification links (defaults to `http://localhost:3000`) — this is inlined at **build time**, so redeploy after changing it |
| `SENDER_EMAIL` | No | "From" address for verification emails (defaults to `onboarding@resend.dev`) |
| `NEXT_PUBLIC_APP_NAME` | No | Overrides the app name shown in the UI and emails |
| `NEXT_PUBLIC_APP_DESCRIPTION` | No | Overrides the app description used in metadata |

### 3. Set up the database

```bash
npx prisma migrate deploy
```

Migrations in this project are hand-written SQL (not generated via `prisma migrate dev`) — see `prisma/migrations/`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest unit test suite |

## Project Structure

```
app/
  (auth)/        Sign-in / sign-up
  (root)/        Public landing page
  (user)/        Authenticated app: dashboard, transactions, recurring,
                 categories (Manage), monthly/annual/all reports, assistant,
                 profile
  api/           NextAuth handler, transactions-by-period endpoint,
                 recurring-transaction cron, AI chat endpoint
  manifest.ts    PWA manifest
components/      Shared UI components (shadcn primitives, forms, sidebar, header)
lib/
  actions/       Server actions (transactions, recurring transactions,
                 categories, transaction options, users)
  data/          Prisma data-access functions
  validators/    Zod schemas
  utils/         Date/format/icon helpers, report aggregation logic,
                 recurrence math, AI chat context builder
  cron/          Recurring-transaction generation logic (used by the cron route)
  constants/     Default category lists, transaction type options
db/              Prisma client setup, seed scripts
prisma/          Schema and migrations
emails/          React Email templates + send helper
public/
  sw.js          PWA service worker (static-asset caching only)
  icons/         PWA icons
```

## Notes

- Unit tests (Vitest) cover the pure aggregation/date/recurrence helpers in `lib/utils/*.test.ts`; there's no end-to-end/integration test suite.
- The Auth.js Prisma adapter is not wired in; account linkage for verified email/password users is created manually in `lib/actions/user.actions.ts`.
- `middleware.ts` builds its NextAuth instance from `auth.config.ts` only (Google provider), not `auth.ts` (which adds Credentials/bcrypt/Prisma) — keeps the Edge Function bundle under Vercel's size limit.
- The "Ask AI" assistant sends a compact, per-request summary of your data (monthly aggregates for history, full detail for the current month) to OpenAI — see `lib/utils/chatContext.ts`. It's Q&A only; there's no tool-calling that would let it write to your transactions.

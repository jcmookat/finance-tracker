# Gastos at Grasya

A personal finance tracker for logging income and expenses and reviewing them through monthly, annual, and all-time reports.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Prisma](https://www.prisma.io) + PostgreSQL, via the [Neon](https://neon.tech) serverless driver
- [Auth.js (NextAuth v5)](https://authjs.dev) — Google OAuth and email/password credentials
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives)
- [react-hook-form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms and validation
- [Recharts](https://recharts.org) for dashboard charts
- [Resend](https://resend.com) + [React Email](https://react.email) for verification emails

## Features

- Email/password sign-up with email verification, or Google sign-in
- Transaction CRUD: type (income/expense), category, subcategory, payment method, credit card type, amount, description, date
- User-defined categories with icon picker
- Dashboard with an income vs. expense chart and recent transactions
- Reports:
  - **Monthly** — breakdown by category, subcategory, payment method, and credit card type
  - **Annual** — month-by-month table for a selected year
  - **All Reports** — year-over-year totals, net income, and 10/40/50 budget-rule percentages

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
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `RESEND_API_KEY` | Yes | Resend API key, used to send verification emails |
| `NEXT_PUBLIC_SERVER_URL` | No | Base app URL used in redirects and verification links (defaults to `http://localhost:3000`) |
| `SENDER_EMAIL` | No | "From" address for verification emails (defaults to `onboarding@resend.dev`) |
| `NEXT_PUBLIC_APP_NAME` | No | Overrides the app name shown in the UI and emails |
| `NEXT_PUBLIC_APP_DESCRIPTION` | No | Overrides the app description used in metadata |

### 3. Set up the database

```bash
npx prisma migrate deploy
```

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

## Project Structure

```
app/
  (auth)/        Sign-in / sign-up
  (root)/        Public landing page
  (user)/        Authenticated app: dashboard, transactions, categories,
                 monthly/annual/all reports, profile, settings
  api/           NextAuth handler + transactions-by-period endpoint
components/      Shared UI components (shadcn primitives, forms, sidebar, header)
lib/
  actions/       Server actions (transactions, categories, users)
  data/          Prisma data-access functions
  validators/    Zod schemas
  utils/         Date/format helpers and report aggregation logic
  constants/     Category lists, payment methods, icon map
db/              Prisma client setup, seed scripts
prisma/          Schema and migrations
emails/          React Email templates + send helper
```

## Notes

- No automated test suite is set up yet.
- The Auth.js Prisma adapter is not wired in; account linkage for verified email/password users is created manually in `lib/actions/user.actions.ts`.

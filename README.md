# TechSaws Billing

Production-grade invoice generator built with Next.js App Router, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Zod, React Hook Form, and Server Actions.

## Setup

1. Copy `.env.example` to `.env.local` or use the included `.env.local`, then set `DATABASE_URL` and `DIRECT_URL`.
2. Install dependencies:

```bash
npm install
```

3. Generate the Prisma client:

```bash
npm run prisma:generate
```

4. Run migrations against your PostgreSQL database:

```bash
npm run prisma:migrate
```

5. Start the app:

```bash
npm run dev
```

## Business Rules Implemented

## Neon Notes

- Use the pooled Neon connection string for `DATABASE_URL`.
- Use the direct Neon connection string for `DIRECT_URL`.
- Prisma migrations should use the direct URL.
- In Vercel, set the same real Neon values in Project Settings > Environment Variables for Production, Preview, and Development. Do not deploy placeholder hosts such as `EP-POOLER-HOST`, `YOUR-NEON-POOLER-HOST`, or `DB_NAME`.

- Invoice generation is transaction-safe and locks totals by moving drafts to `GENERATED`.
- Draft development invoices use manually entered line items.

## Key Paths

- `prisma/schema.prisma`: normalized relational schema
- `lib/calculations.ts`: reusable financial calculations
- `lib/actions.ts`: server-side mutations and invoice generation flow
- `app/dashboard/clients`: client management UI
- `app/dashboard/invoices`: invoice creation, filtering, and detail views

# KARGAHYAR Architecture

KARGAHYAR is a mobile-first field operations product for Iranian contractors and site managers.

## Clients

- Mobile: Expo Router / React Native / TypeScript.
- Public web: Next.js App Router on Vercel.
- Public web is marketing + SEO + download; it is not the primary field app.

## Backend

- Supabase Auth.
- PostgreSQL.
- Row Level Security.
- Atomic RPCs for money/work operations.
- Storage/Edge Functions reserved for future attachments and server-side workflows.

## Mobile data strategy

Core field operations are queued locally in SQLite.

Each queued operation stores:
- operation kind
- full structured payload
- local idempotency key
- creation time
- retry count
- last error

Once connectivity is restored, the exact operation is sent to an atomic Supabase RPC. This prevents partial writes and duplicate financial records.

## Product model

User
→ Projects
→ Workers / Contractors / Materials
→ Daily Reports
→ Entries / Expenses / Payments
→ Dashboard / Alerts

## Iranian adaptations

- Persian RTL UI.
- Toman as the default display currency.
- Persian digit formatting.
- Tehran/Iran local date handling.
- Friday treated as the default non-working day in future scheduling rules.
- Direct Android distribution path.
- Low-connectivity/offline-first workflows.
- Simple mobile interactions instead of ERP-style forms.

## Design reference patterns

The product borrows proven interaction patterns from mature construction applications:
- project-first context
- mobile daily logs
- time/work logs
- attachments-ready daily-report architecture
- offline entry + automatic sync
- real-time project summaries

These patterns are adapted to the smaller Iranian contractor rather than copied wholesale.

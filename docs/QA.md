# QA Status

## Verified

- Production Supabase project is ACTIVE_HEALTHY.
- Supabase migrations applied through payment ledger.
- Security Advisor currently reports 0 security lints.
- RLS is enabled on exposed public tables.
- Structured offline operation queue is implemented.
- Atomic worker, contractor, expense, material, and payment RPCs exist.
- Project context is explicit for project-scoped screens.
- Web CI and Mobile CI workflows exist.

## CI

Web CI previously failed at setup-node because npm caching was enabled without a lockfile. The cache dependency was removed.

The latest push starts new Web CI and Mobile CI runs.

## Still environment-dependent

- Android EAS build requires EXPO_TOKEN.
- Vercel production deployment requires a Vercel project linked to the repository/team.
- Physical-device biometric testing requires a native Android/iOS build.
- Offline sync needs physical-device testing with connectivity toggled.

## Release gate

Do not publish a public APK or claim Production-ready until:
1. Web CI passes.
2. Mobile CI passes.
3. A real Android preview APK installs successfully.
4. The APK can sign in, create a project, create worker/contractor records, and submit a daily report online.
5. The same report path succeeds offline and syncs after reconnect.
6. Vercel serves the marketing site and /download route.

# KARGAHYAR Setup

## Supabase

Production project:
- Name: KARGAHYAR
- Ref: gnbzallogjcnvihbijkd
- Region: ap-south-1
- Status: ACTIVE_HEALTHY

Required mobile environment variables:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Publishable keys are safe for client use when RLS is correctly configured; never expose a secret/service-role key in the mobile or web client.

Apply the migrations in supabase/migrations in order when provisioning a fresh environment.

## Vercel

The website is the Next.js app under apps/web. Set NEXT_PUBLIC_ANDROID_DOWNLOAD_URL only after a real signed APK is published.

## Android

GitHub Actions workflow: .github/workflows/android-build.yml.

Required GitHub repository secret:
- EXPO_TOKEN

Use the EAS preview profile for direct APK testing and the production profile for store AABs.

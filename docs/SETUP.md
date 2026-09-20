# KARGAHYAR Setup

## Supabase
The connected Supabase account currently exposes project `bmyngmmvnytedotwzcxg`, region `eu-central-1`, but its status is INACTIVE. Do not use its credentials in source control.

Required mobile environment variables:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

After activating/creating the production Supabase project, apply migrations from `supabase/migrations` and add the variables to the mobile build environment.

## Vercel
Import the repository as a Next.js project. Set `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL` only after a real signed APK is published.

## Android
Set GitHub repository secret `EXPO_TOKEN`, then run the Android workflow manually. For production distribution use an EAS production profile and signed artifact; preview builds are for testing only.
# KARGAHYAR Release

## Android

- Preview APK: EAS profile `preview` / internal distribution.
- Store artifact: EAS profile `production` / AAB.
- GitHub Actions workflow: `.github/workflows/android-build.yml`.

## Web

- Next.js application: `apps/web`
- Production host target: `https://kargahyar.ir`
- Download route: `/download`

## Download URL

Configure `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL` on Vercel only after a real signed APK is published.

The website intentionally does not expose a fake or nonexistent APK link.

## Required external credential

GitHub Actions needs `EXPO_TOKEN` as a repository secret before an Android build can run non-interactively.

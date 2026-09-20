# KARGAHYAR Release

## Android
- Preview APK: EAS profile `preview` / internal distribution.
- Store artifact: EAS profile `production` / AAB.
- GitHub Actions workflow: `.github/workflows/android-build.yml`.

## Download URL
Configure `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL` on Vercel to the final public APK URL. The website intentionally does not expose a fake/nonexistent APK link.

## Required secret
GitHub Actions needs `EXPO_TOKEN` as a repository secret before an Android build can run non-interactively.
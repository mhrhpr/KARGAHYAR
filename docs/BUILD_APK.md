# KARGAHYAR — Windows Android APK Build

Required software

1. Node.js 22.x LTS. Expo SDK 57 requires Node.js 22.13.x or newer.
2. Android Studio with Android SDK and Platform Tools.
3. JDK 17.

Build

Open PowerShell in the repository root:

Set-ExecutionPolicy -Scope Process Bypass
.\BUILD_APK_WINDOWS.ps1

The script installs the mobile workspace, runs Expo Doctor, regenerates Android with a clean prebuild, and builds:

apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk

Install on a connected Android phone

Enable Developer Options and USB Debugging, connect the phone by USB, then:

adb devices
adb install -r ".\apps\mobile\android\app\build\outputs\apk\debug\app-debug.apk"

Alternative: EAS

cd apps\mobile
$env:EXPO_TOKEN="YOUR_EXPO_TOKEN"
npx eas-cli@latest build --platform android --profile preview

The preview profile is configured to produce an APK.

Important: do not run npm audit fix --force just to silence vulnerabilities. Stabilize the build first.
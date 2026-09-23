$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Write-Host "=== KARGAHYAR Android APK Build ===" -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js is not installed." }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw "npm is not installed." }
if (-not (Get-Command java -ErrorAction SilentlyContinue)) { throw "Java/JDK is not installed." }
node --version
npm --version
java -version
$mobile = Join-Path $PSScriptRoot "apps\mobile"
if (-not (Test-Path $mobile)) { throw "apps/mobile not found. Run this script from the repository." }
Set-Location $mobile
Write-Host "Installing mobile dependencies..." -ForegroundColor Yellow
npm install --workspaces=false
Write-Host "Checking Expo project..." -ForegroundColor Yellow
npx expo-doctor
Write-Host "Regenerating Android project..." -ForegroundColor Yellow
npx expo prebuild --platform android --clean --non-interactive
Write-Host "Building standalone debug APK..." -ForegroundColor Yellow
Set-Location (Join-Path $mobile "android")
if (-not (Test-Path ".\gradlew.bat")) { throw "gradlew.bat not found after Expo prebuild." }
& .\gradlew.bat assembleDebug --no-daemon --no-parallel --max-workers=2 --stacktrace --console=plain
$apk = Join-Path $mobile "android\app\build\outputs\apk\debug\app-debug.apk"
if (-not (Test-Path $apk)) { throw "APK was not produced." }
Write-Host "APK READY:" -ForegroundColor Green
Write-Host $apk -ForegroundColor Green
Write-Host "Install with: adb install -r <apk-path>" -ForegroundColor Cyan
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/mhrhpr/KARGAHYAR/releases/latest",
      {
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json", "User-Agent": "KARGAHYAR-Website" },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: "APK_NOT_AVAILABLE" }, { status: 404 });
    }

    const release = await response.json();
    const asset = Array.isArray(release.assets)
      ? release.assets.find((item: { name?: string; browser_download_url?: string }) =>
          item.name?.toLowerCase().endsWith(".apk"),
        )
      : null;

    if (!asset?.browser_download_url) {
      return NextResponse.json({ error: "APK_NOT_AVAILABLE" }, { status: 404 });
    }

    return NextResponse.redirect(asset.browser_download_url, { status: 307 });
  } catch {
    return NextResponse.json({ error: "APK_NOT_AVAILABLE" }, { status: 404 });
  }
}

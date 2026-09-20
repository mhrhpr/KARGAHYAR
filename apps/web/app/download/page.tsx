import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "دانلود اپ کارگاهیار",
  description: "دانلود آخرین نسخه Android کارگاهیار برای مدیریت پروژه و عملیات کارگاه.",
};

type ReleaseInfo = {
  apkUrl: string | null;
  version: string | null;
};

async function getReleaseInfo(): Promise<ReleaseInfo> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/mhrhpr/KARGAHYAR/releases/latest",
      {
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json", "User-Agent": "KARGAHYAR-Website" },
      },
    );
    if (!response.ok) return { apkUrl: null, version: null };

    const release = await response.json();
    const asset = Array.isArray(release.assets)
      ? release.assets.find((item: { name?: string; browser_download_url?: string }) =>
          item.name?.toLowerCase().endsWith(".apk"),
        )
      : null;

    return {
      apkUrl: asset?.browser_download_url || null,
      version: release.tag_name || null,
    };
  } catch {
    return { apkUrl: null, version: null };
  }
}

export default async function DownloadPage() {
  const release = await getReleaseInfo();

  return (
    <main className="download-page">
      <header className="download-header">
        <a href="/" className="download-brand">← <span>کارگاهیار</span></a>
        <a href="/" className="download-back">صفحه اصلی</a>
      </header>

      <section className="download-hero">
        <div className="download-copy">
          <div className="download-kicker">KARGAHYAR / ANDROID</div>
          <h1>کارگاهیار<br /><em>روی گوشی تو.</em></h1>
          <p>
            گزارش روزانه، کارکرد نیرو، پیمانکار، هزینه، پرداخت و مصالح را
            همان جایی ثبت کن که خود کارگاه را مدیریت می‌کنی: گوشی.
          </p>
          {release.apkUrl ? (
            <div className="download-action-wrap">
              <a className="download-button" href={release.apkUrl}>
                دانلود مستقیم APK
                <span>↓</span>
              </a>
              <div className="download-meta">
                <span>آخرین نسخه: {release.version || "آخرین Build"}</span>
                <span>Android</span>
              </div>
            </div>
          ) : (
            <div className="download-pending">
              <div className="pending-mark">!</div>
              <div>
                <strong>نسخه عمومی هنوز منتشر نشده</strong>
                <p>صفحه به‌صورت خودکار آخرین APK منتشرشده را پیدا می‌کند؛ به محض انتشار، همین‌جا دکمه دانلود فعال می‌شود.</p>
              </div>
            </div>
          )}
        </div>

        <div className="download-device">
          <div className="download-device-label">INSTALL / 01</div>
          <div className="download-phone">
            <div className="phone-notch" />
            <div className="phone-head">کارگاهیار</div>
            <div className="phone-question">امروز گزارشی داری؟</div>
            <div className="phone-date">گزارش روزانه · آماده ثبت</div>
            <div className="phone-choice active">بله، گزارش دارم <span>←</span></div>
            <div className="phone-choice">امروز گزارشی ندارم</div>
            <div className="phone-choice muted">امروز تعطیل بود</div>
            <div className="phone-foot">PROJECT / DAILY LOG</div>
          </div>
        </div>
      </section>

      <section className="download-steps">
        <div><span>01</span><h2>دانلود</h2><p>APK رسمی را مستقیماً از همان Release پروژه دریافت کن.</p></div>
        <div><span>02</span><h2>نصب</h2><p>فایل را روی Android باز کن و نصب را انجام بده.</p></div>
        <div><span>03</span><h2>شروع</h2><p>وارد حساب شو و اولین پروژه را بساز.</p></div>
      </section>

      <section className="download-note">
        <div><span className="section-kicker">SECURITY / TRUST</span><h2>لینک دانلود، حدس نمی‌زند.</h2><p>صفحه دانلود به‌جای نمایش یک لینک مرده، آخرین Release واقعی GitHub را بررسی می‌کند و فقط وقتی APK وجود داشته باشد دکمه دانلود را نشان می‌دهد.</p></div>
        <a href="https://github.com/mhrhpr/KARGAHYAR/releases" target="_blank" rel="noreferrer">مشاهده Releaseها ↗</a>
      </section>
    </main>
  );
}

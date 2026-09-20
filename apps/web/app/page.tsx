import Image from "next/image";

const features = [
  {
    number: "01",
    title: "پروژه‌محور",
    text: "هر پروژه فضای کاری خودش را دارد؛ نیرو، پیمانکار، هزینه، مصالح و گزارش‌ها در همان Context.",
    icon: "▦",
  },
  {
    number: "02",
    title: "گزارش روزانه",
    text: "گزارش را مرحله‌به‌مرحله و کوتاه ثبت کن؛ از انتخاب شخص تا کارکرد و مبلغ نهایی.",
    icon: "✓",
  },
  {
    number: "03",
    title: "دستمزد و پرداخت",
    text: "روزمزد، اضافه‌کاری، مساعده، هزینه و پرداخت را کنار هم ببین تا مانده‌ها گم نشوند.",
    icon: "₮",
  },
  {
    number: "04",
    title: "پیمانکار و تولید",
    text: "برای کارهای واحدی یا حجمی، مقدار × نرخ را ثبت کن و سابقه نرخ‌ها را نگه دار.",
    icon: "↗",
  },
  {
    number: "05",
    title: "مصالح و هشدار",
    text: "موجودی مصالح را ثبت کن، نقطه سفارش بگذار و وقتی موجودی پایین آمد مطلع شو.",
    icon: "▤",
  },
  {
    number: "06",
    title: "آماده برای اینترنت ضعیف",
    text: "عملیات اصلی روی موبایل قابل صف‌شدن است تا قطعی اینترنت کار روزانه را متوقف نکند.",
    icon: "⌁",
  },
];

const workflow = [
  ["پروژه", "نوع پروژه، اطلاعات اصلی و ماژول‌های موردنیاز را یک‌بار تعریف کن."],
  ["افراد", "نیروها و پیمانکاران را با تخصص و نرخ ثبت کن تا دفعات بعد آماده باشند."],
  ["گزارش", "کارکرد امروز را از موبایل در چند قدم ثبت و قبل از ارسال مرور کن."],
  ["کنترل", "هزینه، پرداخت، موجودی و هشدارها را از یک نمای روشن دنبال کن."],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "کارگاهیار",
  alternateName: "KARGAHYAR",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Android",
  description:
    "اپ موبایل فارسی برای مدیریت پروژه و عملیات کارگاه شامل نیرو، پیمانکار، دستمزد، هزینه، مصالح و گزارش روزانه.",
  url: "https://kargahyar.ir",
};

function Brand() {
  return (
    <a className="brand" href="/" aria-label="صفحه اصلی کارگاهیار">
      <Image src="/brand/kargahyar-mark.svg" alt="" width={44} height={44} priority />
      <span>
        <strong>کارگاهیار</strong>
        <small>KARGAHYAR</small>
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="site-header">
        <Brand />
        <nav className="site-nav" aria-label="ناوبری اصلی">
          <a href="#features">امکانات</a>
          <a href="#workflow">نحوه کار</a>
          <a href="#iran">برای کارگاه ایرانی</a>
          <a href="/download">دانلود</a>
        </nav>
        <a className="header-cta" href="/download">
          دانلود اپ
          <span>↗</span>
        </a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="kicker"><span>●</span> FIELD-FIRST / KARGAHYAR</div>
          <h1 id="hero-title">
            مدیریت کارگاه،
            <br />
            <em>مثل خودِ کارگاه</em>
          </h1>
          <p className="hero-lead">
            کارگاهیار برای جایی ساخته شده که کار واقعی اتفاق می‌افتد؛
            <strong> پروژه، نیرو، پیمانکار، دستمزد، هزینه، مصالح و گزارش روزانه</strong>
            در یک اپ سبک و فارسی.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="/download">
              دانلود رایگان اپ
              <span>←</span>
            </a>
            <a className="button button-ghost" href="#features">
              امکانات را ببین
            </a>
          </div>

          <div className="proof-row" aria-label="ویژگی‌های اصلی">
            <span><b>موبایل‌محور</b> برای کارگاه</span>
            <span><b>RTL فارسی</b> و تومان</span>
            <span><b>Offline-ready</b> برای اینترنت ضعیف</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="نمونه نمای کارگاهیار">
          <div className="blueprint-corner blueprint-corner-a" />
          <div className="blueprint-corner blueprint-corner-b" />
          <div className="visual-label">PROJECT / 01</div>
          <div className="app-frame">
            <div className="app-topline">
              <span>کارگاه نیاوران</span>
              <span className="status-dot">● فعال</span>
            </div>
            <div className="app-title">امروز چه خبر؟</div>
            <div className="app-date">گزارش روزانه · امروز</div>

            <div className="app-metric-grid">
              <div><small>هزینه امروز</small><strong>۱۲.۴M</strong><span>تومان</span></div>
              <div><small>نیروی فعال</small><strong>۱۸</strong><span>نفر</span></div>
              <div><small>پیمانکار</small><strong>۴</strong><span>نفر</span></div>
              <div><small>پیشرفت</small><strong>۶۲٪</strong><span>پروژه</span></div>
            </div>

            <div className="report-card">
              <div className="report-head">
                <span className="mini-icon">✓</span>
                <div>
                  <small>گزارش امروز</small>
                  <strong>کارگاه فعال است</strong>
                </div>
                <span className="report-arrow">←</span>
              </div>
              <div className="progress-line"><i /></div>
            </div>

            <div className="app-list">
              <div><span className="line-icon orange">₮</span><span>پرداخت‌های امروز</span><b>۳ مورد</b></div>
              <div><span className="line-icon navy">▤</span><span>مصالح نزدیک حد سفارش</span><b className="warning">۲ مورد</b></div>
            </div>
          </div>
          <div className="ruler ruler-top"><span>01</span><i /><span>02</span><i /><span>03</span><i /><span>04</span></div>
          <div className="ruler ruler-side"><span>04</span><i /><span>03</span><i /><span>02</span><i /><span>01</span></div>
        </div>
      </section>

      <section className="feature-strip">
        <div><strong>یک ابزار روزانه،</strong> نه یک ERP سنگین.</div>
        <div className="strip-rule" />
        <div>برای مدیر کارگاه، پیمانکار و سرپرست پروژه</div>
      </section>

      <section id="features" className="section">
        <div className="section-heading">
          <div className="section-kicker">01 / CORE TOOLS</div>
          <h2>همه چیزهایی که هر روز واقعاً لازم داری.</h2>
          <p>از ثبت چند عدد و نام شروع می‌شود و به تصویر روشن‌تری از وضعیت پروژه می‌رسد.</p>
        </div>

        <div className="feature-grid">
          {features.map((item) => (
            <article className="feature-card" key={item.number}>
              <div className="feature-meta"><span>{item.number}</span><b>{item.icon}</b></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="card-rule" />
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="section section-workflow">
        <div className="section-heading narrow">
          <div className="section-kicker">02 / WORKFLOW</div>
          <h2>چهار قدم، از کارگاه تا گزارش.</h2>
        </div>

        <div className="workflow-list">
          {workflow.map(([title, text], index) => (
            <article key={title}>
              <div className="workflow-index">0{index + 1}</div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <span className="workflow-line" />
            </article>
          ))}
        </div>
      </section>

      <section id="iran" className="section iran-section">
        <div className="iran-panel">
          <div className="panel-label">03 / BUILT FOR IRAN</div>
          <div className="iran-copy">
            <h2>برای شرایط واقعی ایران طراحی شده.</h2>
            <p>
              کارگاهیار قرار نیست یک نرم‌افزار خارجی را فقط فارسی کند.
              منطق کار روزانه باید با واقعیت کارگاه ایرانی جور باشد:
              گزارش سریع، پرداخت و مساعده، پیمانکاری واحدی، تومان،
              تاریخ جلالی و اینترنتی که همیشه قابل‌اعتماد نیست.
            </p>
          </div>
          <div className="iran-specs">
            <div><span>01</span><b>تومان</b><small>واحد نمایش مالی</small></div>
            <div><span>02</span><b>جلالی</b><small>برای تجربه فارسی</small></div>
            <div><span>03</span><b>Offline</b><small>صف و همگام‌سازی</small></div>
            <div><span>04</span><b>Mobile</b><small>اولویت با گوشی</small></div>
          </div>
        </div>
      </section>

      <section className="download-cta">
        <div>
          <div className="section-kicker light">04 / GET STARTED</div>
          <h2>از فردا شروع نکن؛ <span>امروز ثبتش کن.</span></h2>
          <p>نسخه Android کارگاهیار را بگیر و مدیریت روزانه را از روی گوشی شروع کن.</p>
        </div>
        <a className="button button-dark" href="/download">
          رفتن به صفحه دانلود
          <span>←</span>
        </a>
      </section>

      <footer className="site-footer">
        <Brand />
        <div>
          <p>کارگاهت را مدیریت کن؛ نرم‌افزار را نه.</p>
          <small>© KARGAHYAR — مدیریت عملیات کارگاه</small>
        </div>
        <a href="/download">دانلود اپ</a>
      </footer>
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

const data: Record<string, {
  title: string;
  description: string;
  tag: string;
  keywords: string[];
  published: string;
  sections: { heading: string; body: string[]; bullets?: string[] }[];
}> = {
  "مدیریت-پروژه-ساختمانی": {
    title: "مدیریت پروژه ساختمانی چیست و از کجا باید شروع کرد؟",
    description: "راهنمای کاربردی مدیریت پروژه ساختمانی برای برنامه‌ریزی، کنترل هزینه، نیروی انسانی، پیمانکار و پیشرفت پروژه.",
    tag: "PROJECT MANAGEMENT",
    keywords: ["مدیریت پروژه ساختمانی","مدیریت کارگاه","کنترل پروژه ساختمانی","مدیریت هزینه پروژه","مدیریت پیمانکار"],
    published: "2026-09-20",
    sections: [
      { heading: "مدیریت پروژه ساختمانی دقیقاً یعنی چه؟", body: [
        "مدیریت پروژه ساختمانی فقط برنامه‌ریزی زمان‌بندی نیست. یک پروژه زمانی قابل‌کنترل می‌شود که اطلاعات اصلی آن به‌صورت منظم ثبت، مقایسه و به تصمیم تبدیل شوند.",
        "در عمل مدیر پروژه باید هم‌زمان بداند چه کاری باید انجام شود، چه کسی آن را انجام داده، چقدر هزینه شده، چه مقدار از کار باقی مانده و چه چیزی ممکن است برنامه را از مسیر خارج کند."
      ]},
      { heading: "پنج محور اصلی کنترل پروژه", body: [
        "برای شروع لازم نیست یک سیستم ERP سنگین داشته باشید. پنج دسته اطلاعات معمولاً بخش بزرگی از نیاز روزمره یک کارگاه را پوشش می‌دهد:"
      ], bullets:[
        "برنامه و پیشرفت: فعالیت‌های اصلی، درصد پیشرفت و تاریخ‌های مهم.",
        "نیروی انسانی: حضور، کارکرد، اضافه‌کاری و پرداخت‌ها.",
        "پیمانکاران: موضوع کار، واحد اندازه‌گیری، مقدار انجام‌شده و نرخ واحد.",
        "هزینه و پرداخت: هزینه‌های جاری، پرداخت‌های انجام‌شده و مانده تعهدات.",
        "مصالح: موجودی، مصرف، نقطه سفارش و اقلام حساس."
      ]},
      { heading: "چرا گزارش روزانه اهمیت دارد؟", body: [
        "گزارش روزانه حلقه اتصال بین کار واقعی و مدیریت پروژه است. اگر اطلاعات هر روز ثبت نشود، بسیاری از تصمیم‌ها چند روز بعد بر اساس حافظه، پیام‌های پراکنده یا فایل‌های قدیمی گرفته می‌شوند.",
        "گزارش روزانه خوب لازم نیست طولانی باشد. هدف آن ثبت چند داده کلیدی است: چه کسی، چه کاری، چه مقدار، با چه نرخی، در چه شرایطی و با چه هزینه‌ای انجام شده است."
      ]},
      { heading: "کنترل هزینه بدون پیچیده‌کردن سیستم", body: [
        "یکی از اشتباه‌های رایج این است که همه اطلاعات مالی در یک عدد جمع شوند. بهتر است هزینه عملیاتی، پرداخت واقعی و مانده تعهدات از هم قابل تشخیص باشند.",
        "وقتی این تفکیک وجود داشته باشد، مدیر پروژه می‌تواند بفهمد افزایش هزینه به دلیل فعالیت بیشتر بوده، پرداخت زودتر انجام شده یا یک تعهد جدید ایجاد شده است."
      ]},
      { heading: "نقش فناوری در مدیریت کارگاه", body: [
        "نرم‌افزار مدیریت کارگاه زمانی مفید است که ثبت اطلاعات را از ثبت دستی سریع‌تر کند. بنابراین Mobile-first بودن، فرم‌های کوتاه، انتخاب‌های ازپیش‌آماده و امکان کار در اینترنت ضعیف اهمیت زیادی دارند.",
        "سیستم خوب باید بخش زیادی از کار را از دوش مدیر کارگاه بردارد، نه اینکه او را به اپراتور نرم‌افزار تبدیل کند."
      ]},
      { heading: "جمع‌بندی", body: [
        "برای شروع مدیریت پروژه ساختمانی، لازم نیست همه چیز را یک‌باره دیجیتال کنید. از سه جریان اصلی شروع کنید: ثبت روزانه کار، کنترل افراد و پیمانکاران، و کنترل پول و مصالح. وقتی این داده‌ها منظم شوند، گزارش‌گیری و تصمیم‌گیری هم ساده‌تر می‌شود."
      ]}
    ]
  },
  "گزارش-روزانه-کارگاه": {
    title: "گزارش روزانه کارگاه؛ چه اطلاعاتی واقعاً مهم است؟",
    description: "راهنمای ثبت گزارش روزانه کارگاه و داده‌هایی که برای کنترل نیروی انسانی، پیمانکار، هزینه و پیشرفت پروژه لازم‌اند.",
    tag: "DAILY REPORT",
    keywords: ["گزارش روزانه کارگاه","فرم گزارش روزانه کارگاه","گزارش کار ساختمان","مدیریت کارگاه"],
    published: "2026-09-20",
    sections: [
      { heading: "گزارش روزانه خوب چه ویژگی‌ای دارد؟", body: [
        "گزارش روزانه باید کوتاه، منظم و قابل استفاده در تصمیم‌گیری روز بعد باشد. گزارش طولانی که هیچ‌کس آن را مرور نمی‌کند، ارزش کمتری از چند داده دقیق و استاندارد دارد.",
        "بهترین ساختار، ثبت اطلاعات در همان روز و نزدیک به زمان انجام کار است."
      ]},
      { heading: "چهار گروه داده را ثبت کنیم؟", body: [
        "یک قالب کاربردی می‌تواند گزارش روزانه را به چهار بخش تقسیم کند:"
      ], bullets:[
        "نیروی انسانی: نام، تخصص، کارکرد، اضافه‌کاری و مساعده.",
        "پیمانکار: نام، موضوع کار، واحد، مقدار و نرخ.",
        "هزینه و پرداخت: هزینه‌های روز، پرداخت‌های واقعی و توضیحات.",
        "مصالح و اتفاقات: مصرف، موجودی، کسری و نکات مهم کارگاه."
      ]},
      { heading: "گزارش روزانه نباید دوباره‌کاری ایجاد کند", body: [
        "اگر نام نیرو، تخصص و نرخ قبلاً در سیستم ثبت شده باشد، گزارش روزانه نباید دوباره همه این اطلاعات را از کاربر بخواهد. هدف ثبت روزانه، فقط گرفتن تغییرات و رویدادهای امروز است."
      ]},
      { heading: "گزارش روزانه و کنترل هزینه", body: [
        "ثبت روزانه باعث می‌شود هزینه‌های دستمزد و پیمانکار به تاریخ و فعالیت مشخص متصل شوند. این اتصال، تحلیل هزینه را بسیار ساده‌تر می‌کند."
      ]},
      { heading: "جمع‌بندی", body: [
        "یک گزارش روزانه مؤثر، گزارش طولانی نیست؛ گزارشی است که فردا بتوانی بر اساس آن تصمیم بگیری. استانداردسازی همین داده‌های کم، پایه خوبی برای مدیریت دیجیتال کارگاه است."
      ]}
    ]
  },
  "کنترل-هزینه-پروژه": {
    title: "کنترل هزینه پروژه ساختمانی بدون اکسل‌های پیچیده",
    description: "اصول ساده کنترل هزینه پروژه ساختمانی با تفکیک دستمزد، پیمانکار، هزینه‌های جاری، پرداخت و مصالح.",
    tag: "COST CONTROL",
    keywords: ["کنترل هزینه پروژه ساختمانی","هزینه ساخت","مدیریت هزینه کارگاه","کنترل مالی پروژه"],
    published: "2026-09-20",
    sections: [
      { heading: "چرا کنترل هزینه سخت می‌شود؟", body: [
        "در پروژه‌های ساختمانی هزینه‌ها از کانال‌های مختلف وارد می‌شوند: دستمزد، پیمانکار، خرید مصالح، حمل‌ونقل، اجاره ابزار و هزینه‌های جاری. وقتی این موارد در فایل‌ها و پیام‌های پراکنده ثبت شوند، جمع‌کردن تصویر واقعی پروژه دشوار می‌شود."
      ]},
      { heading: "هزینه با پرداخت یکی نیست", body: [
        "یکی از مهم‌ترین تفکیک‌ها این است که هزینه ثبت‌شده با پول پرداخت‌شده یکی نیست. ممکن است کاری انجام شده باشد اما هنوز بخشی از مبلغ آن پرداخت نشده باشد.",
        "بنابراین داشبورد مالی بهتر است دست‌کم سه عدد را جدا کند: هزینه ثبت‌شده، پرداخت واقعی و مانده."
      ]},
      { heading: "برای پیمانکار چه چیزی ثبت کنیم؟", body: [
        "برای کارهای واحدی، ترکیب مقدار × نرخ واحد یک مدل ساده و قابل فهم است. مثلاً مترمربع گچ‌کاری، متر طول لوله‌کشی یا تعداد واحدهای نصب‌شده.",
        "این مدل اجازه می‌دهد مقدار کار با هزینه مستقیم آن پیوند بخورد."
      ]},
      { heading: "مصالح را هم وارد تصویر هزینه کنید", body: [
        "اگر موجودی مصالح دیده نشود، بخشی از هزینه پروژه در یک نقطه پنهان می‌ماند. ثبت ورود، مصرف و حد سفارش کمک می‌کند خریدهای اضطراری و توقف کار کمتر شود."
      ]},
      { heading: "یک سیستم خوب چه کاری انجام می‌دهد؟", body: [
        "سیستم مدیریت هزینه نباید صرفاً یک جمع‌کننده اعداد باشد. باید داده‌ها را به پروژه، شخص، فعالیت و تاریخ متصل کند تا بتوان از آن برای تصمیم بعدی استفاده کرد."
      ]},
      { heading: "جمع‌بندی", body: [
        "برای کنترل هزینه پروژه، لازم نیست ده‌ها جدول بسازید. کافی است جریان هزینه و پرداخت را تفکیک کنید، کار پیمانکار را به مقدار و نرخ متصل کنید و مصالح را از تصویر مالی خارج نکنید."
      ]}
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(data).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = data[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: "https://kargahyar.ir/magazine/" + slug },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.published,
      authors: ["کارگاهیار"],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = data[slug];
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    dateModified: article.published,
    author: { "@type": "Organization", name: "کارگاهیار", url: "https://kargahyar.ir" },
    publisher: { "@type": "Organization", name: "کارگاهیار", url: "https://kargahyar.ir" },
    mainEntityOfPage: "https://kargahyar.ir/magazine/" + slug,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: "https://kargahyar.ir" },
      { "@type": "ListItem", position: 2, name: "مجله", item: "https://kargahyar.ir/magazine" },
      { "@type": "ListItem", position: 3, name: article.title, item: "https://kargahyar.ir/magazine/" + slug },
    ],
  };

  return (
    <main className="article-page">
      <header className="content-header">
        <a className="content-brand" href="/">کارگاهیار</a>
        <a className="content-back" href="/magazine">← مجله</a>
      </header>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article>
        <header className="article-top">
          <div className="breadcrumbs">
            <a href="/">خانه</a><span>/</span><a href="/magazine">مجله</a><span>/</span><span>{article.title}</span>
          </div>
          <div className="article-kicker">{article.tag}</div>
          <h1>{article.title}</h1>
          <p className="lead">{article.description}</p>
          <div className="article-meta">
            <span>نویسنده: کارگاهیار</span>
            <span>انتشار: ۲۹ شهریور ۱۴۰۵</span>
            <span>مدیریت پروژه و کارگاه</span>
          </div>
        </header>

        <div className="article-body">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}

          <div className="article-cta">
            <div>
              <strong>می‌خواهی مدیریت روزانه کارگاه را ساده‌تر کنی؟</strong>
              <p>کارگاهیار برای ثبت پروژه، نیرو، پیمانکار، هزینه، مصالح و گزارش روزانه ساخته شده است.</p>
            </div>
            <a href="/download">دانلود کارگاهیار ←</a>
          </div>
        </div>
      </article>
    </main>
  );
}

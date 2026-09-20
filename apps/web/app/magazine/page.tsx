import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مجله کارگاهیار | مدیریت پروژه و کارگاه",
  description:
    "مقاله‌ها و راهنماهای کاربردی کارگاهیار درباره مدیریت پروژه ساختمانی، گزارش روزانه کارگاه، کنترل هزینه و مدیریت نیروی انسانی.",
  alternates: { canonical: "https://kargahyar.ir/magazine" },
};

const articles = [
  {
    slug: "مدیریت-پروژه-ساختمانی",
    tag: "PROJECT MANAGEMENT",
    title: "مدیریت پروژه ساختمانی چیست و از کجا باید شروع کرد؟",
    excerpt:
      "راهنمای کاربردی برای برنامه‌ریزی پروژه، کنترل زمان و هزینه، مدیریت نیروی انسانی و پیمانکار و ثبت اطلاعات روزانه.",
  },
  {
    slug: "گزارش-روزانه-کارگاه",
    tag: "DAILY REPORT",
    title: "گزارش روزانه کارگاه؛ چه اطلاعاتی واقعاً مهم است؟",
    excerpt:
      "یک چارچوب ساده برای ثبت کارکرد نیروها، فعالیت پیمانکار، هزینه‌های روزانه، مصالح و اتفاقات مهم پروژه.",
  },
  {
    slug: "کنترل-هزینه-پروژه",
    tag: "COST CONTROL",
    title: "کنترل هزینه پروژه ساختمانی بدون اکسل‌های پیچیده",
    excerpt:
      "چطور هزینه، پرداخت، دستمزد، پیمانکار و مصالح را در یک تصویر قابل‌کنترل نگه داریم و زودتر از انحراف باخبر شویم.",
  },
];

export default function MagazinePage() {
  return (
    <main className="magazine-shell">
      <header className="content-header">
        <a className="content-brand" href="/">کارگاهیار</a>
        <a className="content-back" href="/download">دانلود اپ ←</a>
      </header>

      <section className="magazine-hero">
        <div className="section-kicker">KARGAHYAR / MAGAZINE</div>
        <h1>مدیریت پروژه،<br /><em>برای کار واقعی.</em></h1>
        <p>
          راهنماهای کوتاه و کاربردی برای مدیران کارگاه، سرپرستان پروژه و پیمانکاران؛
          از برنامه‌ریزی و گزارش روزانه تا کنترل هزینه و نیروی انسانی.
        </p>
      </section>

      <section className="article-index-grid">
        {articles.map((article) => (
          <a className="article-card" key={article.slug} href={"/magazine/" + article.slug}>
            <span className="tag">{article.tag}</span>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <small>مطالعه مقاله ←</small>
          </a>
        ))}
      </section>
    </main>
  );
}

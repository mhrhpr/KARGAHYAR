import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kargahyar.ir";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "کارگاهیار | مدیریت کارگاه، پروژه و هزینه",
    template: "%s | کارگاهیار",
  },
  description:
    "کارگاهیار یک اپ فارسی و موبایل‌محور برای مدیریت پروژه، نیرو، پیمانکار، دستمزد، هزینه، مصالح و گزارش روزانه کارگاه است.",
  keywords: [
    "نرم افزار مدیریت کارگاه",
    "اپ مدیریت کارگاه",
    "مدیریت پروژه ساختمانی",
    "مدیریت پیمانکار",
    "مدیریت کارگران",
    "محاسبه دستمزد کارگران",
    "گزارش روزانه کارگاه",
    "مدیریت هزینه پروژه",
    "مدیریت مصالح ساختمان",
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "کارگاهیار",
    title: "کارگاهیار | مدیریت کارگاه، پروژه و هزینه",
    description: "کارگاهت را مدیریت کن؛ نرم‌افزار را نه.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "کارگاهیار | مدیریت کارگاه، پروژه و هزینه",
    description: "ثبت سریع کارگاه، دستمزد، پیمانکار، هزینه و مصالح در موبایل.",
  },
  authors: [{ name: "کارگاهیار" }],
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

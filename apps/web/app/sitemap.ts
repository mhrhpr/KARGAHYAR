import type {MetadataRoute} from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://kargahyar.ir", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://kargahyar.ir/download", lastModified: now, changeFrequency: "weekly", priority: .9 },
    { url: "https://kargahyar.ir/magazine", lastModified: now, changeFrequency: "weekly", priority: .8 },
    { url: "https://kargahyar.ir/magazine/مدیریت-پروژه-ساختمانی", lastModified: now, changeFrequency: "monthly", priority: .8 },
    { url: "https://kargahyar.ir/magazine/گزارش-روزانه-کارگاه", lastModified: now, changeFrequency: "monthly", priority: .7 },
    { url: "https://kargahyar.ir/magazine/کنترل-هزینه-پروژه", lastModified: now, changeFrequency: "monthly", priority: .7 },
  ];
}
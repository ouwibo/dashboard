export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  coverImage: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

import { mockArticles } from "@/lib/mockData";

const KEY = "ouwibo_articles";

export function getArticles(): Article[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getAllArticles(): Article[] {
  const stored = getArticles();
  const storedSlugs = new Set(stored.map((a) => a.slug));
  const samples = mockArticles.filter((a) => !storedSlugs.has(a.slug));
  return [...stored, ...samples];
}

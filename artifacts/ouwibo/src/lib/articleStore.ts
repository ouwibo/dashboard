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

const KEY = "ouwibo_articles";
const AUTH_KEY = "ouwibo_admin";

/* ─── Auth ─── */
export function adminLogin(password: string): boolean {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD || "ouwibo2025";
  if (password === expected) {
    sessionStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}
export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}
export function adminLogout() {
  sessionStorage.removeItem(AUTH_KEY);
}

/* ─── CRUD ─── */
export function getArticles(): Article[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveArticle(data: Omit<Article, "id" | "publishedAt" | "readTime">): Article {
  const list = getArticles();
  const wordCount = data.content.split(/\s+/).length;
  const article: Article = {
    ...data,
    id: Date.now().toString(),
    slug: data.slug || slugify(data.title),
    publishedAt: new Date().toISOString(),
    readTime: Math.max(1, Math.ceil(wordCount / 220)),
  };
  list.unshift(article);
  localStorage.setItem(KEY, JSON.stringify(list));
  return article;
}

export function updateArticle(id: string, data: Partial<Article>) {
  const list = getArticles().map(a => a.id === id ? { ...a, ...data } : a);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function deleteArticle(id: string) {
  const list = getArticles().filter(a => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find(a => a.slug === slug);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ─── All articles (stored + samples) ─── */
import { mockArticles } from "@/lib/mockData";
export function getAllArticles(): Article[] {
  const stored = getArticles();
  const storedSlugs = new Set(stored.map(a => a.slug));
  const samples = mockArticles.filter(a => !storedSlugs.has(a.slug));
  return [...stored, ...samples];
}

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn("[api] DATABASE_URL is not set");
}

export const sql = url ? neon(url) : null;

export async function ensureSchema() {
  if (!sql) throw new Error("DATABASE_URL not configured");
  await sql`
    CREATE TABLE IF NOT EXISTS airdrops (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      ticker TEXT,
      logo_url TEXT,
      logo_color TEXT,
      logo_initial TEXT,
      reward_type TEXT,
      status TEXT,
      status_date TEXT,
      chain TEXT,
      moni_score INTEGER,
      raise_funds TEXT,
      backers JSONB DEFAULT '[]'::jsonb,
      tasks JSONB DEFAULT '[]'::jsonb,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT,
      tags JSONB DEFAULT '[]'::jsonb,
      author TEXT,
      cover_image TEXT,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      read_time INTEGER DEFAULT 5,
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_airdrops_status ON airdrops(status);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
  `;
}

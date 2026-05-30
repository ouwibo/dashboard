import { sql, ensureSchema } from "./_db.js";

export default async function handler(req, res) {
  if (!sql) return res.status(500).json({ error: "Database not configured" });
  try {
    if (req.method === "GET") {
      const slug = req.query?.slug;
      if (slug) {
        const [row] = await sql`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`;
        if (!row) return res.status(404).json({ error: "Not found" });
        return res.status(200).json({ data: row });
      }
      const rows = await sql`SELECT * FROM articles ORDER BY published_at DESC`;
      return res.status(200).json({ data: rows });
    }
    if (req.method === "POST") {
      if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
      await ensureSchema();
      const a = req.body || {};
      if (!a.slug || !a.title) return res.status(400).json({ error: "slug and title required" });
      const [row] = await sql`
        INSERT INTO articles (id, slug, title, excerpt, content, category, tags, author, cover_image, published_at, read_time, featured)
        VALUES (${a.id || `art-${Date.now()}`}, ${a.slug}, ${a.title}, ${a.excerpt || ""}, ${a.content || ""}, ${a.category || "News"}, ${JSON.stringify(a.tags ?? [])}::jsonb, ${a.author || "Ouwibo"}, ${a.coverImage || null}, ${a.publishedAt || new Date().toISOString()}, ${a.readTime || 5}, ${a.featured ?? false})
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content,
          category = EXCLUDED.category, tags = EXCLUDED.tags, author = EXCLUDED.author,
          cover_image = EXCLUDED.cover_image, read_time = EXCLUDED.read_time, featured = EXCLUDED.featured
        RETURNING *;
      `;
      return res.status(200).json({ data: row });
    }
    if (req.method === "DELETE") {
      if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
      const slug = req.query?.slug;
      if (!slug) return res.status(400).json({ error: "slug required" });
      await sql`DELETE FROM articles WHERE slug = ${slug}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[articles]", err);
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}

function isAuthorized(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization || "";
  return auth.startsWith("Bearer ") && auth.slice(7) === secret;
}

import { sql, ensureSchema } from "./_db.js";

export default async function handler(req, res) {
  if (!sql) {
    return res.status(500).json({ error: "Database not configured" });
  }
  try {
    if (req.method === "GET") {
      const rows = await sql`SELECT * FROM airdrops ORDER BY status_date DESC NULLS LAST, id DESC`;
      return res.status(200).json({ data: rows });
    }
    if (req.method === "POST") {
      if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
      await ensureSchema();
      const a = req.body || {};
      if (!a.slug || !a.name) return res.status(400).json({ error: "slug and name required" });
      const [row] = await sql`
        INSERT INTO airdrops (slug, name, ticker, logo_url, logo_color, logo_initial, reward_type, status, status_date, chain, moni_score, raise_funds, backers, tasks, description)
        VALUES (${a.slug}, ${a.name}, ${a.ticker ?? null}, ${a.logoUrl ?? null}, ${a.logoColor ?? null}, ${a.logoInitial ?? null}, ${a.rewardType ?? null}, ${a.status ?? "Potential"}, ${a.statusDate ?? null}, ${a.chain ?? null}, ${a.moniScore ?? null}, ${a.raiseFunds ?? null}, ${JSON.stringify(a.backers ?? [])}::jsonb, ${JSON.stringify(a.tasks ?? [])}::jsonb, ${a.description ?? null})
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name, ticker = EXCLUDED.ticker, logo_url = EXCLUDED.logo_url,
          logo_color = EXCLUDED.logo_color, logo_initial = EXCLUDED.logo_initial,
          reward_type = EXCLUDED.reward_type, status = EXCLUDED.status, status_date = EXCLUDED.status_date,
          chain = EXCLUDED.chain, moni_score = EXCLUDED.moni_score, raise_funds = EXCLUDED.raise_funds,
          backers = EXCLUDED.backers, tasks = EXCLUDED.tasks, description = EXCLUDED.description,
          updated_at = NOW()
        RETURNING *;
      `;
      return res.status(200).json({ data: row });
    }
    if (req.method === "DELETE") {
      if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
      const slug = req.query?.slug;
      if (!slug) return res.status(400).json({ error: "slug required" });
      await sql`DELETE FROM airdrops WHERE slug = ${slug}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[airdrops]", err);
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}

function isAuthorized(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization || "";
  return auth.startsWith("Bearer ") && auth.slice(7) === secret;
}

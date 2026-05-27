import { put } from "@vercel/blob";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.ADMIN_SECRET;
  const auth = req.headers.authorization || "";
  if (!secret || !auth.startsWith("Bearer ") || auth.slice(7) !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const filename = req.query?.filename || `upload-${Date.now()}`;
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buf = Buffer.concat(chunks);
    if (!buf.length) return res.status(400).json({ error: "Empty body" });
    const blob = await put(safeName, buf, {
      access: "public",
      addRandomSuffix: true,
      contentType: req.headers["content-type"] || "application/octet-stream",
    });
    return res.status(200).json({ url: blob.url, pathname: blob.pathname, size: buf.length });
  } catch (err) {
    console.error("[upload]", err);
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}

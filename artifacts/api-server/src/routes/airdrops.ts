import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, airdropsTable, activityTable } from "@workspace/db";
import {
  CreateAirdropBody,
  GetAirdropParams,
  GetAirdropResponse,
  UpdateAirdropParams,
  UpdateAirdropBody,
  UpdateAirdropResponse,
  DeleteAirdropParams,
  ListAirdropsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toResponse(a: typeof airdropsTable.$inferSelect) {
  return {
    ...a,
    description: a.description ?? null,
    websiteUrl: a.websiteUrl ?? null,
    twitterUrl: a.twitterUrl ?? null,
    telegramUrl: a.telegramUrl ?? null,
    discordUrl: a.discordUrl ?? null,
    rewardEstimate: a.rewardEstimate ?? null,
    totalValue: a.totalValue ?? null,
    startDate: a.startDate ?? null,
    endDate: a.endDate ?? null,
    createdAt: a.createdAt.toISOString(),
  };
}

router.get("/airdrops", async (req, res): Promise<void> => {
  const { status, category, chain, featured, search } = req.query as Record<string, string>;

  const conditions: SQL[] = [];
  if (status) conditions.push(eq(airdropsTable.status, status));
  if (category) conditions.push(eq(airdropsTable.category, category));
  if (chain) conditions.push(eq(airdropsTable.chain, chain));
  if (featured === "true") conditions.push(eq(airdropsTable.isFeatured, true));
  if (search) conditions.push(ilike(airdropsTable.name, `%${search}%`));

  const airdrops = conditions.length
    ? await db.select().from(airdropsTable).where(and(...conditions))
    : await db.select().from(airdropsTable);

  res.json(ListAirdropsResponse.parse(airdrops.map(toResponse)));
});

router.post("/airdrops", async (req, res): Promise<void> => {
  const parsed = CreateAirdropBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [airdrop] = await db.insert(airdropsTable).values({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    logoColor: parsed.data.logoColor ?? "#d95c38",
    logoInitial: parsed.data.logoInitial ?? parsed.data.name.charAt(0).toUpperCase(),
    websiteUrl: parsed.data.websiteUrl,
    twitterUrl: parsed.data.twitterUrl,
    telegramUrl: parsed.data.telegramUrl,
    discordUrl: parsed.data.discordUrl,
    category: parsed.data.category,
    chain: parsed.data.chain,
    status: parsed.data.status,
    rewardEstimate: parsed.data.rewardEstimate,
    totalValue: parsed.data.totalValue,
    difficulty: parsed.data.difficulty,
    isFeatured: parsed.data.isFeatured ?? false,
    isVerified: parsed.data.isVerified ?? false,
    participantsCount: parsed.data.participantsCount ?? 0,
    taskCount: parsed.data.taskCount ?? 0,
    startDate: parsed.data.startDate,
    endDate: parsed.data.endDate,
  }).returning();

  await db.insert(activityTable).values({
    type: "airdrop_added",
    message: `"${airdrop.name}" airdrop added`,
    actorName: null,
  });

  res.status(201).json(GetAirdropResponse.parse(toResponse(airdrop)));
});

router.get("/airdrops/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const params = GetAirdropParams.safeParse({ id });
  if (!params.success || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [airdrop] = await db.select().from(airdropsTable).where(eq(airdropsTable.id, id));
  if (!airdrop) { res.status(404).json({ error: "Not found" }); return; }

  res.json(GetAirdropResponse.parse(toResponse(airdrop)));
});

router.patch("/airdrops/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const params = UpdateAirdropParams.safeParse({ id });
  if (!params.success || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateAirdropBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db.update(airdropsTable).set(parsed.data).where(eq(airdropsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }

  await db.insert(activityTable).values({
    type: "airdrop_updated",
    message: `"${updated.name}" airdrop updated`,
    actorName: null,
  });

  res.json(UpdateAirdropResponse.parse(toResponse(updated)));
});

router.delete("/airdrops/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const params = DeleteAirdropParams.safeParse({ id });
  if (!params.success || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  await db.delete(airdropsTable).where(eq(airdropsTable.id, id));
  res.status(204).send();
});

export default router;

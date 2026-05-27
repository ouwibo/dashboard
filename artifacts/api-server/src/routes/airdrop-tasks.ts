import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, airdropTasksTable, airdropsTable } from "@workspace/db";
import {
  ListAirdropTasksParams,
  ListAirdropTasksResponse,
  CreateAirdropTaskBody,
  CreateAirdropTaskParams,
  UpdateAirdropTaskParams,
  UpdateAirdropTaskBody,
  UpdateAirdropTaskResponse,
  DeleteAirdropTaskParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toResponse(t: typeof airdropTasksTable.$inferSelect) {
  return {
    ...t,
    description: t.description ?? null,
    link: t.link ?? null,
    createdAt: t.createdAt.toISOString(),
  };
}

router.get("/airdrops/:id/tasks", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const params = ListAirdropTasksParams.safeParse({ id });
  if (!params.success || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const tasks = await db.select().from(airdropTasksTable)
    .where(eq(airdropTasksTable.airdropId, id))
    .orderBy(airdropTasksTable.sortOrder);

  res.json(ListAirdropTasksResponse.parse(tasks.map(toResponse)));
});

router.post("/airdrops/:id/tasks", async (req, res): Promise<void> => {
  const airdropId = parseInt(req.params.id as string, 10);
  const params = CreateAirdropTaskParams.safeParse({ id: airdropId });
  if (!params.success || isNaN(airdropId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = CreateAirdropTaskBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [task] = await db.insert(airdropTasksTable).values({
    airdropId,
    title: parsed.data.title,
    description: parsed.data.description,
    link: parsed.data.link,
    taskType: parsed.data.taskType ?? "other",
    isRequired: parsed.data.isRequired ?? true,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();

  await db.update(airdropsTable)
    .set({ taskCount: (await db.select().from(airdropTasksTable).where(eq(airdropTasksTable.airdropId, airdropId))).length })
    .where(eq(airdropsTable.id, airdropId));

  res.status(201).json(UpdateAirdropTaskResponse.parse(toResponse(task)));
});

router.patch("/airdrop-tasks/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const params = UpdateAirdropTaskParams.safeParse({ id });
  if (!params.success || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateAirdropTaskBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db.update(airdropTasksTable).set(parsed.data).where(eq(airdropTasksTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }

  res.json(UpdateAirdropTaskResponse.parse(toResponse(updated)));
});

router.delete("/airdrop-tasks/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const params = DeleteAirdropTaskParams.safeParse({ id });
  if (!params.success || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [task] = await db.select().from(airdropTasksTable).where(eq(airdropTasksTable.id, id));
  if (task) {
    await db.delete(airdropTasksTable).where(eq(airdropTasksTable.id, id));
    const remaining = await db.select().from(airdropTasksTable).where(eq(airdropTasksTable.airdropId, task.airdropId));
    await db.update(airdropsTable).set({ taskCount: remaining.length }).where(eq(airdropsTable.id, task.airdropId));
  }

  res.status(204).send();
});

export default router;

import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, airdropsTable, airdropTasksTable, activityTable } from "@workspace/db";
import {
  GetStatsResponse,
  ListActivityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (req, res): Promise<void> => {
  const airdrops = await db.select().from(airdropsTable);
  const tasks = await db.select().from(airdropTasksTable);

  const totalAirdrops = airdrops.length;
  const activeAirdrops = airdrops.filter(a => a.status === "active").length;
  const upcomingAirdrops = airdrops.filter(a => a.status === "upcoming").length;
  const endedAirdrops = airdrops.filter(a => a.status === "ended").length;
  const totalTasks = tasks.length;
  const featuredCount = airdrops.filter(a => a.isFeatured).length;

  res.json(GetStatsResponse.parse({
    totalAirdrops,
    activeAirdrops,
    upcomingAirdrops,
    endedAirdrops,
    totalTasks,
    featuredCount,
  }));
});

router.get("/activity", async (req, res): Promise<void> => {
  const items = await db.select().from(activityTable)
    .orderBy(sql`${activityTable.createdAt} desc`)
    .limit(20);

  res.json(ListActivityResponse.parse(items.map(a => ({
    ...a,
    actorName: a.actorName ?? null,
    createdAt: a.createdAt.toISOString(),
  }))));
});

export default router;

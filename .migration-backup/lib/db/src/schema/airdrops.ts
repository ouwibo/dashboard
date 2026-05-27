import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const airdropsTable = pgTable("airdrops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  logoColor: text("logo_color").notNull().default("#d95c38"),
  logoInitial: text("logo_initial").notNull().default("A"),
  websiteUrl: text("website_url"),
  twitterUrl: text("twitter_url"),
  telegramUrl: text("telegram_url"),
  discordUrl: text("discord_url"),
  category: text("category").notNull().default("defi"),
  chain: text("chain").notNull().default("ETH"),
  status: text("status").notNull().default("active"),
  rewardEstimate: text("reward_estimate"),
  totalValue: text("total_value"),
  difficulty: text("difficulty").notNull().default("medium"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  participantsCount: integer("participants_count").notNull().default(0),
  taskCount: integer("task_count").notNull().default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAirdropSchema = createInsertSchema(airdropsTable).omit({ id: true, createdAt: true });
export type InsertAirdrop = z.infer<typeof insertAirdropSchema>;
export type Airdrop = typeof airdropsTable.$inferSelect;

export const airdropTasksTable = pgTable("airdrop_tasks", {
  id: serial("id").primaryKey(),
  airdropId: integer("airdrop_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  link: text("link"),
  taskType: text("task_type").notNull().default("other"),
  isRequired: boolean("is_required").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAirdropTaskSchema = createInsertSchema(airdropTasksTable).omit({ id: true, createdAt: true });
export type InsertAirdropTask = z.infer<typeof insertAirdropTaskSchema>;
export type AirdropTask = typeof airdropTasksTable.$inferSelect;

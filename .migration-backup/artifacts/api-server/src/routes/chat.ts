import { Router, type IRouter } from "express";
import { db, airdropsTable } from "@workspace/db";
import { SendChatBody, SendChatResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/chat", async (req, res): Promise<void> => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const lastMessage = parsed.data.messages[parsed.data.messages.length - 1];
  const userText = lastMessage?.content?.toLowerCase() ?? "";

  // --- Replace the block below with your LLM API call ---
  // Example with OpenAI:
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: parsed.data.messages,
  //   system: "You are an airdrop tracker assistant..."
  // });
  // const reply = response.choices[0].message.content;
  // -------------------------------------------------------

  // Smart mock: fetch real airdrop data and answer basic questions
  const airdrops = await db.select().from(airdropsTable);
  const active = airdrops.filter(a => a.status === "active");
  const upcoming = airdrops.filter(a => a.status === "upcoming");

  let reply = "";

  if (userText.includes("active") || userText.includes("aktif")) {
    const names = active.map(a => a.name).join(", ");
    reply = `Currently there are ${active.length} active airdrops: ${names}. All of them have tasks you can complete to qualify for the airdrop.`;
  } else if (userText.includes("upcoming") || userText.includes("soon") || userText.includes("mendatang")) {
    const names = upcoming.map(a => a.name).join(", ");
    reply = upcoming.length > 0
      ? `Upcoming airdrops to watch: ${names}. Get ready — start following their socials now!`
      : "No upcoming airdrops tracked yet. Check back soon!";
  } else if (userText.includes("best") || userText.includes("terbaik") || userText.includes("recommend")) {
    const featured = airdrops.filter(a => a.isFeatured && a.status === "active");
    const names = featured.map(a => `${a.name} (${a.rewardEstimate ?? "TBD"})`).join(", ");
    reply = `Top featured airdrops right now: ${names}. These are verified projects with confirmed token distributions.`;
  } else if (userText.includes("easy") || userText.includes("mudah") || userText.includes("beginner")) {
    const easy = airdrops.filter(a => a.difficulty === "easy" && a.status === "active");
    const names = easy.map(a => a.name).join(", ");
    reply = easy.length > 0
      ? `Easy airdrops for beginners: ${names}. These only require basic tasks like following on Twitter and joining Telegram.`
      : "No easy airdrops active right now. Check the full list for medium difficulty ones!";
  } else if (userText.includes("how") || userText.includes("cara") || userText.includes("task")) {
    reply = "To participate in an airdrop: 1) Click on any airdrop card to see its tasks, 2) Complete each task (follow Twitter, join Discord, bridge tokens, etc.), 3) Keep track of your progress. The more tasks you complete, the higher your chance of a larger airdrop allocation!";
  } else if (userText.includes("hello") || userText.includes("hi") || userText.includes("halo") || userText.includes("hai")) {
    reply = `Hello! I'm your Airdrop AI assistant 🚀 I can help you find the best airdrops. We're currently tracking ${airdrops.length} airdrops with ${active.length} active right now. Ask me about "best airdrops", "easy airdrops", "upcoming airdrops", or how to complete tasks!`;
  } else {
    reply = `Great question! We're tracking ${airdrops.length} airdrops in total — ${active.length} active and ${upcoming.length} upcoming. To maximize your airdrop earnings, focus on verified projects with high reward estimates. Want me to show you the featured ones or easy ones to start with?`;
  }

  res.json(SendChatResponse.parse({ message: reply }));
});

export default router;

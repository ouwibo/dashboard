import { Router, type IRouter } from "express";
import healthRouter from "./health";
import airdropsRouter from "./airdrops";
import airdropTasksRouter from "./airdrop-tasks";
import statsRouter from "./stats";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(airdropsRouter);
router.use(airdropTasksRouter);
router.use(statsRouter);
router.use(chatRouter);

export default router;

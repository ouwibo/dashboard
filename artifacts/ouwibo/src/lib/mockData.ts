export interface AirdropTask {
  name: string;
  type: "form" | "trading" | "social" | "testnet" | "staking" | "liquidity"
      | "mint" | "ambassador" | "bounty" | "mainnet" | "predictions" | "game" | "deploy";
  cost: string;
  time: string;
  url: string;
}

export interface Airdrop {
  id: number;
  rank: number;
  name: string;
  slug: string;
  ticker: string;
  logoUrl: string;
  logoInitial: string;
  logoColor: string;
  tier: "S" | "A" | "B" | "C";
  score: number;
  scores: { token: number; value: number; heat: number };
  badges: string[];
  riskCount: number;
  chains: string[];
  funding: string;
  tasksDone: number;
  tasksTotal: number;
  heat: number;
  updatedAgo: string;
  suitableFor: string[];
  tasks: AirdropTask[];
  leadVCs: string[];
  fundingRound: string;
  fundingDate: string;
  websiteUrl: string;
  twitterUrl: string;
  isListed: boolean;
}

export const mockAirdrops: Airdrop[] = [
  {
    id: 1, rank: 1,
    name: "Boost (RabbitHole)", slug: "boost-rabbithole", ticker: "",
    logoUrl: "https://pbs.twimg.com/profile_images/2046888426662739969/Hk1r6Zon_normal.jpg",
    logoInitial: "RH", logoColor: "#6366f1",
    tier: "S", score: 99,
    scores: { token: 10, value: 9, heat: 10 },
    badges: ["Official", "Active"], riskCount: 1,
    chains: [],
    funding: "$21.6M", tasksDone: 1, tasksTotal: 1, heat: 7024, updatedAgo: "Today",
    suitableFor: ["Free", "Multi-acc"],
    tasks: [
      { name: "Waitlist", type: "form", cost: "Free", time: "3 min", url: "https://www.rabbithole.gg/" }
    ],
    leadVCs: ["The Chernin Group", "Framework Ventures", "ParaFi Capital", "Slow Ventures"],
    fundingRound: "Series A", fundingDate: "2022-02-15",
    websiteUrl: "https://www.rabbithole.gg/", twitterUrl: "https://twitter.com/rabbithole_gg",
    isListed: false,
  },
  {
    id: 2, rank: 2,
    name: "GRVT", slug: "grvt", ticker: "GRVT",
    logoUrl: "https://pbs.twimg.com/profile_images/1991661582527655936/Kn9vFGru_normal.jpg",
    logoInitial: "GR", logoColor: "#0ea5e9",
    tier: "S", score: 94,
    scores: { token: 10, value: 7, heat: 10 },
    badges: ["Official", "Active"], riskCount: 0,
    chains: [],
    funding: "$33.3M", tasksDone: 1, tasksTotal: 6, heat: 5413, updatedAgo: "6d",
    suitableFor: ["Low budget"],
    tasks: [
      { name: "GRVT Rewards Season 2", type: "trading", cost: "$15", time: "10 min", url: "https://grvt.io/exchange/sign-up?ref=WRNRM40" }
    ],
    leadVCs: ["500 Global", "QCP Capital", "Selini Capital"],
    fundingRound: "Series A", fundingDate: "2025-09-18",
    websiteUrl: "https://grvt.io", twitterUrl: "https://twitter.com/grvt_io",
    isListed: false,
  },
  {
    id: 3, rank: 3,
    name: "D3", slug: "d3", ticker: "",
    logoUrl: "https://pbs.twimg.com/profile_images/1882307971889442816/9ZQCOJ-g_normal.jpg",
    logoInitial: "D3", logoColor: "#8b5cf6",
    tier: "S", score: 94,
    scores: { token: 6, value: 9, heat: 10 },
    badges: ["Re-farm", "Early Bonus", "Free Path"], riskCount: 0,
    chains: [],
    funding: "$30M", tasksDone: 12, tasksTotal: 66, heat: 2081, updatedAgo: "6d",
    suitableFor: ["Free", "Multi-acc", "Low budget"],
    tasks: [
      { name: "Doma Agentic Engine Waitlist", type: "form", cost: "Free", time: "3 min", url: "https://tally.so/r/EkBO44" }
    ],
    leadVCs: ["Paradigm", "Coinbase Ventures", "Sandeep Nailwal", "Dharmesh Shah"],
    fundingRound: "Series A", fundingDate: "2025-01-29",
    websiteUrl: "https://d3.xyz", twitterUrl: "https://twitter.com/d3xyz",
    isListed: false,
  },
  {
    id: 4, rank: 4,
    name: "Backed (xStocks)", slug: "backed-xstocks", ticker: "",
    logoUrl: "https://pbs.twimg.com/profile_images/1899781129630085120/DByhLgsJ_normal.jpg",
    logoInitial: "BK", logoColor: "#10b981",
    tier: "S", score: 93,
    scores: { token: 10, value: 10, heat: 10 },
    badges: ["Official", "Active"], riskCount: 1,
    chains: [],
    funding: "$12.7M", tasksDone: 7, tasksTotal: 7, heat: 6564, updatedAgo: "5d",
    suitableFor: ["Free", "Leaderboard", "Multi-acc", "Community"],
    tasks: [
      { name: "Registration in the xPoints Program", type: "form", cost: "Free", time: "2 min", url: "https://defi.xstocks.fi/points?ref=KWIOVROE" }
    ],
    leadVCs: ["Gnosis", "Kraken", "Stake Capital Group", "Blockchain Founders Fund"],
    fundingRound: "M&A", fundingDate: "2025-12-02",
    websiteUrl: "https://xstocks.fi", twitterUrl: "https://twitter.com/BackedFi",
    isListed: false,
  },
  {
    id: 5, rank: 5,
    name: "Variational", slug: "variational", ticker: "",
    logoUrl: "https://pbs.twimg.com/profile_images/2043791079191740416/pHCCas5p_normal.jpg",
    logoInitial: "VA", logoColor: "#f97316",
    tier: "S", score: 92,
    scores: { token: 10, value: 7, heat: 10 },
    badges: ["Official", "Active"], riskCount: 0,
    chains: [],
    funding: "$11.8M", tasksDone: 2, tasksTotal: 4, heat: 6897, updatedAgo: "6d",
    suitableFor: ["Leaderboard", "Low budget"],
    tasks: [
      { name: "Mainnet (Private Beta)", type: "mainnet", cost: "$15", time: "10 min", url: "https://omni.variational.io/?ref=OMNIRANK" }
    ],
    leadVCs: ["Dragonfly", "Coinbase Ventures", "Mirana Ventures", "Caladan"],
    fundingRound: "Series A", fundingDate: "2026-05-20",
    websiteUrl: "https://variational.io", twitterUrl: "https://twitter.com/variationalio",
    isListed: false,
  },
  {
    id: 6, rank: 6,
    name: "BULK", slug: "bulk", ticker: "",
    logoUrl: "https://pbs.twimg.com/profile_images/1943697740480806912/Hd0Zf8Y6_normal.jpg",
    logoInitial: "BK", logoColor: "#ec4899",
    tier: "S", score: 92,
    scores: { token: 10, value: 10, heat: 10 },
    badges: ["Re-farm", "Official", "Active", "Free Path"], riskCount: 2,
    chains: [],
    funding: "$8M", tasksDone: 7, tasksTotal: 7, heat: 4615, updatedAgo: "5d",
    suitableFor: ["Free", "Leaderboard", "Multi-acc", "Community", "Technical"],
    tasks: [
      { name: "Trading on Bulk", type: "testnet", cost: "Free", time: "10 min", url: "https://early.bulk.trade/" }
    ],
    leadVCs: ["Robot Ventures", "Mirana Ventures", "Big Brain Holdings", "Wintermute"],
    fundingRound: "Seed", fundingDate: "2025-09-24",
    websiteUrl: "https://bulk.trade", twitterUrl: "https://twitter.com/junbug_sol",
    isListed: false,
  },
  {
    id: 7, rank: 7,
    name: "Startale", slug: "startale", ticker: "",
    logoUrl: "https://pbs.twimg.com/profile_images/2005923179227930624/D5E5uk3g_normal.jpg",
    logoInitial: "ST", logoColor: "#0284c7",
    tier: "S", score: 84,
    scores: { token: 6, value: 10, heat: 10 },
    badges: ["Official", "Active"], riskCount: 0,
    chains: [],
    funding: "$70M", tasksDone: 6, tasksTotal: 6, heat: 1696, updatedAgo: "10d",
    suitableFor: ["Free", "Leaderboard", "Multi-acc", "Low budget"],
    tasks: [
      { name: "STAR Points", type: "liquidity", cost: "Free", time: "15 min", url: "https://app.startale.com/sign-up?code=LIZJBK16" }
    ],
    leadVCs: ["Sony Innovation Fund", "Signum Capital", "SamsungNext"],
    fundingRound: "Series A", fundingDate: "2026-03-26",
    websiteUrl: "https://startale.com", twitterUrl: "https://twitter.com/StartaleGroup",
    isListed: false,
  },
  {
    id: 8, rank: 8,
    name: "Kii Chain", slug: "kii-chain", ticker: "KII",
    logoUrl: "https://pbs.twimg.com/profile_images/1800553180083666944/zZe128CW_normal.jpg",
    logoInitial: "KC", logoColor: "#7c3aed",
    tier: "S", score: 80,
    scores: { token: 9, value: 10, heat: 10 },
    badges: ["Re-farm", "Official", "Active", "Free Path"], riskCount: 0,
    chains: [],
    funding: "$20.1M", tasksDone: 6, tasksTotal: 7, heat: 1583, updatedAgo: "11d",
    suitableFor: ["Free", "Multi-acc", "Low budget", "Community", "Technical"],
    tasks: [
      { name: "Incentivized Testnet (S2)", type: "testnet", cost: "Free", time: "10 min", url: "https://kiichain.io/testnet?refer=DrophuntingCR" }
    ],
    leadVCs: ["Nimbus Capital"],
    fundingRound: "Undisclosed", fundingDate: "2025-06-17",
    websiteUrl: "https://kiichain.io", twitterUrl: "https://twitter.com/KiiChain",
    isListed: false,
  },
  {
    id: 9, rank: 9,
    name: "MegaETH", slug: "megaeth", ticker: "MEGA",
    logoUrl: "https://pbs.twimg.com/profile_images/1861751545790070784/Kv1xTzAq_normal.jpg",
    logoInitial: "ME", logoColor: "#e11d48",
    tier: "A", score: 78,
    scores: { token: 7, value: 9, heat: 10 },
    badges: ["Re-farm", "Early Bonus", "Free Path"], riskCount: 0,
    chains: ["MegaETH"],
    funding: "$107.7M", tasksDone: 4, tasksTotal: 10, heat: 23181, updatedAgo: "26d",
    suitableFor: ["Free", "Leaderboard", "Multi-acc", "Low budget", "Technical"],
    tasks: [
      { name: "MegaETH Testnet", type: "testnet", cost: "Free", time: "24 min", url: "https://testnet.megaeth.com/#5" }
    ],
    leadVCs: ["Dragonfly", "Coinbase Ventures", "Robot Ventures"],
    fundingRound: "Series A", fundingDate: "2025-03-27",
    websiteUrl: "https://megaeth.com", twitterUrl: "https://twitter.com/megaeth_labs",
    isListed: false,
  },
];

export const mockNews: any[]     = [];
export const mockTasks: any[]    = [];
export const mockActivity: any[] = [];
export const mockArticles: any[] = [];

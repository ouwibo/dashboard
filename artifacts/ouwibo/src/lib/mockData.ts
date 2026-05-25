export interface AirdropTask {
  name: string;
  types: string[];
  cost: number;       // 0 = free
  timeMin: number;
  url: string;
}

export interface Airdrop {
  id: number;
  slug: string;
  name: string;
  ticker?: string;
  logoUrl: string;          // unavatar.io/twitter/{handle}
  logoColor: string;        // fallback bg color
  logoInitial: string;      // fallback text
  isNew: boolean;
  status: "Confirmed" | "Potential" | "Reward Available";
  statusDate: string;
  rewardType: "Airdrop" | "Whitelist/Waitlist" | "Points" | "Token Sale" | "NFT";
  raiseFunds?: string;
  backers?: { color: string; initial: string }[];
  backersExtra?: number;
  tasks: AirdropTask[];
}

export const mockAirdrops: Airdrop[] = [
  {
    id: 1, slug: "strato",
    name: "STRATO", ticker: "STRATO",
    logoUrl: "https://unavatar.io/twitter/strato_net",
    logoColor: "#2563eb", logoInitial: "ST", isNew: true,
    status: "Confirmed", statusDate: "May 25, 2026",
    rewardType: "Points", raiseFunds: undefined,
    tasks: [
      { name: "Provide Liquidity to Swap Pools", types: ["Liquidity"],    cost: 50,  timeMin: 15, url: "https://strato.nexus/app" },
      { name: "Mint USDST via CDP",              types: ["Mainnet"],      cost: 100, timeMin: 10, url: "https://strato.nexus/app" },
      { name: "Deposit in Lending Pool",         types: ["Staking"],      cost: 20,  timeMin: 5,  url: "https://strato.nexus/app" },
    ],
  },
  {
    id: 2, slug: "netrun",
    name: "Netrun",
    logoUrl: "https://unavatar.io/twitter/netrun_xyz",
    logoColor: "#374151", logoInitial: "NR", isNew: false,
    status: "Potential", statusDate: "May 25, 2026",
    rewardType: "Airdrop",
    tasks: [
      { name: "Apply & Join Testnet",    types: ["Testnet"], cost: 0, timeMin: 5,  url: "https://join.netrun.xyz" },
      { name: "Create Tokens & NFTs",    types: ["Testnet"], cost: 0, timeMin: 20, url: "https://app.netrun.xyz" },
      { name: "Set Up Domain on Netrun", types: ["Testnet"], cost: 0, timeMin: 10, url: "https://app.netrun.xyz" },
    ],
  },
  {
    id: 3, slug: "boost-rabbithole",
    name: "Boost (RabbitHole)",
    logoUrl: "https://unavatar.io/twitter/rabbithole_gg",
    logoColor: "#16a34a", logoInitial: "BR", isNew: false,
    status: "Confirmed", statusDate: "May 25, 2026",
    rewardType: "Whitelist/Waitlist", raiseFunds: "$21.60M",
    backers: [
      { color: "#8b5cf6", initial: "M" },
      { color: "#f59e0b", initial: "P" },
      { color: "#10b981", initial: "G" },
    ],
    backersExtra: 10,
    tasks: [
      { name: "Fill Waitlist Form", types: ["Fill The Form"], cost: 0, timeMin: 3, url: "https://www.rabbithole.gg" },
    ],
  },
  {
    id: 4, slug: "hotstuff",
    name: "Hotstuff (Prev. Syndr Protocol)",
    logoUrl: "",
    logoColor: "#1f2937", logoInitial: "HS", isNew: false,
    status: "Potential", statusDate: "May 25, 2026",
    rewardType: "Airdrop",
    backers: [
      { color: "#f97316", initial: "O" },
      { color: "#8b5cf6", initial: "V" },
    ],
    backersExtra: 21,
    tasks: [
      { name: "Trade Perpetuals (Points Program)", types: ["Trading"],   cost: 80,  timeMin: 60, url: "https://app.hotstuff.xyz" },
      { name: "Provide Liquidity to Vault",        types: ["Liquidity"], cost: 100, timeMin: 15, url: "https://app.hotstuff.xyz" },
      { name: "Complete Trading Expeditions",      types: ["Mainnet"],   cost: 0,   timeMin: 20, url: "https://app.hotstuff.xyz" },
      { name: "Referral Program",                  types: ["Social"],    cost: 0,   timeMin: 5,  url: "https://app.hotstuff.xyz" },
    ],
  },
  {
    id: 5, slug: "popdex",
    name: "PopDEX",
    logoUrl: "",
    logoColor: "#7c3aed", logoInitial: "PD", isNew: false,
    status: "Potential", statusDate: "May 25, 2026",
    rewardType: "Airdrop", raiseFunds: "$30.00M",
    backers: [
      { color: "#7c3aed", initial: "P" },
    ],
    tasks: [
      { name: "Complete Social Missions", types: ["Social"],    cost: 0, timeMin: 16, url: "https://popdex.io" },
      { name: "Trade on PopDEX Testnet",  types: ["Testnet"],   cost: 0, timeMin: 20, url: "https://app.popdex.io" },
    ],
  },
  {
    id: 6, slug: "beep",
    name: "Beep",
    logoUrl: "https://unavatar.io/twitter/beep_fi",
    logoColor: "#db2777", logoInitial: "BP", isNew: false,
    status: "Confirmed", statusDate: "May 25, 2026",
    rewardType: "Airdrop",
    tasks: [
      { name: "Trade on Beep (Earn Points)", types: ["Trading"], cost: 78, timeMin: 70, url: "https://beep.fi" },
      { name: "Provide Liquidity",           types: ["Liquidity"], cost: 50, timeMin: 20, url: "https://beep.fi/pools" },
    ],
  },
  {
    id: 7, slug: "solstice",
    name: "Solstice", ticker: "SLX",
    logoUrl: "https://unavatar.io/twitter/Solstice_SLX",
    logoColor: "#0f172a", logoInitial: "SL", isNew: false,
    status: "Reward Available", statusDate: "May 25, 2026",
    rewardType: "Airdrop", raiseFunds: "$371.04K",
    backers: [
      { color: "#f59e0b", initial: "B" },
    ],
    tasks: [
      { name: "Claim $SLX Airdrop (TGE Live)", types: ["Mainnet"], cost: 0, timeMin: 5, url: "https://app.solstice.fi/claim" },
    ],
  },
  {
    id: 8, slug: "nado",
    name: "Nado", ticker: "NADO",
    logoUrl: "https://unavatar.io/twitter/nadodex",
    logoColor: "#1d4ed8", logoInitial: "ND", isNew: false,
    status: "Confirmed", statusDate: "May 22, 2026",
    rewardType: "Airdrop",
    tasks: [
      { name: "Trade Perpetuals on Nado (Ink L2)", types: ["Trading"],   cost: 50, timeMin: 30, url: "https://app.nado.xyz" },
      { name: "Provide Liquidity to NLP Vault",    types: ["Liquidity"], cost: 50, timeMin: 15, url: "https://app.nado.xyz/vault" },
      { name: "Lend & Borrow Assets",              types: ["Staking"],   cost: 20, timeMin: 10, url: "https://app.nado.xyz/lend" },
    ],
  },
  {
    id: 9, slug: "k25ai",
    name: "K25.ai",
    logoUrl: "https://unavatar.io/twitter/k25ai",
    logoColor: "#0f172a", logoInitial: "K2", isNew: true,
    status: "Confirmed", statusDate: "May 22, 2026",
    rewardType: "Whitelist/Waitlist", raiseFunds: "$2.00M",
    tasks: [
      { name: "Register Waitlist", types: ["Fill The Form"], cost: 0, timeMin: 2, url: "https://k25.ai" },
    ],
  },
  {
    id: 10, slug: "grove",
    name: "Grove",
    logoUrl: "https://unavatar.io/twitter/groveprotocol",
    logoColor: "#92400e", logoInitial: "GR", isNew: true,
    status: "Confirmed", statusDate: "May 21, 2026",
    rewardType: "Points",
    tasks: [
      { name: "Hold Assets to Earn Points", types: ["Hold"],      cost: 100, timeMin: 5,  url: "https://grove.fi" },
      { name: "Complete Daily Check-in",    types: ["Social"],    cost: 0,   timeMin: 2,  url: "https://grove.fi/checkin" },
    ],
  },
  {
    id: 11, slug: "konnex",
    name: "Konnex", ticker: "KNX",
    logoUrl: "https://unavatar.io/twitter/konnex_world",
    logoColor: "#374151", logoInitial: "KX", isNew: false,
    status: "Confirmed", statusDate: "May 21, 2026",
    rewardType: "Airdrop", raiseFunds: "$15.00M",
    backers: [
      { color: "#3b82f6", initial: "C" },
      { color: "#10b981", initial: "L" },
      { color: "#f59e0b", initial: "L" },
    ],
    tasks: [
      { name: "Complete Social Missions", types: ["Social"],    cost: 0, timeMin: 15, url: "https://konnex.world" },
      { name: "Daily Leaderboard Tasks",  types: ["Social"],    cost: 0, timeMin: 10, url: "https://konnex.world/daily" },
      { name: "Join & Refer Friends",     types: ["Social"],    cost: 0, timeMin: 5,  url: "https://konnex.world/refer" },
    ],
  },
  {
    id: 12, slug: "sui",
    name: "Sui", ticker: "SUI",
    logoUrl: "https://unavatar.io/twitter/SuiNetwork",
    logoColor: "#3b82f6", logoInitial: "SU", isNew: true,
    status: "Potential", statusDate: "May 21, 2026",
    rewardType: "Airdrop", raiseFunds: "$405.37M",
    backers: [
      { color: "#3b82f6", initial: "a" },
      { color: "#8b5cf6", initial: "6" },
      { color: "#f59e0b", initial: "M" },
    ],
    backersExtra: 8,
    tasks: [
      { name: "Fill Ecosystem Airdrop Form", types: ["Fill The Form"], cost: 0, timeMin: 15, url: "https://sui.io/ecosystem" },
      { name: "Use Sui DeFi Apps",           types: ["Mainnet"],       cost: 0, timeMin: 30, url: "https://sui.io/apps" },
      { name: "Join Sui Discord & Quests",   types: ["Social"],        cost: 0, timeMin: 15, url: "https://discord.gg/sui" },
    ],
  },
];

export const mockNews:     any[] = [];
export const mockTasks:    any[] = [];
export const mockActivity: any[] = [];
export const mockArticles: any[] = [];

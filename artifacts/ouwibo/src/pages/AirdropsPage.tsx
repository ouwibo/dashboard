import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { mockAirdrops } from "@/lib/mockData";
import type { Airdrop, AirdropTask } from "@/lib/mockData";
import { ChevronRight, ExternalLink } from "lucide-react";

/* ── Chain icons ── */
const CHAIN_ICON: Record<string, string> = {
  Ethereum:  "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
  Base:      "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
  Solana:    "https://icons.llamao.fi/icons/chains/rsz_solana.jpg",
  Arbitrum:  "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
  BNB:       "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
  Sui:       "https://icons.llamao.fi/icons/chains/rsz_sui.jpg",
  Monad:     "https://icons.llamao.fi/icons/chains/rsz_monad.jpg",
  HyperEVM:  "https://icons.llamao.fi/icons/chains/rsz_hyperliquid.jpg",
  Bera:      "https://icons.llamao.fi/icons/chains/rsz_berachain.jpg",
  Aptos:     "https://icons.llamao.fi/icons/chains/rsz_aptos.jpg",
  Starknet:  "https://icons.llamao.fi/icons/chains/rsz_starknet.jpg",
  Abstract:  "https://icons.llamao.fi/icons/chains/rsz_abstract.jpg",
  MegaETH:   "https://icons.llamao.fi/icons/chains/rsz_megaeth.jpg",
};

/* ── Badge / tag styles ── */
const TIER_CLS: Record<string, string> = {
  S: "bg-amber-500 text-white",
  A: "bg-blue-500 text-white",
  B: "bg-slate-500 text-white",
  C: "bg-slate-400 text-white",
};
const BADGE_CLS: Record<string, string> = {
  "Official":    "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  "Active":      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  "Early Bonus": "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
  "Re-farm":     "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
  "Free Path":   "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20",
  "Listed":      "text-slate-500 bg-slate-100 dark:bg-slate-800",
};
const SUITABLE_CLS: Record<string, string> = {
  "Free":       "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  "Multi-acc":  "text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  "Leaderboard":"text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Low budget": "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "Community":  "text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  "Technical":  "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
};
const TYPE_CLS: Record<string, string> = {
  form:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  trading:     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  testnet:     "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  social:      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  liquidity:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  staking:     "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  mint:        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  ambassador:  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  bounty:      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  mainnet:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  predictions: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  game:        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  deploy:      "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
};
const SCORE_CLS = (v: number) =>
  v >= 9 ? "text-emerald-500" : v >= 7 ? "text-amber-500" : "text-red-400";

/* ── Small reusable atoms ── */
function TierBadge({ tier }: { tier: string }) {
  return (
    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", TIER_CLS[tier])}>
      {tier}
    </span>
  );
}
function StatusBadge({ badge }: { badge: string }) {
  return (
    <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full", BADGE_CLS[badge] ?? "text-muted-foreground bg-muted")}>
      {badge}
    </span>
  );
}
function SuitableTag({ tag }: { tag: string }) {
  return (
    <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full border", SUITABLE_CLS[tag] ?? "text-muted-foreground border-border")}>
      {tag}
    </span>
  );
}
function TypeTag({ type }: { type: string }) {
  return (
    <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded", TYPE_CLS[type] ?? "bg-muted text-muted-foreground")}>
      {type}
    </span>
  );
}
function ChainImg({ chain }: { chain: string }) {
  const src = CHAIN_ICON[chain];
  return src
    ? <img src={src} alt={chain} title={chain} className="w-3.5 h-3.5 rounded-full inline-block" />
    : <span className="text-[9px] border border-border rounded-full px-1 text-muted-foreground">{chain[0]}</span>;
}
function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center bg-muted/60 rounded px-1.5 py-1 min-w-[36px]">
      <span className={cn("text-[11px] font-bold leading-none", SCORE_CLS(value))}>{value}</span>
      <span className="text-[8px] text-muted-foreground mt-0.5 leading-none">{label}</span>
    </div>
  );
}

/* ── Main row component ── */
function AirdropRow({ drop }: { drop: Airdrop }) {
  const topTask = drop.tasks[0] as AirdropTask | undefined;
  return (
    <Link href={`/airdrops/${drop.slug}`}>
      <div className="border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer group px-3 py-3 flex gap-3 items-start">

        {/* Col 1 — Rank + Logo + Identity */}
        <div className="flex items-start gap-2 w-[210px] shrink-0">
          <span className="text-[10px] text-muted-foreground font-mono w-5 shrink-0 pt-1 text-right">
            #{drop.rank}
          </span>
          <div
            className="w-9 h-9 rounded-xl shrink-0 overflow-hidden flex items-center justify-center text-white font-bold text-[11px]"
            style={{ background: drop.logoColor }}
          >
            {drop.logoUrl
              ? <img src={drop.logoUrl} alt={drop.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : drop.logoInitial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap leading-tight">
              <span className="font-semibold text-[13px] truncate">{drop.name}</span>
              {drop.ticker && <span className="text-[11px] text-muted-foreground">${drop.ticker}</span>}
              <TierBadge tier={drop.tier} />
              {drop.isListed && <StatusBadge badge="Listed" />}
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-0.5">
              {drop.badges.map(b => <StatusBadge key={b} badge={b} />)}
              {drop.riskCount > 0 && (
                <span className="text-[9px] text-amber-500 font-medium">⚠ {drop.riskCount} risk</span>
              )}
              {drop.chains.map(c => <ChainImg key={c} chain={c} />)}
            </div>
          </div>
        </div>

        {/* Col 2 — Details */}
        <div className="flex-1 min-w-0 space-y-1.5">

          {/* Stats */}
          <div className="flex items-center gap-3 flex-wrap text-[11px]">
            <span className="text-muted-foreground">
              Funding <strong className="text-foreground font-semibold">{drop.funding}</strong>
            </span>
            <span className="text-muted-foreground">
              Tasks <strong className="text-foreground font-semibold">{drop.tasksDone}/{drop.tasksTotal}</strong>
            </span>
            <span className="text-muted-foreground">
              Heat <strong className="text-foreground font-semibold">{drop.heat.toLocaleString()}</strong>
            </span>
            <span className="text-muted-foreground">
              Updated <strong className="text-foreground font-semibold">{drop.updatedAgo}</strong>
            </span>
          </div>

          {/* Suitable for */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-muted-foreground mr-0.5">Best for ·</span>
            {drop.suitableFor.map(s => <SuitableTag key={s} tag={s} />)}
          </div>

          {/* Top task */}
          {topTask && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-primary font-bold">✦</span>
              <span className="text-[12px] font-medium">{topTask.name}</span>
              <TypeTag type={topTask.type} />
              <span className={cn("text-[10px] font-semibold", topTask.cost === "Free" ? "text-emerald-500" : "text-amber-500")}>
                {topTask.cost}
              </span>
              <span className="text-[10px] text-muted-foreground">· {topTask.time}</span>
              <a
                href={topTask.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="ml-1 text-[10px] px-2.5 py-0.5 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                Go <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          )}

          {/* VCs + Round */}
          <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
            <span className="text-muted-foreground">Lead VC:</span>
            {drop.leadVCs.length === 0
              ? <span className="text-muted-foreground italic">Undisclosed</span>
              : <>
                  {drop.leadVCs.slice(0, 3).map(vc => (
                    <span key={vc} className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{vc}</span>
                  ))}
                  {drop.leadVCs.length > 3 && (
                    <span className="text-muted-foreground">+{drop.leadVCs.length - 3}</span>
                  )}
                </>
            }
            {drop.fundingRound && (
              <span className="text-muted-foreground ml-1">· {drop.fundingRound} {drop.fundingDate}</span>
            )}
          </div>
        </div>

        {/* Col 3 — Scores */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <div className="text-[11px] font-bold">
            <span className="text-primary">{drop.score}</span>
            <span className="text-muted-foreground">/100 · </span>
            <TierBadge tier={drop.tier} />
          </div>
          <div className="flex gap-1">
            <ScoreBox label="Token"  value={drop.scores.token} />
            <ScoreBox label="Value"  value={drop.scores.value} />
            <ScoreBox label="Heat"   value={drop.scores.heat}  />
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

      </div>
    </Link>
  );
}

/* ── Tabs ── */
const TABS = ["Potential", "TGE Soon", "Not Listed", "New Today", "Funding", "OKX Boost", "Binance"];
const TYPES = ["All", "Trading", "Token Drop", "Points", "Whitelist", "NFT", "Testnet", "Mainnet", "Social", "Staking", "DePIN", "Gambling"];
const CHAINS = ["All", "Ethereum", "Base", "Solana", "Arbitrum", "BNB", "Sui", "Monad", "HyperEVM"];

/* ── Page ── */
export default function AirdropsPage() {
  const [tab, setTab]       = useState("Potential");
  const [chain, setChain]   = useState("All");
  const [type, setType]     = useState("All");

  const active = mockAirdrops.filter(d =>
    (chain === "All" || d.chains.includes(chain)) &&
    (type  === "All" || d.tasks.some(t => t.type === type.toLowerCase()))
  );

  return (
    <div className="-mx-4 -my-6">

      {/* ── Header ── */}
      <div className="px-4 pt-5 pb-3 border-b border-border">
        <div className="flex items-baseline gap-2 mb-1">
          <h1 className="text-[15px] font-bold">Airdrop Radar</h1>
          <span className="text-[11px] text-muted-foreground">Sorted by Funding · Heat · Updated</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Active {mockAirdrops.length}</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-semibold">{mockAirdrops.filter(d => !d.isListed).length} Not Listed</span>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="flex overflow-x-auto border-b border-border scrollbar-hide">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 px-4 py-2.5 text-[12px] font-medium transition-colors border-b-2 whitespace-nowrap",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Chain filter ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border overflow-x-auto scrollbar-hide">
        {CHAINS.map(c => (
          <button
            key={c}
            onClick={() => setChain(c)}
            className={cn(
              "shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors",
              chain === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {c === "All"
              ? <span className="text-primary font-bold">✦</span>
              : CHAIN_ICON[c] && <img src={CHAIN_ICON[c]} alt={c} className="w-3.5 h-3.5 rounded-full" />
            }
            {c}
          </button>
        ))}
      </div>

      {/* ── Type filter ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border overflow-x-auto scrollbar-hide">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border",
              type === t
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Data source note ── */}
      <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border bg-muted/30">
        Source: CryptoRank · {active.length} projects · Click row to see all tasks
      </div>

      {/* ── List ── */}
      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <p className="text-3xl">🪂</p>
          <p className="text-[14px] font-semibold">No airdrops yet</p>
          <p className="text-[12px] text-muted-foreground">Admin can add new airdrops from the Write panel.</p>
        </div>
      ) : (
        <div>
          {active.map(drop => <AirdropRow key={drop.id} drop={drop} />)}
        </div>
      )}
    </div>
  );
}

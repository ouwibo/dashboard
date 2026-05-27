import { useState, useEffect } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { mockAirdrops } from "@/lib/mockData";
import type { Airdrop } from "@/lib/mockData";
import {
  Star, ChevronRight, Search,
  CheckCircle2, HelpCircle, Banknote, Clock, DollarSign,
  ExternalLink, Zap,
} from "lucide-react";

/* ── Status config ── */
const STATUS_CONFIG = {
  "Confirmed":        { icon: CheckCircle2, cls: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  "Potential":        { icon: HelpCircle,   cls: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20"   },
  "Reward Available": { icon: Banknote,     cls: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20"     },
} as const;

/* ── Reward type ── */
const REWARD_CLS: Record<string, string> = {
  "Airdrop":           "bg-primary/10 text-primary border-primary/20",
  "Whitelist/Waitlist":"bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Points":            "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Token Sale":        "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "NFT":               "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

/* ── Task type badge ── */
const TYPE_CLS: Record<string, string> = {
  "Fill The Form": "bg-blue-500/10 text-blue-400",
  "Trading":       "bg-green-500/10 text-green-400",
  "Testnet":       "bg-purple-500/10 text-purple-400",
  "Social":        "bg-pink-500/10 text-pink-400",
  "Liquidity":     "bg-amber-500/10 text-amber-400",
  "Staking":       "bg-indigo-500/10 text-indigo-400",
  "Mainnet":       "bg-emerald-500/10 text-emerald-400",
  "Hold":          "bg-orange-500/10 text-orange-400",
  "Referral":      "bg-cyan-500/10 text-cyan-400",
  "Community":     "bg-rose-500/10 text-rose-400",
};

/* ── Project Logo ── */
function ProjectLogo({ airdrop, size = 44 }: { airdrop: Airdrop; size?: number }) {
  const [failed, setFailed] = useState(false);
  const s = `${size}px`;
  return (
    <div
      className="rounded-2xl flex items-center justify-center text-white font-bold overflow-hidden shrink-0 border border-white/10"
      style={{ width: s, height: s, background: airdrop.logoColor, fontSize: size * 0.32 }}
    >
      {airdrop.logoUrl && !failed
        ? <img src={airdrop.logoUrl} alt={airdrop.name} className="w-full h-full object-cover"
                onError={() => setFailed(true)} />
        : airdrop.logoInitial}
    </div>
  );
}

/* ── Single backer avatar (state lives at item level, not inside map) ── */
function BackerAvatar({ name, logoUrl, initial, color, zIndex }: {
  name: string; logoUrl: string; initial: string; color: string; zIndex: number;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      title={name}
      className="w-6 h-6 rounded-full overflow-hidden border-2 border-background flex items-center justify-center text-white font-bold shrink-0"
      style={{ background: color, marginLeft: zIndex < 5 ? "-6px" : 0, zIndex, fontSize: "8px" }}
    >
      {logoUrl && !failed
        ? <img src={logoUrl} alt={name} className="w-full h-full object-cover" onError={() => setFailed(true)} />
        : initial}
    </div>
  );
}

/* ── Backer Row ── */
function BackerRow({ airdrop }: { airdrop: Airdrop }) {
  const backers = airdrop.backers ?? [];
  const extra = airdrop.backersExtra ?? 0;
  if (!backers.length && !extra) return <span className="text-[11px] text-muted-foreground/40">No backers listed</span>;
  return (
    <div className="flex items-center">
      {backers.slice(0, 4).map((b, i) => (
        <BackerAvatar
          key={i}
          name={b.name}
          logoUrl={b.logoUrl}
          initial={b.initial}
          color={b.color}
          zIndex={5 - i}
        />
      ))}
      {extra > 0 && (
        <span className="text-[10px] text-muted-foreground font-medium ml-2">+{extra} more</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   AIRDROP CARD
══════════════════════════════════════════════ */
function AirdropCard({ airdrop, bookmarked, onToggle }: {
  airdrop: Airdrop;
  bookmarked: boolean;
  onToggle: () => void;
}) {
  const status = STATUS_CONFIG[airdrop.status];
  const StatusIcon = status.icon;
  const topTask = airdrop.tasks[0];
  const totalCost = airdrop.tasks.reduce((sum, t) => sum + t.cost, 0);
  const totalTime = airdrop.tasks.reduce((sum, t) => sum + t.timeMin, 0);

  return (
    <Link href={`/airdrops/${airdrop.slug}`} className="block group">
      <div className="relative flex flex-col rounded-2xl bg-card border border-border/60 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 hover:border-border active:translate-y-0 active:scale-[0.99]">

        {/* Glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl" />

        {/* ── Header ── */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="transition-transform duration-300 group-hover:scale-105 shrink-0">
                <ProjectLogo airdrop={airdrop} size={48} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="font-bold text-[15px] leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 truncate">
                    {airdrop.name}
                  </span>
                  {airdrop.isNew && (
                    <span className="shrink-0 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                      NEW
                    </span>
                  )}
                </div>
                {airdrop.ticker && (
                  <span className="text-[11px] text-muted-foreground font-medium">{airdrop.ticker}</span>
                )}
              </div>
            </div>

            {/* Star bookmark */}
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
              className={cn(
                "shrink-0 p-1.5 rounded-lg transition-all duration-200 hover:scale-110",
                bookmarked ? "text-amber-400 bg-amber-400/10" : "text-muted-foreground/30 hover:text-amber-300 hover:bg-muted/50"
              )}
            >
              <Star className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* ── Status + Reward badges ── */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border", status.bg, status.cls)}>
              <StatusIcon className="w-3 h-3" />
              {airdrop.status}
            </span>
            <span className={cn("inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-lg border", REWARD_CLS[airdrop.rewardType] ?? "bg-muted text-muted-foreground border-border")}>
              {airdrop.rewardType}
            </span>
            {airdrop.raiseFunds && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-foreground/80 bg-muted/50 px-2 py-1 rounded-lg border border-border/40">
                <Zap className="w-2.5 h-2.5 text-amber-400" />
                {airdrop.raiseFunds} raised
              </span>
            )}
          </div>

          {/* ── Cost + Time summary ── */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1 text-[11px]">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className={totalCost === 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {totalCost === 0 ? "Free" : `$${totalCost}`}
              </span>
            </div>
            <div className="w-px h-3 bg-border/60" />
            <div className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-foreground/70 font-medium">{totalTime} min total</span>
            </div>
            <div className="w-px h-3 bg-border/60" />
            <div className="text-[11px] text-muted-foreground font-medium">
              {airdrop.tasks.length} task{airdrop.tasks.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* ── Task list (top 2) ── */}
          {airdrop.tasks.length > 0 ? (
            <div className="space-y-1.5 mb-3">
              {airdrop.tasks.slice(0, 2).map((task, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 py-2 border border-border/30 group-hover:bg-muted/50 transition-colors duration-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="text-[11px] font-medium flex-1 truncate">{task.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {task.types.slice(0, 1).map(t => (
                      <span key={t} className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", TYPE_CLS[t] ?? "bg-muted text-muted-foreground")}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {airdrop.tasks.length > 2 && (
                <div className="text-[10px] text-muted-foreground text-center py-0.5">
                  +{airdrop.tasks.length - 2} more tasks
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted/20 rounded-xl px-3 py-2.5 mb-3 border border-border/20 text-center">
              <span className="text-[11px] text-muted-foreground">No active tasks</span>
            </div>
          )}

          {/* ── Backers ── */}
          {(airdrop.backers?.length ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium shrink-0">Backed by</span>
              <BackerRow airdrop={airdrop} />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="mt-auto border-t border-border/40 px-4 py-2.5 flex items-center justify-between bg-muted/10 group-hover:bg-primary/5 transition-colors duration-300">
          <span className="text-[10px] text-muted-foreground">{airdrop.statusDate}</span>
          <span className="text-[11px] font-bold text-primary flex items-center gap-0.5 group-hover:gap-1 transition-all duration-200">
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const FILTER_TABS = ["All", "Confirmed", "Potential", "Reward Available"] as const;
const REWARD_TABS = ["All", "Airdrop", "Whitelist/Waitlist", "Points", "Token Sale"] as const;

export default function AirdropsPage() {
  const [tab,       setTab]       = useState<string>("All");
  const [rewardTab, setRewardTab] = useState<string>("All");
  const [search,    setSearch]    = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setBookmarks(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = mockAirdrops.filter(a => {
    if (tab !== "All" && a.status !== tab) return false;
    if (rewardTab !== "All" && a.rewardType !== rewardTab) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    confirmed: mockAirdrops.filter(a => a.status === "Confirmed").length,
    potential: mockAirdrops.filter(a => a.status === "Potential").length,
    reward:    mockAirdrops.filter(a => a.status === "Reward Available").length,
  };

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight mb-1">Airdrop Radar</h1>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-emerald-400 font-semibold">{counts.confirmed} Confirmed</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-amber-400 font-semibold">{counts.potential} Potential</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-blue-400 font-semibold">{counts.reward} Reward Available</span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="space-y-2">
        {/* Status tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_TABS.map(t => {
            const cfg = t !== "All" ? STATUS_CONFIG[t] : null;
            const Icon = cfg?.icon;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border",
                  tab === t
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "text-muted-foreground border-border/40 hover:border-border hover:text-foreground bg-muted/20"
                )}
              >
                {Icon && <Icon className="w-2.5 h-2.5" />}
                {t}
              </button>
            );
          })}

          {/* Search */}
          <div className="ml-auto flex items-center gap-1.5 bg-muted/30 border border-border/40 rounded-full px-3 py-1.5">
            <Search className="w-3 h-3 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="text-[11px] bg-transparent outline-none w-36 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Reward type tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {REWARD_TABS.map(t => (
            <button
              key={t}
              onClick={() => setRewardTab(t)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border",
                rewardTab === t
                  ? "text-primary bg-primary/10 border-primary/30"
                  : "text-muted-foreground border-transparent hover:border-border/40 hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Search className="w-10 h-10 opacity-20" />
          <p className="text-[13px]">No airdrops match your filter</p>
          <button
            onClick={() => { setTab("All"); setRewardTab("All"); setSearch(""); }}
            className="text-[11px] text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-[11px] text-muted-foreground">{filtered.length} airdrop{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(a => (
              <AirdropCard
                key={a.id}
                airdrop={a}
                bookmarked={bookmarks.has(a.id)}
                onToggle={() => toggle(a.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

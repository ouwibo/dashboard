import { useState, useEffect } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { mockAirdrops } from "@/lib/mockData";
import type { Airdrop, Backer } from "@/lib/mockData";
import {
  Star, ChevronRight, Search, LayoutList, LayoutGrid,
  CheckCircle2, HelpCircle, Banknote, Clock, DollarSign, Zap,
} from "lucide-react";

/* ── Status ── */
const STATUS_ICON = {
  "Confirmed":        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
  "Potential":        <HelpCircle   className="w-3.5 h-3.5 text-amber-400  shrink-0" />,
  "Reward Available": <Banknote     className="w-3.5 h-3.5 text-blue-400   shrink-0" />,
} as const;

const STATUS_CLS = {
  "Confirmed":        "text-emerald-500",
  "Potential":        "text-amber-400",
  "Reward Available": "text-blue-400 font-semibold",
} as const;

/* ── Reward type ── */
const REWARD_CLS: Record<string, string> = {
  "Airdrop":           "text-primary",
  "Whitelist/Waitlist":"text-purple-400",
  "Points":            "text-cyan-400",
  "Token Sale":        "text-amber-400",
  "NFT":               "text-pink-400",
};

const REWARD_BADGE_CLS: Record<string, string> = {
  "Airdrop":           "bg-primary/10 text-primary border-primary/20",
  "Whitelist/Waitlist":"bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Points":            "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Token Sale":        "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "NFT":               "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

const STATUS_BADGE_CLS = {
  "Confirmed":        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Potential":        "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Reward Available": "bg-blue-500/10 text-blue-400 border-blue-500/20",
} as const;

/* ── Task type badge ── */
const TYPE_CLS: Record<string, string> = {
  "Fill The Form": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  "Trading":       "bg-green-500/10 text-green-400 border border-green-500/20",
  "Testnet":       "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  "Social":        "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  "Liquidity":     "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  "Staking":       "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  "Mainnet":       "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  "Hold":          "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  "Referral":      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  "Community":     "bg-rose-500/10 text-rose-400 border border-rose-500/20",
};

/* ── Project Logo ── */
function ProjectLogo({ airdrop, size = 36 }: { airdrop: Airdrop; size?: number }) {
  const [failed, setFailed] = useState(false);
  const s = `${size}px`;
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold overflow-hidden shrink-0"
      style={{ width: s, height: s, background: airdrop.logoColor, fontSize: size * 0.3 }}
    >
      {airdrop.logoUrl && !failed
        ? <img src={airdrop.logoUrl} alt={airdrop.name} className="w-full h-full object-cover"
                onError={() => setFailed(true)} />
        : airdrop.logoInitial}
    </div>
  );
}

/* ── Single backer avatar — state lives here, not inside a .map() ── */
function BackerAvatar({ backer, index }: { backer: Backer; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      title={backer.name}
      className="w-6 h-6 rounded-full overflow-hidden border-2 border-background flex items-center justify-center text-white font-bold shrink-0"
      style={{ background: backer.color, marginLeft: index > 0 ? "-5px" : 0, zIndex: 10 - index, fontSize: "8px" }}
    >
      {backer.logoUrl && !failed
        ? <img src={backer.logoUrl} alt={backer.name} className="w-full h-full object-cover"
                onError={() => setFailed(true)} />
        : backer.initial}
    </div>
  );
}

/* ── Backer Row ── */
function BackerRow({ backers, extra }: { backers?: Backer[]; extra?: number }) {
  if (!backers?.length && !extra) return <span className="text-[11px] text-muted-foreground">—</span>;
  return (
    <div className="flex items-center">
      {backers?.slice(0, 5).map((b, i) => (
        <BackerAvatar key={i} backer={b} index={i} />
      ))}
      {(extra ?? 0) > 0 && (
        <span className="text-[9px] text-muted-foreground ml-1.5">+{extra}</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   TABLE ROW (desktop list view)
══════════════════════════════════════════════ */
const GRID = "grid grid-cols-[36px_minmax(190px,260px)_1fr_minmax(160px,200px)_120px_minmax(140px,180px)] items-center";

function TableRow({ a, bookmarked, onToggle }: { a: Airdrop; bookmarked: boolean; onToggle: () => void }) {
  const topTask = a.tasks[0];
  const extra   = a.tasks.length - 1;

  return (
    <Link href={`/airdrops/${a.slug}`} className="block">
      <div className={cn(GRID, "group relative border-b border-border/40 last:border-0 cursor-pointer transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-primary/[0.04] hover:via-transparent hover:to-primary/[0.04] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] active:scale-[0.998]")}>
        {/* Left accent bar on hover */}
        <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[2px] bg-gradient-to-b from-primary via-primary/60 to-transparent transition-all duration-300 group-hover:h-[70%]" />

        {/* Star */}
        <div className="flex items-center justify-center h-full px-2 py-3">
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
            className={cn("transition-all duration-200 hover:scale-125", bookmarked ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" : "text-muted-foreground/40 hover:text-amber-300")}
          >
            <Star className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Name */}
        <div className="flex items-center gap-2.5 py-3 pr-2 min-w-0">
          <div className="transition-transform duration-300 group-hover:scale-105"><ProjectLogo airdrop={a} size={34} /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-[13px] truncate tracking-tight group-hover:text-primary transition-colors duration-200">{a.name}</span>
              {a.isNew && (
                <span className="text-[8px] bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 shadow-sm shadow-emerald-500/30">
                  New
                </span>
              )}
            </div>
            {a.ticker && <span className="text-[10px] text-muted-foreground font-medium">{a.ticker}</span>}
          </div>
        </div>

        {/* Task Type */}
        <div className="py-3 pr-3 min-w-0">
          {topTask ? (
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground leading-none">
                Cost: <span className={topTask.cost === 0 ? "text-emerald-500 font-bold" : "text-amber-400 font-bold"}>
                  {topTask.cost === 0 ? "Free" : `$${topTask.cost}`}
                </span><span className="mx-1.5 opacity-30">·</span>
                Time: <span className="text-foreground/70 font-medium">{topTask.timeMin} min</span>
              </p>
              <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                <span className="text-[12px] font-semibold truncate flex-shrink">{topTask.name}</span>
                {extra > 0 && <span className="text-[9px] text-cyan-400 font-black shrink-0">+{extra}</span>}
                <span className="ml-auto shrink-0 inline-flex items-center gap-0.5 text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-sm shadow-primary/30">
                  View <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="flex items-center gap-1 flex-nowrap overflow-hidden">
                {topTask.types.slice(0, 2).map(t => (
                  <span key={t} className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", TYPE_CLS[t] ?? "bg-muted text-muted-foreground")}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground/60">No active tasks</span>
          )}
        </div>

        {/* Status */}
        <div className="py-3 pr-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            {STATUS_ICON[a.status]}
            <span className={cn("text-[11px] font-bold truncate", STATUS_CLS[a.status])}>{a.status}</span>
          </div>
          <p className="text-[10px] text-muted-foreground pl-5">{a.statusDate}</p>
        </div>

        {/* Reward Type */}
        <div className="py-3 pr-2">
          <span className={cn("text-[11px] font-bold", REWARD_CLS[a.rewardType] ?? "text-foreground")}>
            {a.rewardType}
          </span>
        </div>

        {/* Raise / Backers */}
        <div className="py-3 pr-3">
          {a.raiseFunds
            ? <p className="text-[12px] font-bold mb-1">{a.raiseFunds}</p>
            : <p className="text-[11px] text-muted-foreground mb-1">—</p>
          }
          <BackerRow backers={a.backers} extra={a.backersExtra} />
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════
   CARD VIEW
══════════════════════════════════════════════ */
function AirdropCard({ a, bookmarked, onToggle }: { a: Airdrop; bookmarked: boolean; onToggle: () => void }) {
  const topTask  = a.tasks[0];
  const totalCost = a.tasks.reduce((sum, t) => sum + t.cost, 0);
  const totalTime = a.tasks.reduce((sum, t) => sum + t.timeMin, 0);

  return (
    <Link href={`/airdrops/${a.slug}`} className="block group">
      <div className="relative flex flex-col rounded-2xl bg-card overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 active:translate-y-0 active:scale-[0.99] border border-border/60 hover:border-border">
        {/* Glow overlay */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

        {/* Header */}
        <div className="p-4 pb-3 relative">
          {/* Logo + name + bookmark */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="transition-transform duration-300 group-hover:scale-105 shrink-0">
                <ProjectLogo airdrop={a} size={46} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="font-bold text-[15px] leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 truncate">
                    {a.name}
                  </span>
                  {a.isNew && (
                    <span className="shrink-0 text-[8px] bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm shadow-emerald-500/40">
                      New
                    </span>
                  )}
                </div>
                {a.ticker && (
                  <span className="text-[11px] text-muted-foreground font-medium">{a.ticker}</span>
                )}
              </div>
            </div>
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

          {/* Status + reward badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border", STATUS_BADGE_CLS[a.status])}>
              {STATUS_ICON[a.status]}
              {a.status}
            </span>
            <span className={cn("inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-lg border", REWARD_BADGE_CLS[a.rewardType] ?? "bg-muted text-muted-foreground border-border")}>
              {a.rewardType}
            </span>
            {a.raiseFunds && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-foreground/80 bg-muted/50 px-2 py-1 rounded-lg border border-border/40">
                <Zap className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                {a.raiseFunds}
              </span>
            )}
          </div>

          {/* Cost + time + task count */}
          <div className="flex items-center gap-2.5 mb-3 text-[11px]">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className={totalCost === 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {totalCost === 0 ? "Free" : `$${totalCost}`}
              </span>
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-foreground/70 font-medium">{totalTime} min</span>
            </span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground font-medium">{a.tasks.length} task{a.tasks.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Task list */}
          {a.tasks.length > 0 ? (
            <div className="space-y-1.5 mb-3">
              {a.tasks.slice(0, 2).map((task, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 py-2 border border-border/30 group-hover:bg-muted/50 transition-colors duration-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="text-[11px] font-medium flex-1 truncate">{task.name}</span>
                  {task.types.slice(0, 1).map(t => (
                    <span key={t} className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0", TYPE_CLS[t] ?? "bg-muted text-muted-foreground")}>
                      {t}
                    </span>
                  ))}
                </div>
              ))}
              {a.tasks.length > 2 && (
                <p className="text-[10px] text-muted-foreground text-center py-0.5">
                  +{a.tasks.length - 2} more tasks
                </p>
              )}
            </div>
          ) : (
            <div className="bg-muted/20 border border-border/30 rounded-xl p-3 mb-3 flex items-center justify-center">
              <span className="text-[11px] text-muted-foreground">No active tasks — check back soon</span>
            </div>
          )}

          {/* Backers */}
          {(a.backers?.length ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium shrink-0">Backed by</span>
              <BackerRow backers={a.backers} extra={a.backersExtra} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-border/40 px-4 py-2.5 flex items-center justify-between bg-muted/10 group-hover:bg-primary/5 transition-colors duration-300">
          <span className="text-[10px] text-muted-foreground font-semibold">{a.statusDate}</span>
          <span className="text-[11px] font-black text-primary flex items-center gap-0.5 transition-all duration-300 group-hover:gap-1">
            View Details <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const FILTER_TABS = ["All", "Confirmed", "Potential", "Reward Available"];
const REWARD_TABS = ["All", "Airdrop", "Whitelist/Waitlist", "Points", "Token Sale"];

export default function AirdropsPage() {
  const [tab,       setTab]       = useState("All");
  const [rewardTab, setRewardTab] = useState("All");
  const [search,    setSearch]    = useState("");
  const [view,      setView]      = useState<"table" | "cards">("cards");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [isMobile,  setIsMobile]  = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const fn = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    fn(mq);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const effectiveView = isMobile ? "cards" : view;

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
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight">Airdrop Radar</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            <span className="text-emerald-500 font-medium">{counts.confirmed} Confirmed</span>
            <span className="mx-1.5 text-muted-foreground/40">·</span>
            <span className="text-amber-400 font-medium">{counts.potential} Potential</span>
            <span className="mx-1.5 text-muted-foreground/40">·</span>
            <span className="text-blue-400 font-medium">{counts.reward} Reward Available</span>
          </p>
        </div>

        {/* View toggle — desktop only */}
        <div className="hidden lg:flex items-center gap-1 bg-muted/40 rounded-lg p-0.5 border border-border/40">
          <button
            onClick={() => setView("table")}
            className={cn("w-8 h-7 rounded-md flex items-center justify-center transition-colors",
              view === "table" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutList className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView("cards")}
            className={cn("w-8 h-7 rounded-md flex items-center justify-center transition-colors",
              view === "cards" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Status tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {FILTER_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-medium transition-colors border",
                tab === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground border-border/40 hover:border-border hover:text-foreground bg-muted/20"
              )}
            >
              {t === "Confirmed" && <CheckCircle2 className="w-2.5 h-2.5 inline mr-1 text-emerald-400" />}
              {t === "Potential" && <HelpCircle className="w-2.5 h-2.5 inline mr-1 text-amber-400" />}
              {t === "Reward Available" && <Banknote className="w-2.5 h-2.5 inline mr-1 text-blue-400" />}
              {t}
            </button>
          ))}

          {/* Search */}
          <div className="ml-auto flex items-center gap-1.5 bg-muted/30 border border-border/40 rounded-full px-3 py-1">
            <Search className="w-3 h-3 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="text-[11px] bg-transparent outline-none w-32 placeholder:text-muted-foreground/50"
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
                "px-2.5 py-0.5 rounded text-[10px] font-medium transition-colors",
                rewardTab === t ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {effectiveView === "table" && (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <div className={cn(GRID, "bg-muted/30 border-b border-border/60")}>
            <div />
            <div className="py-2.5 pr-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Name</div>
            <div className="py-2.5 pr-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Task Type</div>
            <div className="py-2.5 pr-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</div>
            <div className="py-2.5 pr-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reward</div>
            <div className="py-2.5 pr-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Raise / Backers</div>
          </div>
          <div className="bg-card/60">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
                <Search className="w-8 h-8 opacity-30" />
                <p className="text-[13px]">No airdrops match your filter</p>
              </div>
            ) : (
              filtered.map(a => (
                <TableRow key={a.id} a={a} bookmarked={bookmarks.has(a.id)} onToggle={() => toggle(a.id)} />
              ))
            )}
          </div>
        </div>
      )}

      {/* CARDS VIEW */}
      {effectiveView === "cards" && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
              <Search className="w-8 h-8 opacity-30" />
              <p className="text-[13px]">No airdrops match your filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(a => (
                <AirdropCard key={a.id} a={a} bookmarked={bookmarks.has(a.id)} onToggle={() => toggle(a.id)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

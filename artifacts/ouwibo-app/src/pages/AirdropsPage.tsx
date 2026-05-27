import { useState, useEffect } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { mockAirdrops } from "@/lib/mockData";
import type { Airdrop, Backer } from "@/lib/mockData";
import {
  Star, ChevronRight, Search, LayoutList, LayoutGrid,
  CheckCircle2, HelpCircle, Banknote, Clock, DollarSign,
} from "lucide-react";

/* ── Status config ── */
const STATUS_ICON = {
  "Confirmed":        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />,
  "Potential":        <HelpCircle   className="w-3 h-3 text-amber-400  shrink-0" />,
  "Reward Available": <Banknote     className="w-3 h-3 text-blue-400   shrink-0" />,
} as const;

const STATUS_CLS = {
  "Confirmed":        "text-emerald-500",
  "Potential":        "text-amber-400",
  "Reward Available": "text-blue-400",
} as const;

const STATUS_BADGE = {
  "Confirmed":        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Potential":        "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Reward Available": "bg-blue-500/10 text-blue-400 border-blue-500/20",
} as const;

/* ── Reward type ── */
const REWARD_CLS: Record<string, string> = {
  "Airdrop":           "text-primary",
  "Whitelist/Waitlist":"text-purple-400",
  "Points":            "text-cyan-400",
  "Token Sale":        "text-amber-400",
  "NFT":               "text-pink-400",
};

const REWARD_BADGE: Record<string, string> = {
  "Airdrop":           "bg-primary/10 text-primary border-primary/20",
  "Whitelist/Waitlist":"bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Points":            "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Token Sale":        "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "NFT":               "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

/* ── Task type ── */
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
function ProjectLogo({ airdrop, size = 40 }: { airdrop: Airdrop; size?: number }) {
  const [failed, setFailed] = useState(false);
  const s = `${size}px`;
  return (
    <div
      className="rounded-xl flex items-center justify-center text-white font-bold overflow-hidden shrink-0"
      style={{ width: s, height: s, background: airdrop.logoColor, fontSize: size * 0.32 }}
    >
      {airdrop.logoUrl && !failed
        ? <img src={airdrop.logoUrl} alt={airdrop.name} className="w-full h-full object-cover"
                onError={() => setFailed(true)} />
        : airdrop.logoInitial}
    </div>
  );
}

/* ── Single backer avatar ── */
function BackerAvatar({ backer, index }: { backer: Backer; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      title={backer.name}
      className="w-5 h-5 rounded-full overflow-hidden border border-background flex items-center justify-center text-white font-bold shrink-0"
      style={{ background: backer.color, marginLeft: index > 0 ? "-4px" : 0, zIndex: 10 - index, fontSize: "7px" }}
    >
      {backer.logoUrl && !failed
        ? <img src={backer.logoUrl} alt={backer.name} className="w-full h-full object-cover" onError={() => setFailed(true)} />
        : backer.initial}
    </div>
  );
}

function BackerRow({ backers, extra }: { backers?: Backer[]; extra?: number }) {
  if (!backers?.length && !extra) return null;
  return (
    <div className="flex items-center">
      {backers?.slice(0, 4).map((b, i) => <BackerAvatar key={i} backer={b} index={i} />)}
      {(extra ?? 0) > 0 && <span className="text-[9px] text-muted-foreground ml-1.5">+{extra}</span>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   LANDSCAPE ROW (default / card view)
══════════════════════════════════════════════ */
function AirdropRow({ a, bookmarked, onToggle }: { a: Airdrop; bookmarked: boolean; onToggle: () => void }) {
  const topTask   = a.tasks[0];
  const totalCost = a.tasks.reduce((s, t) => s + t.cost, 0);
  const totalTime = a.tasks.reduce((s, t) => s + t.timeMin, 0);

  return (
    <Link href={`/airdrops/${a.slug}`} className="block group">
      <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/60 cursor-pointer transition-all duration-200 hover:border-border hover:bg-card/80 hover:shadow-md active:scale-[0.998]">
        {/* Hover accent */}
        <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[2px] rounded-r bg-primary transition-all duration-200 group-hover:h-[60%]" />

        {/* Logo */}
        <div className="transition-transform duration-200 group-hover:scale-105">
          <ProjectLogo airdrop={a} size={40} />
        </div>

        {/* Name + badges */}
        <div className="flex flex-col gap-0.5 min-w-0 w-[180px] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[13px] truncate tracking-tight group-hover:text-primary transition-colors duration-200">
              {a.name}
            </span>
            {a.isNew && (
              <span className="shrink-0 text-[7px] bg-emerald-500 text-white px-1 py-0.5 rounded-full font-black uppercase tracking-wider">
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <span className={cn("inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded border", STATUS_BADGE[a.status])}>
              {STATUS_ICON[a.status]}
              {a.status}
            </span>
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border", REWARD_BADGE[a.rewardType] ?? "bg-muted text-muted-foreground border-border")}>
              {a.rewardType}
            </span>
          </div>
        </div>

        {/* Cost + Time */}
        <div className="hidden sm:flex flex-col items-center gap-0.5 w-[90px] shrink-0">
          <span className={cn("text-[12px] font-bold", totalCost === 0 ? "text-emerald-400" : "text-amber-400")}>
            {totalCost === 0 ? "Free" : `$${totalCost}`}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />{totalTime} min
          </span>
        </div>

        {/* Top task */}
        <div className="hidden md:flex flex-col gap-0.5 flex-1 min-w-0">
          {topTask ? (
            <>
              <span className="text-[11px] font-medium truncate">{topTask.name}</span>
              <div className="flex items-center gap-1">
                {topTask.types.slice(0, 2).map(t => (
                  <span key={t} className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded", TYPE_CLS[t] ?? "bg-muted text-muted-foreground")}>
                    {t}
                  </span>
                ))}
                {a.tasks.length > 1 && (
                  <span className="text-[9px] text-cyan-400 font-bold">+{a.tasks.length - 1}</span>
                )}
              </div>
            </>
          ) : (
            <span className="text-[11px] text-muted-foreground/50">No active tasks</span>
          )}
        </div>

        {/* Raise + Backers */}
        <div className="hidden lg:flex flex-col items-end gap-1 w-[110px] shrink-0">
          {a.raiseFunds && (
            <span className="text-[11px] font-bold text-foreground/80">{a.raiseFunds}</span>
          )}
          <BackerRow backers={a.backers} extra={a.backersExtra} />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200 hover:scale-110",
              bookmarked ? "text-amber-400 bg-amber-400/10" : "text-muted-foreground/30 hover:text-amber-300 hover:bg-muted/50"
            )}
          >
            <Star className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════
   BOX CARD (card grid view)
══════════════════════════════════════════════ */
function AirdropCard({ a, bookmarked, onToggle }: { a: Airdrop; bookmarked: boolean; onToggle: () => void }) {
  const topTask   = a.tasks[0];
  const totalCost = a.tasks.reduce((s, t) => s + t.cost, 0);
  const totalTime = a.tasks.reduce((s, t) => s + t.timeMin, 0);

  return (
    <Link href={`/airdrops/${a.slug}`} className="block group">
      <div className="relative flex flex-col rounded-2xl bg-card overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 active:translate-y-0 active:scale-[0.99] border border-border/60 hover:border-border">
        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

        <div className="p-4 pb-3 relative">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="transition-transform duration-300 group-hover:scale-105 shrink-0">
                <ProjectLogo airdrop={a} size={44} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="font-bold text-[14px] leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 truncate">{a.name}</span>
                  {a.isNew && <span className="shrink-0 text-[7px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">NEW</span>}
                </div>
                {a.ticker && <span className="text-[10px] text-muted-foreground font-medium">{a.ticker}</span>}
              </div>
            </div>
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
              className={cn("shrink-0 p-1.5 rounded-lg transition-all duration-200 hover:scale-110", bookmarked ? "text-amber-400 bg-amber-400/10" : "text-muted-foreground/30 hover:text-amber-300 hover:bg-muted/50")}
            >
              <Star className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <span className={cn("inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-1 rounded-lg border", STATUS_BADGE[a.status])}>
              {STATUS_ICON[a.status]}{a.status}
            </span>
            <span className={cn("text-[9px] font-bold px-2 py-1 rounded-lg border", REWARD_BADGE[a.rewardType] ?? "bg-muted text-muted-foreground border-border")}>
              {a.rewardType}
            </span>
            {a.raiseFunds && (
              <span className="text-[9px] font-bold text-foreground/70 bg-muted/50 px-2 py-1 rounded-lg border border-border/40">{a.raiseFunds}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3 text-[10px]">
            <span className={totalCost === 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {totalCost === 0 ? "Free" : `$${totalCost}`}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-0.5 text-muted-foreground"><Clock className="w-2.5 h-2.5" />{totalTime} min</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground">{a.tasks.length} tasks</span>
          </div>

          {topTask ? (
            <div className="space-y-1 mb-3">
              {a.tasks.slice(0, 2).map((task, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 py-2 border border-border/30 group-hover:bg-muted/50 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="text-[10px] font-medium flex-1 truncate">{task.name}</span>
                  {task.types.slice(0, 1).map(t => (
                    <span key={t} className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0", TYPE_CLS[t] ?? "bg-muted text-muted-foreground")}>{t}</span>
                  ))}
                </div>
              ))}
              {a.tasks.length > 2 && <p className="text-[9px] text-muted-foreground text-center">+{a.tasks.length - 2} more</p>}
            </div>
          ) : (
            <div className="bg-muted/20 rounded-xl px-3 py-2.5 mb-3 text-center border border-border/20">
              <span className="text-[10px] text-muted-foreground">No active tasks</span>
            </div>
          )}

          {(a.backers?.length ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground shrink-0">Backed by</span>
              <BackerRow backers={a.backers} extra={a.backersExtra} />
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-border/40 px-4 py-2.5 flex items-center justify-between bg-muted/10 group-hover:bg-primary/5 transition-colors duration-300">
          <span className="text-[10px] text-muted-foreground font-semibold">{a.statusDate}</span>
          <span className="text-[10px] font-black text-primary flex items-center gap-0.5 group-hover:gap-1 transition-all duration-200">
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
  const [view,      setView]      = useState<"list" | "cards">("list");
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
      {/* Header */}
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
            onClick={() => setView("list")}
            className={cn("w-8 h-7 rounded-md flex items-center justify-center transition-colors",
              view === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
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

      {/* LIST VIEW (landscape rows) */}
      {effectiveView === "list" && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
              <Search className="w-8 h-8 opacity-30" />
              <p className="text-[13px]">No airdrops match your filter</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map(a => (
                <AirdropRow key={a.id} a={a} bookmarked={bookmarks.has(a.id)} onToggle={() => toggle(a.id)} />
              ))}
            </div>
          )}
        </>
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

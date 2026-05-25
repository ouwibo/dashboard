import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { mockAirdrops } from "@/lib/mockData";
import type { Airdrop } from "@/lib/mockData";
import { Star, ChevronRight, Search } from "lucide-react";

/* ═══════ Constants ═══════ */
const STATUS_EMOJI  = { "Confirmed":"👌", "Potential":"🤔", "Reward Available":"🤑" } as const;
const STATUS_CLS    = { "Confirmed":"text-foreground", "Potential":"text-foreground", "Reward Available":"text-blue-400 font-semibold" } as const;
const REWARD_CLS: Record<string,string> = {
  "Airdrop":           "text-foreground",
  "Whitelist/Waitlist":"text-purple-400",
  "Points":            "text-amber-400",
  "Token Sale":        "text-green-400",
  "NFT":               "text-pink-400",
};
const TYPE_CLS: Record<string,string> = {
  "Fill The Form": "bg-blue-500/20 text-blue-400",
  "Trading":       "bg-green-500/20 text-green-400",
  "Testnet":       "bg-purple-500/20 text-purple-400",
  "Social":        "bg-pink-500/20 text-pink-400",
  "Liquidity":     "bg-amber-500/20 text-amber-400",
  "Hold":          "bg-cyan-500/20 text-cyan-400",
  "Staking":       "bg-indigo-500/20 text-indigo-400",
  "Mainnet":       "bg-emerald-500/20 text-emerald-400",
  "Ambassador":    "bg-rose-500/20 text-rose-400",
  "Bounty":        "bg-yellow-500/20 text-yellow-400",
};

/* ─── Grid column template shared by header + rows ─── */
const GRID = "grid grid-cols-[32px_220px_1fr_190px_120px_160px_140px] items-center gap-x-3";

/* ═══════ Sub-components ═══════ */

function MoniBar({ score }: { score: number }) {
  const pct = Math.min(100, (score / 10000) * 100);
  return (
    <div className="flex flex-col items-end gap-1 w-full">
      <span className="text-[14px] font-bold tabular-nums leading-none">
        {score.toLocaleString()}
      </span>
      <div className="relative w-full h-[5px] rounded-full overflow-hidden"
           style={{ background: "linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e)" }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-background shadow"
          style={{
            left: `clamp(0px, calc(${pct}% - 5px), calc(100% - 10px))`,
            background: pct > 66 ? "#22c55e" : pct > 33 ? "#eab308" : "#ef4444",
          }}
        />
      </div>
    </div>
  );
}

function LogoCircle({ a, size = 36 }: { a: Airdrop; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: a.logoColor, fontSize: size * 0.33 }}
    >
      {a.logoUrl
        ? <img src={a.logoUrl} alt={a.name} className="w-full h-full object-cover" />
        : a.logoInitial}
    </div>
  );
}

/* ── Desktop table row ── */
function AirdropRow({ a, bookmarked, onBookmark }: {
  a: Airdrop; bookmarked: boolean; onBookmark: () => void;
}) {
  const topTask  = a.tasks[0];
  const extraTasks = a.tasks.length - 1;

  return (
    <div className={cn(GRID, "py-3 px-3 border-b border-border/30 hover:bg-muted/25 transition-colors cursor-default group")}>

      {/* 1 — Star */}
      <button
        onClick={onBookmark}
        className="flex items-center justify-center w-full h-full text-muted-foreground hover:text-amber-400 transition-colors"
      >
        <Star size={13} className={bookmarked ? "fill-amber-400 text-amber-400" : ""} />
      </button>

      {/* 2 — Name */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0">
          <LogoCircle a={a} size={34} />
          {a.isNew && (
            <span className="absolute -top-1 -right-1 text-[7px] font-bold bg-emerald-500 text-white px-1 py-px rounded-sm leading-none">
              NEW
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold leading-tight truncate">{a.name}</p>
          {a.ticker && <p className="text-[10px] text-muted-foreground leading-tight">{a.ticker}</p>}
        </div>
      </div>

      {/* 3 — Task Type (2 lines, no wrap) */}
      <div className="min-w-0 flex flex-col gap-0.5">
        {topTask ? (
          <>
            {/* Line 1: cost + time */}
            <p className="text-[10px] text-muted-foreground leading-tight whitespace-nowrap">
              Cost:&nbsp;<span className={topTask.cost === 0 ? "text-green-400" : "text-amber-400"}>
                {topTask.cost === 0 ? "Free" : `$${topTask.cost}`}
              </span>
              &nbsp;&nbsp;Time:&nbsp;{topTask.timeMin}&nbsp;min
            </p>
            {/* Line 2: type badges + extras + go button */}
            <div className="flex items-center gap-1 overflow-hidden">
              {topTask.types.slice(0, 2).map(t => (
                <span key={t} className={cn("text-[10px] font-medium px-1.5 py-px rounded shrink-0", TYPE_CLS[t] ?? "bg-muted/60 text-muted-foreground")}>
                  {t}
                </span>
              ))}
              {(extraTasks > 0 || topTask.types.length > 2) && (
                <span className="text-[10px] font-semibold text-cyan-400 shrink-0">
                  +{extraTasks + Math.max(0, topTask.types.length - 2)}
                </span>
              )}
              <Link href={`/airdrops/${a.slug}`} className="ml-auto shrink-0" onClick={e => e.stopPropagation()}>
                <button className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-80 transition-opacity">
                  <ChevronRight size={12} />
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground italic">No active tasks</p>
        )}
      </div>

      {/* 4 — Updated Status */}
      <div className="flex flex-col gap-px">
        <div className="flex items-center gap-1">
          <span className="text-[13px] leading-none">{STATUS_EMOJI[a.status]}</span>
          <span className={cn("text-[11px] font-medium leading-tight", STATUS_CLS[a.status])}>
            {a.status}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight">{a.statusDate}</p>
      </div>

      {/* 5 — Reward Type */}
      <p className={cn("text-[11px] font-medium truncate", REWARD_CLS[a.rewardType] ?? "text-foreground")}>
        {a.rewardType}
      </p>

      {/* 6 — Raise / Funds */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[11px] font-semibold leading-tight">
          {a.raiseFunds ?? <span className="text-muted-foreground">—</span>}
        </span>
        {a.backers && a.backers.length > 0 && (
          <div className="flex items-center">
            {a.backers.slice(0, 4).map((b, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-background flex items-center justify-center text-white text-[8px] font-bold -ml-1 first:ml-0 shrink-0"
                style={{ background: b.color, zIndex: 4 - i }}
              >
                {b.initial}
              </div>
            ))}
            {(a.backersExtra ?? 0) > 0 && (
              <span className="ml-1 text-[9px] text-muted-foreground">+{a.backersExtra}</span>
            )}
          </div>
        )}
      </div>

      {/* 7 — Moni Score */}
      <div className="pr-2">
        <MoniBar score={a.moniScore} />
      </div>
    </div>
  );
}

/* ── Mobile card ── */
function MobileCard({ a, bookmarked, onBookmark }: { a: Airdrop; bookmarked: boolean; onBookmark: () => void }) {
  const topTask = a.tasks[0];
  return (
    <div className="border border-border/50 rounded-xl bg-card/60 p-3 space-y-2">
      {/* Header row */}
      <div className="flex items-center gap-2.5">
        <button onClick={onBookmark} className="text-muted-foreground hover:text-amber-400 transition-colors shrink-0">
          <Star size={13} className={bookmarked ? "fill-amber-400 text-amber-400" : ""} />
        </button>
        <div className="relative shrink-0">
          <LogoCircle a={a} size={36} />
          {a.isNew && (
            <span className="absolute -top-1 -right-1 text-[7px] font-bold bg-emerald-500 text-white px-1 py-px rounded-sm">NEW</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[13px] truncate">{a.name}</span>
            {a.ticker && <span className="text-[10px] text-muted-foreground">{a.ticker}</span>}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="text-[11px]">{STATUS_EMOJI[a.status]}</span>
            <span className={cn("text-[10px] font-medium", STATUS_CLS[a.status])}>{a.status}</span>
            <span className="text-muted-foreground text-[10px]">· {a.statusDate}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <MoniBar score={a.moniScore} />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-[11px] flex-wrap">
        <span className={cn("font-medium", REWARD_CLS[a.rewardType])}>{a.rewardType}</span>
        {a.raiseFunds && <span className="font-semibold">{a.raiseFunds}</span>}
        {topTask && (
          <>
            <span className="text-muted-foreground">
              Cost: <span className={topTask.cost === 0 ? "text-green-400 font-medium" : "text-amber-400 font-medium"}>
                {topTask.cost === 0 ? "Free" : `$${topTask.cost}`}
              </span>
            </span>
            <span className="text-muted-foreground">{topTask.timeMin}min</span>
          </>
        )}
      </div>

      {/* Task + Go */}
      {topTask && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
            {topTask.types.slice(0, 2).map(t => (
              <span key={t} className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0", TYPE_CLS[t] ?? "bg-muted/60 text-muted-foreground")}>{t}</span>
            ))}
            {a.tasks.length > 1 && <span className="text-[10px] text-cyan-400 font-semibold shrink-0">+{a.tasks.length - 1}</span>}
          </div>
          <Link href={`/airdrops/${a.slug}`}>
            <button className="shrink-0 text-[11px] font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
              View →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ═══════ Main page ═══════ */
export default function AirdropsPage() {
  const [bookmarks, setBookmarks]   = useState<Set<number>>(new Set());
  const [statusFilter, setStatus]   = useState("All");
  const [rewardFilter, setReward]   = useState("All");
  const [search, setSearch]         = useState("");

  function toggleBm(id: number) {
    setBookmarks(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  const filtered = mockAirdrops.filter(a => {
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (rewardFilter !== "All" && a.rewardType !== rewardFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    active:  mockAirdrops.filter(a => a.status === "Confirmed").length,
    reward:  mockAirdrops.filter(a => a.status === "Reward Available").length,
  };

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight">Airdrop Radar</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {counts.active} active · {counts.reward} reward available
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/40 border border-border/50 rounded-lg px-3 py-1.5 w-full sm:w-64">
          <Search size={12} className="text-muted-foreground shrink-0" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="bg-transparent text-[12px] outline-none w-full placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {/* Status */}
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
          {["All","Confirmed","Potential","Reward Available"].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={cn("text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors whitespace-nowrap",
                statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
              {s}
            </button>
          ))}
        </div>
        {/* Reward */}
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1 flex-wrap">
          {["All","Airdrop","Whitelist/Waitlist","Points","Token Sale","NFT"].map(r => (
            <button key={r} onClick={() => setReward(r)}
              className={cn("text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors whitespace-nowrap",
                rewardFilter === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block w-full border border-border/50 rounded-xl overflow-hidden bg-card/40 backdrop-blur-sm">
        {/* Header */}
        <div className={cn(GRID, "py-2 px-3 border-b border-border/60 bg-muted/30")}>
          <div />
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Name</p>
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Task Type</p>
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Updated Status</p>
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Reward</p>
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Raise / Funds</p>
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Moni Score</p>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-14 text-center text-muted-foreground text-[13px]">No projects found</div>
        ) : (
          filtered.map(a => (
            <AirdropRow key={a.id} a={a} bookmarked={bookmarks.has(a.id)} onBookmark={() => toggleBm(a.id)} />
          ))
        )}
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground text-[13px] py-10">No projects found</p>
        ) : (
          filtered.map(a => (
            <MobileCard key={a.id} a={a} bookmarked={bookmarks.has(a.id)} onBookmark={() => toggleBm(a.id)} />
          ))
        )}
      </div>
    </div>
  );
}

import { useGetStats, useListAirdrops, useListActivity, getListAirdropsQueryKey } from "@workspace/api-client-react";
import { Zap, TrendingUp, Clock, CheckCircle, Star, Globe, Twitter, Send, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

const PASTEL = { sky: "#b8d8f0", mint: "#b8e8c8", peach: "#f0c4a8", lavender: "#d4c0f0", yellow: "#f0e0a0", sage: "#c8dcc0" };
const STATUS_STYLE: Record<string, { bg: string; label: string }> = {
  active:    { bg: PASTEL.mint,     label: "Active"    },
  upcoming:  { bg: PASTEL.yellow,   label: "Upcoming"  },
  ended:     { bg: PASTEL.sage,     label: "Ended"     },
  potential: { bg: PASTEL.lavender, label: "Potential" },
};
const DIFF_STYLE: Record<string, string> = { easy: PASTEL.mint, medium: PASTEL.yellow, hard: PASTEL.peach };
const ACT_STYLE: Record<string, string> = { airdrop_added: PASTEL.sky, airdrop_updated: PASTEL.yellow };

const STAT_CARDS = [
  { label: "Total Airdrops", key: "totalAirdrops",   icon: Zap,         bg: PASTEL.sky },
  { label: "Active Now",     key: "activeAirdrops",  icon: TrendingUp,  bg: PASTEL.mint },
  { label: "Upcoming",       key: "upcomingAirdrops",icon: Clock,       bg: PASTEL.yellow },
  { label: "Tasks Tracked",  key: "totalTasks",      icon: CheckCircle, bg: PASTEL.lavender },
];

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: featured } = useListAirdrops({ featured: true });
  const { data: active }   = useListAirdrops({ status: "active" }, { query: { queryKey: getListAirdropsQueryKey({ status: "active" }) } });
  const { data: activity } = useListActivity();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-primary border-2 border-foreground flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0 hsl(var(--foreground))" }}>
            <Zap size={14} fill="white" color="white" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full border-2 border-foreground/25 bg-primary text-white"
            style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700 }}>
            LIVE TRACKER
          </span>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.1 }}>
          Airdrop Dashboard
        </h1>
        <p className="text-muted-foreground mt-1" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>
          Track, complete tasks, and earn from the best crypto airdrops
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(card => {
          const value = stats ? (stats as Record<string, number>)[card.key] : null;
          return (
            <div key={card.key} className="neo-card p-5" style={{ backgroundColor: card.bg }}>
              {statsLoading ? <Skeleton className="h-16 w-full rounded-xl" /> : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <p style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }} className="text-foreground/60">{card.label}</p>
                    <div className="w-7 h-7 rounded-xl border-2 border-foreground/20 flex items-center justify-center bg-white/40">
                      <card.icon size={13} className="text-foreground/70" />
                    </div>
                  </div>
                  <p style={{ fontFamily: DISPLAY, fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}>{value ?? 0}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Featured airdrops */}
        <div className="lg:col-span-2 neo-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>
              ⭐ Featured Airdrops
            </p>
            <Link href="/airdrops"
              className="flex items-center gap-1 text-primary hover:underline"
              style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700 }}>
              View All <ExternalLink size={11} />
            </Link>
          </div>
          {!featured ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}</div>
          ) : featured.length > 0 ? (
            <div className="space-y-2">
              {featured.slice(0, 5).map((airdrop, idx) => {
                const st = STATUS_STYLE[airdrop.status] ?? { bg: PASTEL.sage, label: airdrop.status };
                return (
                  <Link href={`/airdrops/${airdrop.id}`} key={airdrop.id}>
                    <div className="flex items-center gap-3 p-3 rounded-2xl border-2 border-foreground/10 hover:border-foreground/30 transition-all cursor-pointer"
                      style={{ backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent" }}>
                      <div className="w-9 h-9 rounded-xl border-2 border-foreground/20 flex items-center justify-center text-white font-bold shrink-0"
                        style={{ backgroundColor: airdrop.logoColor, fontFamily: DISPLAY, fontSize: "0.8rem", boxShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}>
                        {airdrop.logoInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm truncate" style={{ fontFamily: DISPLAY, fontSize: "0.78rem" }}>{airdrop.name}</p>
                          {airdrop.isVerified && <CheckCircle size={11} className="text-primary shrink-0" />}
                        </div>
                        <p className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.6rem" }}>{airdrop.chain} · {airdrop.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-primary" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>{airdrop.rewardEstimate ?? "TBD"}</p>
                        <span className="px-2 py-0.5 rounded-full border-2 border-foreground/20 text-foreground/70"
                          style={{ backgroundColor: st.bg, fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700 }}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>No featured airdrops</p>
          )}
        </div>

        {/* Activity feed */}
        <div className="neo-card p-5">
          <p className="mb-4" style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>Recent Activity</p>
          {!activity ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}</div>
          ) : (
            <div className="space-y-0">
              {activity.slice(0, 8).map((item, idx) => {
                const bg = ACT_STYLE[item.type] ?? PASTEL.sage;
                return (
                  <div key={item.id} className={cn("flex items-start gap-2 py-2.5", idx < 7 && "border-b border-border/40")}>
                    <div className="w-5 h-5 rounded-full border-2 border-foreground/15 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: bg }}>
                      <Zap size={9} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-tight text-foreground/80">{item.message}</p>
                      <p className="text-muted-foreground mt-0.5" style={{ fontFamily: MONO, fontSize: "0.55rem" }}>
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active airdrop list */}
      {active && active.length > 0 && (
        <div className="neo-card p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>🔥 Active Right Now</p>
            <Link href="/airdrops?status=active"
              className="text-primary hover:underline"
              style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700 }}>
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {active.slice(0, 6).map(airdrop => {
              const diff = DIFF_STYLE[airdrop.difficulty] ?? PASTEL.sage;
              return (
                <Link href={`/airdrops/${airdrop.id}`} key={airdrop.id}>
                  <div className="p-3.5 rounded-2xl border-2 border-foreground/15 hover:border-foreground/40 transition-all cursor-pointer hover:-translate-y-0.5"
                    style={{ boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg border-2 border-foreground/20 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: airdrop.logoColor, fontFamily: DISPLAY }}>
                        {airdrop.logoInitial}
                      </div>
                      <p className="font-bold truncate flex-1" style={{ fontFamily: DISPLAY, fontSize: "0.75rem" }}>{airdrop.name}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full border-2 border-foreground/20"
                        style={{ backgroundColor: diff, fontFamily: MONO, fontSize: "0.55rem", fontWeight: 700 }}>
                        {airdrop.difficulty}
                      </span>
                      <span className="text-primary font-bold" style={{ fontFamily: MONO, fontSize: "0.65rem" }}>
                        {airdrop.rewardEstimate ?? "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.58rem" }}>
                      <CheckCircle size={10} />
                      {airdrop.taskCount} tasks · {airdrop.chain}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

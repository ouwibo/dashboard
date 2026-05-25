import { useState } from "react";
import { ExternalLink, Clock, Search, Tag, Flame, TrendingUp, BookOpen, Layers, Cpu, Gamepad2, BarChart2 } from "lucide-react";
import { mockNews } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

const CATEGORIES = ["All", "DeFi", "Layer 1", "Layer 2", "Infrastructure", "Gaming", "Guide", "Analysis"];

const CAT_ICONS: Record<string, React.ElementType> = {
  "All": Flame,
  "DeFi": TrendingUp,
  "Layer 1": Layers,
  "Layer 2": Layers,
  "Infrastructure": Cpu,
  "Gaming": Gamepad2,
  "Guide": BookOpen,
  "Analysis": BarChart2,
};

const CAT_COLORS: Record<string, string> = {
  "All": "#f97316",
  "DeFi": "#10b981",
  "Layer 1": "#8b5cf6",
  "Layer 2": "#3b82f6",
  "Infrastructure": "#06b6d4",
  "Gaming": "#f43f5e",
  "Guide": "#f59e0b",
  "Analysis": "#a855f7",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function HeroCard({ article }: { article: any }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border-2 border-border overflow-hidden hover:-translate-y-0.5 transition-transform duration-200"
      style={{ boxShadow: "4px 4px 0 hsl(var(--border))" }}
    >
      <div
        className="relative h-48 flex items-end p-6"
        style={{ background: `linear-gradient(135deg, ${article.imageColor}dd 0%, ${article.imageColor}44 100%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10">
          <span
            className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold mb-2 text-white"
            style={{ backgroundColor: CAT_COLORS[article.category] || "#f97316", fontFamily: MONO }}
          >
            {article.category}
          </span>
          <h2 className="text-white font-black text-lg leading-tight" style={{ fontFamily: DISPLAY }}>
            {article.title}
          </h2>
        </div>
      </div>
      <div className="bg-card p-4">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2" style={{ fontFamily: MONO, fontSize: "0.72rem" }}>
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground" style={{ fontFamily: MONO }}>
              {article.source}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground" style={{ fontFamily: MONO }}>
              <Clock size={10} /> {timeAgo(article.publishedAt)}
            </span>
            <span className="text-[10px] text-muted-foreground" style={{ fontFamily: MONO }}>
              {article.readTime} read
            </span>
          </div>
          <ExternalLink size={14} className="text-muted-foreground" />
        </div>
      </div>
    </a>
  );
}

function NewsCard({ article }: { article: any }) {
  const catColor = CAT_COLORS[article.category] || "#f97316";
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 p-4 rounded-2xl border-2 border-border bg-card hover:bg-muted/40 transition-colors group"
      style={{ boxShadow: "2px 2px 0 hsl(var(--border))" }}
    >
      <div
        className="w-16 h-16 shrink-0 rounded-xl flex items-center justify-center font-black text-white text-xs"
        style={{ background: `linear-gradient(135deg, ${catColor}cc, ${catColor}55)`, fontFamily: DISPLAY }}
      >
        {article.source.substring(0, 3).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: catColor, fontFamily: MONO }}
          >
            {article.category}
          </span>
          <span className="text-[10px] text-muted-foreground" style={{ fontFamily: MONO }}>
            {timeAgo(article.publishedAt)}
          </span>
        </div>
        <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors" style={{ fontFamily: DISPLAY, fontSize: "0.8rem" }}>
          {article.title}
        </h3>
        <p className="text-muted-foreground line-clamp-1" style={{ fontFamily: MONO, fontSize: "0.65rem" }}>
          {article.summary}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] text-muted-foreground" style={{ fontFamily: MONO }}>
            {article.source} · {article.readTime} read
          </span>
          <div className="flex gap-1 ml-auto">
            {article.tags.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded border border-border text-muted-foreground"
                style={{ fontFamily: MONO }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = mockNews.filter(n => {
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const hero = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Crypto News
        </h1>
        <p className="text-muted-foreground mt-1" style={{ fontFamily: MONO, fontSize: "0.72rem" }}>
          Latest updates on airdrops, DeFi & blockchain
        </p>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search news..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border bg-background"
            style={{ fontFamily: MONO, fontSize: "0.72rem", boxShadow: "3px 3px 0 hsl(var(--border))" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => {
            const Icon = CAT_ICONS[cat] || Tag;
            const color = CAT_COLORS[cat] || "#f97316";
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-border transition-all",
                  active ? "text-white" : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                style={{
                  fontFamily: MONO,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  boxShadow: "2px 2px 0 hsl(var(--border))",
                  backgroundColor: active ? color : undefined,
                  borderColor: active ? color : undefined,
                }}
              >
                <Icon size={12} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">📰</p>
          <p className="font-black text-lg" style={{ fontFamily: DISPLAY }}>No articles found</p>
          <p className="text-sm mt-1" style={{ fontFamily: MONO }}>Try a different search or category</p>
        </div>
      )}

      {/* Hero Article */}
      {hero && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <HeroCard article={hero} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-3">
            {rest.slice(0, 2).map(a => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}

      {/* Rest of articles */}
      {rest.length > 2 && (
        <div>
          <h2 className="font-black mb-4" style={{ fontFamily: DISPLAY, fontSize: "1rem" }}>
            More Stories
          </h2>
          <div className="flex flex-col gap-3">
            {rest.slice(2).map(a => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

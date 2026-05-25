import { useState } from "react";
import { Link } from "wouter";
import { Plus, Zap, CheckCircle, Trash2, Pencil, Search, Globe, Twitter, Send, Star, ExternalLink, Users, ListChecks, TrendingUp, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { mockAirdrops } from "@/lib/mockData";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

const PASTEL = { sky: "#b8d8f0", mint: "#b8e8c8", peach: "#f0c4a8", lavender: "#d4c0f0", yellow: "#f0e0a0", sage: "#c8dcc0" };
const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: "#10b981", color: "#fff", label: "Active"    },
  upcoming:  { bg: "#f59e0b", color: "#fff", label: "Upcoming"  },
  ended:     { bg: "#6b7280", color: "#fff", label: "Ended"     },
  potential: { bg: "#8b5cf6", color: "#fff", label: "Potential" },
};
const DIFF_STYLE: Record<string, { bg: string; color: string }> = { 
  easy: { bg: "#10b981", color: "#fff" }, 
  medium: { bg: "#f59e0b", color: "#fff" }, 
  hard: { bg: "#ef4444", color: "#fff" } 
};
const LOGO_COLORS = ["#d95c38","#3b82f6","#10b981","#8b5cf6","#f59e0b","#ec4899","#06b6d4","#f97316","#14b8a6","#a855f7"];
const CATEGORIES = ["defi","nft","layer1","layer2","gaming","dao","infrastructure","wallet","exchange"];
const CHAINS = ["ETH","SOL","BNB","ARB","OP","BASE","APT","SUI","AVAX","MATIC","HYP","MON","BERA","HYP"];
const STATUSES = ["active","upcoming","ended","potential"];
const DIFFICULTIES = ["easy","medium","hard"];

interface Airdrop {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoColor: string;
  logoInitial: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  telegramUrl: string | null;
  discordUrl: string | null;
  category: string;
  chain: string;
  status: string;
  rewardEstimate: string | null;
  totalValue: string | null;
  difficulty: string;
  isFeatured: boolean;
  isVerified: boolean;
  participantsCount: number;
  taskCount: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

type FilterStatus = "all" | "active" | "upcoming" | "ended" | "potential";
type SortField = "rank" | "name" | "participants" | "tasks" | "reward";
type SortOrder = "asc" | "desc";

export default function AirdropsPage() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>(mockAirdrops);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "", slug: "", description: "", logoColor: "#d95c38", logoInitial: "",
    websiteUrl: "", twitterUrl: "", telegramUrl: "", discordUrl: "",
    category: "defi", chain: "ETH", status: "active", rewardEstimate: "", totalValue: "",
    difficulty: "medium", isFeatured: false, isVerified: false, startDate: "", endDate: ""
  });
  const [editForm, setEditForm] = useState(createForm);
  
  const { toast } = useToast();

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  const filteredAirdrops = airdrops.filter(a => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sortedAirdrops = [...filteredAirdrops].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name": comparison = a.name.localeCompare(b.name); break;
      case "participants": comparison = a.participantsCount - b.participantsCount; break;
      case "tasks": comparison = a.taskCount - b.taskCount; break;
      case "reward": comparison = (a.rewardEstimate || "").localeCompare(b.rewardEstimate || ""); break;
      default: comparison = a.id - b.id;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  function handleCreate() {
    if (!createForm.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const newAirdrop: Airdrop = {
      id: Math.max(...airdrops.map(a => a.id)) + 1,
      slug: createForm.slug || createForm.name.toLowerCase().replace(/\s+/g, "-"),
      logoColor: createForm.logoColor,
      logoInitial: createForm.logoInitial || createForm.name.charAt(0).toUpperCase(),
      participantsCount: 0,
      taskCount: 0,
      createdAt: new Date().toISOString(),
      ...createForm,
    } as Airdrop;
    setAirdrops([...airdrops, newAirdrop]);
    setShowCreate(false);
    setCreateForm({ name: "", slug: "", description: "", logoColor: "#d95c38", logoInitial: "", websiteUrl: "", twitterUrl: "", telegramUrl: "", discordUrl: "", category: "defi", chain: "ETH", status: "active", rewardEstimate: "", totalValue: "", difficulty: "medium", isFeatured: false, isVerified: false, startDate: "", endDate: "" });
    toast({ title: "Airdrop added!" });
  }

  function handleEdit() {
    if (!editingId) return;
    setAirdrops(airdrops.map(a => a.id === editingId ? { ...a, ...editForm } : a));
    setEditingId(null);
    toast({ title: "Updated!" });
  }

  function handleDelete(id: number, name: string) {
    setAirdrops(airdrops.filter(a => a.id !== id));
    toast({ title: `"${name}" removed` });
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Airdrops
          </h1>
          <p className="text-muted-foreground mt-1" style={{ fontFamily: MONO, fontSize: "0.72rem" }}>
            Track and manage crypto airdrops
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="neo-button px-4 py-2 rounded-xl bg-primary text-white flex items-center gap-2"
          style={{ border: "2px solid hsl(var(--border))", boxShadow: "3px 3px 0 hsl(var(--border))", fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700 }}
        >
          <Plus size={14} /> Add Airdrop
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search airdrops..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border bg-background"
            style={{ fontFamily: MONO, fontSize: "0.72rem", boxShadow: "3px 3px 0 hsl(var(--border))" }}
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "upcoming", "ended", "potential"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as FilterStatus)}
              className={cn(
                "px-3 py-2 rounded-xl border-2 border-border transition-all capitalize",
                filterStatus === status ? "bg-foreground text-background" : "bg-background hover:bg-muted"
              )}
              style={{ fontFamily: MONO, fontSize: "0.68rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-border overflow-hidden" style={{ boxShadow: "4px 4px 0 hsl(var(--border))" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b-2 border-border">
                <th className="text-left p-4 cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("rank")} style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>
                  # <SortIcon field="rank" />
                </th>
                <th className="text-left p-4 cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("name")} style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>
                  Name <SortIcon field="name" />
                </th>
                <th className="text-left p-4" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>Status</th>
                <th className="text-left p-4" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>Chain</th>
                <th className="text-left p-4" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>Reward</th>
                <th className="text-right p-4 cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("participants")} style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>
                  Users <SortIcon field="participants" />
                </th>
                <th className="text-right p-4 cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort("tasks")} style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>
                  Tasks <SortIcon field="tasks" />
                </th>
                <th className="text-center p-4" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>Difficulty</th>
                <th className="text-center p-4" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAirdrops.map((airdrop, idx) => (
                <tr key={airdrop.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4" style={{ fontFamily: MONO, fontSize: "0.75rem", fontWeight: 700 }}>{idx + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: airdrop.logoColor, fontFamily: DISPLAY, fontSize: "0.9rem", border: "2px solid hsl(var(--border))", boxShadow: "2px 2px 0 hsl(var(--border))" }}
                      >
                        {airdrop.logoInitial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>{airdrop.name}</span>
                          {airdrop.isVerified && <CheckCircle size={14} className="text-primary" />}
                        </div>
                        <div className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.6rem" }}>{airdrop.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: STATUS_STYLE[airdrop.status]?.bg || "#6b7280", color: STATUS_STYLE[airdrop.status]?.color || "#fff", fontFamily: MONO }}>
                      {STATUS_STYLE[airdrop.status]?.label || airdrop.status}
                    </span>
                  </td>
                  <td className="p-4" style={{ fontFamily: MONO, fontSize: "0.72rem" }}>{airdrop.chain}</td>
                  <td className="p-4" style={{ fontFamily: MONO, fontSize: "0.72rem", color: "hsl(var(--primary))" }}>{airdrop.rewardEstimate || "-"}</td>
                  <td className="p-4 text-right" style={{ fontFamily: MONO, fontSize: "0.72rem" }}>{(airdrop.participantsCount / 1000).toFixed(0)}K</td>
                  <td className="p-4 text-right" style={{ fontFamily: MONO, fontSize: "0.72rem" }}>{airdrop.taskCount}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: DIFF_STYLE[airdrop.difficulty]?.bg || "#6b7280", color: DIFF_STYLE[airdrop.difficulty]?.color || "#fff", fontFamily: MONO }}>
                      {airdrop.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href={airdrop.referralUrl || airdrop.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
                        style={{ fontFamily: MONO }}
                      >
                        Join
                      </a>
                      <Link href={`/airdrops/${airdrop.id}`}>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="View details">
                          <ExternalLink size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => { setEditForm({ ...airdrop }); setEditingId(airdrop.id); }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(airdrop.id, airdrop.name)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedAirdrops.length === 0 && (
          <div className="p-8 text-center text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.75rem" }}>
            No airdrops found. Add one to get started!
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: DISPLAY }}>Add Airdrop</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Name *</Label>
                <Input value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Status</Label>
                <Select value={createForm.status} onValueChange={v => setCreateForm({ ...createForm, status: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Description</Label>
              <Input value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Chain</Label>
                <Select value={createForm.chain} onValueChange={v => setCreateForm({ ...createForm, chain: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{CHAINS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Difficulty</Label>
                <Select value={createForm.difficulty} onValueChange={v => setCreateForm({ ...createForm, difficulty: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Reward Estimate</Label>
              <Input value={createForm.rewardEstimate} onChange={e => setCreateForm({ ...createForm, rewardEstimate: e.target.value })} placeholder="$100 - $1,000" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl border-2 border-border" style={{ fontFamily: MONO }}>Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 rounded-xl bg-primary text-white" style={{ fontFamily: MONO }}>Add</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: DISPLAY }}>Edit Airdrop</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Name</Label>
                <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Status</Label>
                <Select value={editForm.status} onValueChange={v => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Description</Label>
              <Input value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Chain</Label>
                <Select value={editForm.chain} onValueChange={v => setEditForm({ ...editForm, chain: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{CHAINS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Difficulty</Label>
                <Select value={editForm.difficulty} onValueChange={v => setEditForm({ ...editForm, difficulty: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.65rem" }}>Reward Estimate</Label>
              <Input value={editForm.rewardEstimate} onChange={e => setEditForm({ ...editForm, rewardEstimate: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl border-2 border-border" style={{ fontFamily: MONO }}>Cancel</button>
            <button onClick={handleEdit} className="px-4 py-2 rounded-xl bg-primary text-white" style={{ fontFamily: MONO }}>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

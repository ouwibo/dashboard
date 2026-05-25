import { useState } from "react";
import { Link } from "wouter";
import {
  useListAirdrops, getListAirdropsQueryKey,
  useCreateAirdrop, useUpdateAirdrop, useDeleteAirdrop,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Zap, CheckCircle, Trash2, Pencil, Search, Globe, Twitter, Send, Star, ExternalLink, Users, ListChecks, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

interface AirdropForm {
  name: string; slug: string; description: string; logoColor: string; logoInitial: string;
  websiteUrl: string; twitterUrl: string; telegramUrl: string; discordUrl: string;
  category: string; chain: string; status: string; rewardEstimate: string; totalValue: string;
  difficulty: string; isFeatured: boolean; isVerified: boolean; startDate: string; endDate: string;
}
const DEFAULT: AirdropForm = { name:"",slug:"",description:"",logoColor:"#d95c38",logoInitial:"",
  websiteUrl:"",twitterUrl:"",telegramUrl:"",discordUrl:"",category:"defi",chain:"ETH",
  status:"active",rewardEstimate:"",totalValue:"",difficulty:"medium",isFeatured:false,isVerified:false,
  startDate:"",endDate:"" };

type FilterStatus = "all" | "active" | "upcoming" | "ended" | "potential";
type SortField = "rank" | "name" | "participants" | "tasks" | "reward";
type SortOrder = "asc" | "desc";

function AirdropFormDialog({ open, onClose, form, setForm, onSubmit, isPending, mode }: {
  open: boolean; onClose: () => void; form: AirdropForm; setForm: (v: AirdropForm) => void;
  onSubmit: () => void; isPending: boolean; mode: "create" | "edit";
}) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ border: "2px solid hsl(var(--border))", boxShadow: "6px 6px 0 hsl(var(--border))", borderRadius: "18px" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: DISPLAY, fontSize: "0.95rem" }}>
            {mode === "create" ? "Add Airdrop" : "Edit Airdrop"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Name *</Label>
              <Input className="mt-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, logoInitial: form.logoInitial || e.target.value.charAt(0).toUpperCase(), slug: form.slug || e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="e.g. LayerZero" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Slug *</Label>
              <Input className="mt-1" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                placeholder="layerzero" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
          </div>
          <div>
            <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Description</Label>
            <Input className="mt-1" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Short description" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger className="mt-1" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px", fontFamily: MONO, fontSize: "0.65rem" }}><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Chain</Label>
              <Select value={form.chain} onValueChange={v => setForm({ ...form, chain: v })}>
                <SelectTrigger className="mt-1" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px", fontFamily: MONO, fontSize: "0.65rem" }}><SelectValue /></SelectTrigger>
                <SelectContent>{CHAINS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px", fontFamily: MONO, fontSize: "0.65rem" }}><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Reward Estimate</Label>
              <Input className="mt-1" value={form.rewardEstimate} onChange={e => setForm({ ...form, rewardEstimate: e.target.value })}
                placeholder="$100 - $1,000" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={v => setForm({ ...form, difficulty: v })}>
                <SelectTrigger className="mt-1" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px", fontFamily: MONO, fontSize: "0.65rem" }}><SelectValue /></SelectTrigger>
                <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Website URL</Label>
              <Input className="mt-1" value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
                placeholder="https://..." style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Twitter URL</Label>
              <Input className="mt-1" value={form.twitterUrl} onChange={e => setForm({ ...form, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/..." style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
          </div>
          <div>
            <Label style={{ fontFamily: MONO, fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase" }}>Logo Color</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {LOGO_COLORS.map(c => (
                <button key={c} onClick={() => setForm({ ...form, logoColor: c })}
                  className={cn("w-6 h-6 rounded-full border-2 transition-all", form.logoColor === c ? "border-foreground scale-110" : "border-foreground/20 hover:scale-105")}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700 }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
              Featured
            </label>
            <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700 }}>
              <input type="checkbox" checked={form.isVerified} onChange={e => setForm({ ...form, isVerified: e.target.checked })} className="rounded" />
              Verified
            </label>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full border-2 border-border hover:bg-muted transition-all"
            style={{ fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700 }}>Cancel</button>
          <button onClick={onSubmit} disabled={!form.name || !form.slug || isPending}
            className="px-4 py-2 rounded-full bg-primary text-white border-2 border-border disabled:opacity-50 hover:-translate-y-px transition-all"
            style={{ fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700, boxShadow: "3px 3px 0 hsl(var(--border))" }}>
            {isPending ? "Saving…" : mode === "create" ? "Add Airdrop" : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AirdropsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<AirdropForm>(DEFAULT);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AirdropForm>(DEFAULT);
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const params = filterStatus === "all" ? (search ? { search } : undefined) : (search ? { status: filterStatus, search } : { status: filterStatus });
  const { data: airdrops, isLoading } = useListAirdrops(params, {
    query: { queryKey: getListAirdropsQueryKey(params) }
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createAirdrop = useCreateAirdrop();
  const updateAirdrop = useUpdateAirdrop();
  const deleteAirdrop = useDeleteAirdrop();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["listAirdrops"] });
    queryClient.invalidateQueries({ queryKey: getListAirdropsQueryKey() });
  }

  function handleCreate() {
    createAirdrop.mutate(
      { data: { ...createForm, isFeatured: createForm.isFeatured, isVerified: createForm.isVerified, category: createForm.category as "defi", chain: createForm.chain, status: createForm.status as "active", difficulty: createForm.difficulty as "easy" } as Parameters<typeof createAirdrop.mutate>[0]["data"] },
      {
        onSuccess: () => { invalidate(); setShowCreate(false); setCreateForm(DEFAULT); toast({ title: "Airdrop added!" }); },
        onError: () => toast({ title: "Failed to add", variant: "destructive" }),
      }
    );
  }

  function handleEdit() {
    if (!editingId) return;
    updateAirdrop.mutate(
      { id: editingId, data: { ...editForm } as Parameters<typeof updateAirdrop.mutate>[0]["data"] },
      {
        onSuccess: () => { invalidate(); setEditingId(null); toast({ title: "Updated!" }); },
        onError: () => toast({ title: "Failed to update", variant: "destructive" }),
      }
    );
  }

  function handleDelete(id: number, name: string) {
    deleteAirdrop.mutate({ id }, {
      onSuccess: () => { invalidate(); toast({ title: `"${name}" removed` }); },
      onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
    });
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  const sortedAirdrops = airdrops ? [...airdrops].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "participants":
        comparison = (a.participantsCount || 0) - (b.participantsCount || 0);
        break;
      case "tasks":
        comparison = (a.taskCount || 0) - (b.taskCount || 0);
        break;
      case "reward":
        comparison = (a.rewardEstimate || "").localeCompare(b.rewardEstimate || "");
        break;
      default:
        comparison = (a.id || 0) - (b.id || 0);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  }) : [];

  const FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" }, { label: "Active", value: "active" },
    { label: "Upcoming", value: "upcoming" }, { label: "Ended", value: "ended" }, { label: "Potential", value: "potential" },
  ];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.15 }}>Airdrops</h1>
          <p className="text-muted-foreground mt-0.5" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>{airdrops?.length ?? 0} tracked</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full hover:-translate-y-px transition-all"
          style={{ border: "2px solid hsl(var(--border))", boxShadow: "3px 3px 0 hsl(var(--border))", fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700 }}
          data-testid="button-add-airdrop">
          <Plus size={14} /> Add Airdrop
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search airdrops…"
            className="w-full pl-8 pr-4 py-2 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
            style={{ fontFamily: MONO, fontSize: "0.72rem", boxShadow: "2px 2px 0 hsl(var(--border))" }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilterStatus(f.value)}
              className={cn("px-3 py-1.5 rounded-full border-2 transition-all", filterStatus === f.value ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40")}
              style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, boxShadow: filterStatus === f.value ? "2px 2px 0 hsl(var(--border))" : undefined }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crypto-rank style table */}
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
      ) : sortedAirdrops.length > 0 ? (
        <div className="rounded-xl border-2 border-border overflow-hidden" style={{ boxShadow: "4px 4px 0 hsl(var(--border))" }}>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted/50 border-b-2 border-border items-center" style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", color: "hsl(var(--muted-foreground))" }}>
            <div className="col-span-1 text-center cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("rank")}>
              # <SortIcon field="rank" />
            </div>
            <div className="col-span-3 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("name")}>
              Name <SortIcon field="name" />
            </div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Chain</div>
            <div className="col-span-2 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("reward")}>
              Reward <SortIcon field="reward" />
            </div>
            <div className="col-span-1 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("participants")}>
              <Users size={10} className="inline mr-1" />Participants <SortIcon field="participants" />
            </div>
            <div className="col-span-1 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("tasks")}>
              <ListChecks size={10} className="inline mr-1" />Tasks <SortIcon field="tasks" />
            </div>
            <div className="col-span-1 text-center">Difficulty</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {sortedAirdrops.map((airdrop, idx) => {
              const st = STATUS_STYLE[airdrop.status] ?? { bg: "#6b7280", color: "#fff", label: airdrop.status };
              const diff = DIFF_STYLE[airdrop.difficulty] ?? { bg: "#6b7280", color: "#fff" };
              return (
                <div key={airdrop.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors group" data-testid={`airdrop-row-${airdrop.id}`}>
                  {/* Rank */}
                  <div className="col-span-1 text-center font-bold" style={{ fontFamily: MONO, fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                    {idx + 1}
                  </div>

                  {/* Name + Logo */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                      style={{ backgroundColor: airdrop.logoColor, fontFamily: DISPLAY, fontSize: "0.85rem" }}>
                      {airdrop.logoInitial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/airdrops/${airdrop.id}`}>
                          <span className="font-bold hover:text-primary transition-colors cursor-pointer truncate" style={{ fontFamily: DISPLAY, fontSize: "0.85rem" }}>
                            {airdrop.name}
                          </span>
                        </Link>
                        {airdrop.isVerified && <CheckCircle size={11} className="text-primary shrink-0" />}
                        {airdrop.isFeatured && <Star size={11} className="text-amber-500 shrink-0" />}
                      </div>
                      <p className="text-muted-foreground truncate" style={{ fontFamily: MONO, fontSize: "0.6rem" }}>{airdrop.category}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: st.bg, color: st.color, fontFamily: MONO, fontSize: "0.55rem" }}>
                      {st.label}
                    </span>
                  </div>

                  {/* Chain */}
                  <div className="col-span-1 text-center" style={{ fontFamily: MONO, fontSize: "0.68rem", color: "hsl(var(--muted-foreground))" }}>
                    {airdrop.chain}
                  </div>

                  {/* Reward */}
                  <div className="col-span-2 text-right">
                    <span className="font-bold text-primary" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>
                      {airdrop.rewardEstimate || "-"}
                    </span>
                  </div>

                  {/* Participants */}
                  <div className="col-span-1 text-right" style={{ fontFamily: MONO, fontSize: "0.68rem", color: "hsl(var(--muted-foreground))" }}>
                    {airdrop.participantsCount > 0 ? `${(airdrop.participantsCount / 1000).toFixed(1)}k` : "-"}
                  </div>

                  {/* Tasks */}
                  <div className="col-span-1 text-right" style={{ fontFamily: MONO, fontSize: "0.68rem", color: "hsl(var(--muted-foreground))" }}>
                    {airdrop.taskCount || 0}
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-1 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: diff.bg, color: diff.color, fontFamily: MONO, fontSize: "0.55rem" }}>
                      {airdrop.difficulty}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/airdrops/${airdrop.id}`}>
                      <button className="w-6 h-6 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all" title="View details">
                        <ExternalLink size={11} />
                      </button>
                    </Link>
                    <button onClick={() => { setEditingId(airdrop.id); setEditForm({ name: airdrop.name, slug: airdrop.slug, description: airdrop.description ?? "", logoColor: airdrop.logoColor, logoInitial: airdrop.logoInitial, websiteUrl: airdrop.websiteUrl ?? "", twitterUrl: airdrop.twitterUrl ?? "", telegramUrl: airdrop.telegramUrl ?? "", discordUrl: airdrop.discordUrl ?? "", category: airdrop.category, chain: airdrop.chain, status: airdrop.status, rewardEstimate: airdrop.rewardEstimate ?? "", totalValue: airdrop.totalValue ?? "", difficulty: airdrop.difficulty, isFeatured: airdrop.isFeatured, isVerified: airdrop.isVerified, startDate: airdrop.startDate ?? "", endDate: airdrop.endDate ?? "" }); }}
                      className="w-6 h-6 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all" title="Edit">
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => handleDelete(airdrop.id, airdrop.name)}
                      className="w-6 h-6 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/40 transition-all" title="Delete">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl border-2 border-dashed border-border">
          <Zap size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-bold mb-1" style={{ fontFamily: DISPLAY, fontSize: "0.9rem" }}>No airdrops found</p>
          <p className="text-muted-foreground mb-5" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>
            {filterStatus !== "all" || search ? "Try a different filter" : "Add the first airdrop"}
          </p>
          {filterStatus === "all" && !search && (
            <button onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full"
              style={{ border: "2px solid hsl(var(--border))", boxShadow: "3px 3px 0 hsl(var(--border))", fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700 }}>
              <Plus size={14} /> Add Airdrop
            </button>
          )}
        </div>
      )}

      <AirdropFormDialog open={showCreate} onClose={() => setShowCreate(false)} form={createForm} setForm={setCreateForm} onSubmit={handleCreate} isPending={createAirdrop.isPending} mode="create" />
      {editingId !== null && <AirdropFormDialog open={true} onClose={() => setEditingId(null)} form={editForm} setForm={setEditForm} onSubmit={handleEdit} isPending={updateAirdrop.isPending} mode="edit" />}
    </div>
  );
}

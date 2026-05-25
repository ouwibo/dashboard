import { useState } from "react";
import { Link } from "wouter";
import {
  useListAirdrops, getListAirdropsQueryKey,
  useCreateAirdrop, useUpdateAirdrop, useDeleteAirdrop,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Zap, CheckCircle, Trash2, Pencil, Search, Globe, Twitter, Send, Star } from "lucide-react";
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
const STATUS_STYLE: Record<string, { bg: string; label: string }> = {
  active:    { bg: PASTEL.mint,     label: "Active"    },
  upcoming:  { bg: PASTEL.yellow,   label: "Upcoming"  },
  ended:     { bg: PASTEL.sage,     label: "Ended"     },
  potential: { bg: PASTEL.lavender, label: "Potential" },
};
const DIFF_STYLE: Record<string, string> = { easy: PASTEL.mint, medium: PASTEL.yellow, hard: PASTEL.peach };
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

  const FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" }, { label: "Active", value: "active" },
    { label: "Upcoming", value: "upcoming" }, { label: "Ended", value: "ended" }, { label: "Potential", value: "potential" },
  ];

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

      {/* Airdrop list — landscape cards */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : airdrops && airdrops.length > 0 ? (
        <div className="space-y-2">
          {airdrops.map((airdrop, idx) => {
            const st = STATUS_STYLE[airdrop.status] ?? { bg: PASTEL.sage, label: airdrop.status };
            const diff = DIFF_STYLE[airdrop.difficulty] ?? PASTEL.sage;
            return (
              <div key={airdrop.id} className="neo-card group" data-testid={`airdrop-card-${airdrop.id}`}>
                <div className="flex items-center gap-4 p-4">
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-2xl border-2 border-foreground/20 flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: airdrop.logoColor, fontFamily: DISPLAY, fontSize: "1rem", boxShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}>
                    {airdrop.logoInitial}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Link href={`/airdrops/${airdrop.id}`}>
                        <span className="font-bold hover:text-primary transition-colors cursor-pointer" style={{ fontFamily: DISPLAY, fontSize: "0.88rem" }}>
                          {airdrop.name}
                        </span>
                      </Link>
                      {airdrop.isVerified && <CheckCircle size={12} className="text-primary shrink-0" />}
                      {airdrop.isFeatured && <Star size={12} className="text-amber-500 shrink-0" />}
                      <span className="px-2 py-0.5 rounded-full border-2 border-foreground/20 text-foreground/70"
                        style={{ backgroundColor: st.bg, fontFamily: MONO, fontSize: "0.57rem", fontWeight: 700 }}>
                        {st.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full border-2 border-foreground/15 text-foreground/60"
                        style={{ backgroundColor: diff, fontFamily: MONO, fontSize: "0.57rem", fontWeight: 700 }}>
                        {airdrop.difficulty}
                      </span>
                    </div>
                    {airdrop.description && (
                      <p className="text-muted-foreground text-xs truncate mb-1.5">{airdrop.description}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap" style={{ fontFamily: MONO, fontSize: "0.58rem" }}>
                      <span className="text-muted-foreground">{airdrop.chain}</span>
                      <span className="text-muted-foreground">{airdrop.category}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><CheckCircle size={10} />{airdrop.taskCount} tasks</span>
                      {airdrop.participantsCount > 0 && <span className="text-muted-foreground">{(airdrop.participantsCount / 1000).toFixed(0)}k participants</span>}
                    </div>
                  </div>

                  {/* Reward + links */}
                  <div className="shrink-0 text-right hidden sm:block">
                    {airdrop.rewardEstimate && (
                      <p className="font-bold text-primary mb-1" style={{ fontFamily: MONO, fontSize: "0.75rem" }}>{airdrop.rewardEstimate}</p>
                    )}
                    {airdrop.totalValue && (
                      <p className="text-muted-foreground mb-1.5" style={{ fontFamily: MONO, fontSize: "0.6rem" }}>TVL {airdrop.totalValue}</p>
                    )}
                    <div className="flex items-center gap-1.5 justify-end">
                      {airdrop.websiteUrl && <a href={airdrop.websiteUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-lg border-2 border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"><Globe size={11} /></a>}
                      {airdrop.twitterUrl && <a href={airdrop.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-lg border-2 border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"><Twitter size={11} /></a>}
                      {airdrop.telegramUrl && <a href={airdrop.telegramUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-lg border-2 border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"><Send size={11} /></a>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/airdrops/${airdrop.id}`}>
                      <button className="px-3 py-1.5 rounded-xl border-2 border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-all"
                        style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700 }}>
                        Detail
                      </button>
                    </Link>
                    <button onClick={() => { setEditingId(airdrop.id); setEditForm({ name: airdrop.name, slug: airdrop.slug, description: airdrop.description ?? "", logoColor: airdrop.logoColor, logoInitial: airdrop.logoInitial, websiteUrl: airdrop.websiteUrl ?? "", twitterUrl: airdrop.twitterUrl ?? "", telegramUrl: airdrop.telegramUrl ?? "", discordUrl: airdrop.discordUrl ?? "", category: airdrop.category, chain: airdrop.chain, status: airdrop.status, rewardEstimate: airdrop.rewardEstimate ?? "", totalValue: airdrop.totalValue ?? "", difficulty: airdrop.difficulty, isFeatured: airdrop.isFeatured, isVerified: airdrop.isVerified, startDate: airdrop.startDate ?? "", endDate: airdrop.endDate ?? "" }); }}
                      className="w-7 h-7 rounded-xl border-2 border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"
                      data-testid={`button-edit-airdrop-${airdrop.id}`}><Pencil size={12} /></button>
                    <button onClick={() => handleDelete(airdrop.id, airdrop.name)}
                      className="w-7 h-7 rounded-xl border-2 border-foreground/15 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-all"
                      data-testid={`button-delete-airdrop-${airdrop.id}`}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            );
          })}
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

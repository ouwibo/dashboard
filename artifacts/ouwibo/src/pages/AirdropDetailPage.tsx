import { useParams, Link } from "wouter";
import {
  useGetAirdrop, getGetAirdropQueryKey,
  useListAirdropTasks, getListAirdropTasksQueryKey,
  useCreateAirdropTask, useUpdateAirdropTask, useDeleteAirdropTask,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Globe, Twitter, Send, Plus, Trash2, ExternalLink, Zap, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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
const TASK_TYPE_ICONS: Record<string, { icon: string; bg: string }> = {
  follow_twitter:    { icon: "𝕏",  bg: PASTEL.sky },
  join_telegram:     { icon: "✈️", bg: PASTEL.sky },
  join_discord:      { icon: "💬", bg: PASTEL.lavender },
  complete_quiz:     { icon: "📝", bg: PASTEL.yellow },
  stake:             { icon: "🔒", bg: PASTEL.peach },
  bridge:            { icon: "🌉", bg: PASTEL.mint },
  swap:              { icon: "🔄", bg: PASTEL.mint },
  provide_liquidity: { icon: "💧", bg: PASTEL.sky },
  register:          { icon: "📋", bg: PASTEL.sage },
  other:             { icon: "⚡", bg: PASTEL.peach },
};
const TASK_TYPES = ["follow_twitter","join_telegram","join_discord","complete_quiz","stake","bridge","swap","provide_liquidity","register","other"];

interface TaskForm { title: string; description: string; link: string; taskType: string; isRequired: boolean; }
const DEFAULT_TASK: TaskForm = { title: "", description: "", link: "", taskType: "other", isRequired: true };

export default function AirdropDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: airdrop, isLoading: airdropLoading } = useGetAirdrop(id, {
    query: { enabled: !!id, queryKey: getGetAirdropQueryKey(id) },
  });
  const { data: tasks, isLoading: tasksLoading } = useListAirdropTasks(id, {
    query: { enabled: !!id, queryKey: getListAirdropTasksQueryKey(id) },
  });

  const createTask = useCreateAirdropTask();
  const deleteTask  = useDeleteAirdropTask();

  const [showCreate, setShowCreate] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskForm>(DEFAULT_TASK);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  function toggleComplete(taskId: number) {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  }

  function handleCreateTask() {
    createTask.mutate(
      { id, data: { title: taskForm.title, description: taskForm.description || undefined, link: taskForm.link || undefined, taskType: taskForm.taskType as "other", isRequired: taskForm.isRequired } },
      {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAirdropTasksQueryKey(id) }); setShowCreate(false); setTaskForm(DEFAULT_TASK); toast({ title: "Task added" }); },
        onError: () => toast({ title: "Failed to add task", variant: "destructive" }),
      }
    );
  }

  function handleDeleteTask(taskId: number) {
    deleteTask.mutate({ id: taskId }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAirdropTasksQueryKey(id) }); toast({ title: "Task removed" }); },
    });
  }

  const st = airdrop ? STATUS_STYLE[airdrop.status] ?? { bg: PASTEL.sage, label: airdrop.status } : null;
  const diff = airdrop ? DIFF_STYLE[airdrop.difficulty] ?? PASTEL.sage : null;
  const completedCount = completedTasks.size;
  const totalCount = tasks?.length ?? 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/airdrops"
          className="w-9 h-9 rounded-xl border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/60 transition-all"
          style={{ boxShadow: "2px 2px 0 hsl(var(--border))" }}>
          <ArrowLeft size={15} />
        </Link>
        {airdropLoading ? <Skeleton className="h-8 w-48 rounded-xl" /> : airdrop ? (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-xl border-2 border-foreground/20 flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: airdrop.logoColor, fontFamily: DISPLAY, fontSize: "1rem", boxShadow: "2px 2px 0 hsl(var(--border))" }}>
              {airdrop.logoInitial}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 style={{ fontFamily: DISPLAY, fontSize: "1.2rem", fontWeight: 700 }}>{airdrop.name}</h1>
                {airdrop.isVerified && <CheckCircle size={14} className="text-primary" />}
                {airdrop.isFeatured && <Star size={14} className="text-amber-500" />}
              </div>
              <p className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.62rem" }}>{airdrop.chain} · {airdrop.category}</p>
            </div>
            {st && <span className="px-2.5 py-1 rounded-full border-2 border-foreground/25 text-foreground/70"
              style={{ backgroundColor: st.bg, fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700 }}>{st.label}</span>}
          </div>
        ) : null}
      </div>

      {airdrop && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Main info */}
          <div className="lg:col-span-2 neo-card p-5">
            {airdrop.description && (
              <p className="text-foreground/80 text-sm mb-4 leading-relaxed">{airdrop.description}</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Reward", value: airdrop.rewardEstimate ?? "TBD", bg: PASTEL.mint },
                { label: "Total Value", value: airdrop.totalValue ?? "N/A", bg: PASTEL.sky },
                { label: "Difficulty", value: airdrop.difficulty, bg: diff! },
                { label: "Participants", value: airdrop.participantsCount > 0 ? `${(airdrop.participantsCount / 1000).toFixed(0)}k` : "N/A", bg: PASTEL.lavender },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl border-2 border-foreground/15 text-center"
                  style={{ backgroundColor: item.bg, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                  <p className="font-bold" style={{ fontFamily: DISPLAY, fontSize: "0.9rem" }}>{item.value}</p>
                  <p className="text-foreground/60 mt-0.5" style={{ fontFamily: MONO, fontSize: "0.58rem" }}>{item.label}</p>
                </div>
              ))}
            </div>
            {/* Links */}
            <div className="flex gap-2 flex-wrap">
              {airdrop.websiteUrl && (
                <a href={airdrop.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-all"
                  style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                  <Globe size={11} /> Website
                </a>
              )}
              {airdrop.twitterUrl && (
                <a href={airdrop.twitterUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-all"
                  style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                  <Twitter size={11} /> Twitter
                </a>
              )}
              {airdrop.telegramUrl && (
                <a href={airdrop.telegramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-all"
                  style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                  <Send size={11} /> Telegram
                </a>
              )}
              {airdrop.discordUrl && (
                <a href={airdrop.discordUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-all"
                  style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                  Discord
                </a>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="neo-card p-5" style={{ backgroundColor: PASTEL.sky }}>
            <p style={{ fontFamily: DISPLAY, fontSize: "0.8rem", fontWeight: 700, marginBottom: "1rem" }}>Your Progress</p>
            <div className="text-center mb-4">
              <p style={{ fontFamily: DISPLAY, fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>{progress}%</p>
              <p className="text-foreground/60 mt-1" style={{ fontFamily: MONO, fontSize: "0.62rem" }}>{completedCount} / {totalCount} tasks done</p>
            </div>
            <div className="h-3 bg-foreground/15 rounded-full border-2 border-foreground/20 overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all duration-500 bg-primary" style={{ width: `${progress}%` }} />
            </div>
            {progress === 100 ? (
              <div className="text-center p-2 rounded-xl border-2 border-foreground/20 bg-white/40">
                <p style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700 }}>🎉 All tasks complete!</p>
              </div>
            ) : (
              <p className="text-foreground/60 text-center" style={{ fontFamily: MONO, fontSize: "0.62rem" }}>
                {totalCount - completedCount} task{totalCount - completedCount !== 1 ? "s" : ""} remaining
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="neo-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>
            Tasks {tasks && <span className="text-muted-foreground font-normal" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>({tasks.length})</span>}
          </p>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full hover:-translate-y-px transition-all"
            style={{ border: "2px solid hsl(var(--border))", boxShadow: "2px 2px 0 hsl(var(--border))", fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700 }}
            data-testid="button-add-task">
            <Plus size={12} /> Add Task
          </button>
        </div>

        {tasksLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}</div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map(task => {
              const ti = TASK_TYPE_ICONS[task.taskType] ?? TASK_TYPE_ICONS.other;
              const done = completedTasks.has(task.id);
              return (
                <div key={task.id}
                  className={cn("group flex items-start gap-3 p-4 rounded-2xl border-2 transition-all", done ? "border-primary/30 bg-primary/5" : "border-foreground/10 hover:border-foreground/25")}
                  data-testid={`task-item-${task.id}`}>
                  {/* Complete toggle */}
                  <button onClick={() => toggleComplete(task.id)}
                    className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all", done ? "bg-primary border-primary text-white" : "border-foreground/25 hover:border-primary")}
                    data-testid={`button-complete-task-${task.id}`}>
                    {done && <CheckCircle size={12} />}
                  </button>

                  {/* Task type icon */}
                  <div className="w-9 h-9 rounded-xl border-2 border-foreground/15 flex items-center justify-center shrink-0 text-base"
                    style={{ backgroundColor: ti.bg }}>
                    {ti.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={cn("font-semibold text-sm", done && "line-through text-muted-foreground")}>{task.title}</p>
                      {!task.isRequired && (
                        <span className="px-1.5 py-0.5 rounded-full border border-foreground/15 text-foreground/40"
                          style={{ fontFamily: MONO, fontSize: "0.55rem" }}>optional</span>
                      )}
                    </div>
                    {task.description && <p className="text-muted-foreground text-xs">{task.description}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.58rem" }}>
                        {task.taskType.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Link + delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {task.link && (
                      <a href={task.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-all"
                        style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                        <ExternalLink size={10} /> Go
                      </a>
                    )}
                    <button onClick={() => handleDeleteTask(task.id)}
                      className="w-7 h-7 rounded-xl border-2 border-foreground/10 text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100"
                      data-testid={`button-delete-task-${task.id}`}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center rounded-2xl border-2 border-dashed border-foreground/15">
            <Zap size={30} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.7rem" }}>No tasks yet — add tasks to track your progress</p>
          </div>
        )}
      </div>

      {/* Add task dialog */}
      <Dialog open={showCreate} onOpenChange={v => !v && setShowCreate(false)}>
        <DialogContent style={{ border: "2px solid hsl(var(--border))", boxShadow: "6px 6px 0 hsl(var(--border))", borderRadius: "18px" }}>
          <DialogHeader><DialogTitle style={{ fontFamily: DISPLAY, fontSize: "0.95rem" }}>Add Task</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Title</Label>
              <Input className="mt-1" value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Follow on Twitter"
                data-testid="input-task-title" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Task Type</Label>
              <Select value={taskForm.taskType} onValueChange={v => setTaskForm(p => ({ ...p, taskType: v }))}>
                <SelectTrigger className="mt-1" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px", fontFamily: MONO, fontSize: "0.65rem" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map(t => <SelectItem key={t} value={t} style={{ fontFamily: MONO, fontSize: "0.65rem" }}>{t.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Link (optional)</Label>
              <Input className="mt-1" value={taskForm.link} onChange={e => setTaskForm(p => ({ ...p, link: e.target.value }))} placeholder="https://..."
                data-testid="input-task-link" style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
            <div>
              <Label style={{ fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Description (optional)</Label>
              <Input className="mt-1" value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} placeholder="Instructions"
                style={{ border: "2px solid hsl(var(--border))", borderRadius: "10px" }} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700 }}>
              <input type="checkbox" checked={taskForm.isRequired} onChange={e => setTaskForm(p => ({ ...p, isRequired: e.target.checked }))} />
              Required task
            </label>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-full border-2 border-border hover:bg-muted transition-all"
              style={{ fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700 }}>Cancel</button>
            <button onClick={handleCreateTask} disabled={!taskForm.title || createTask.isPending}
              className="px-4 py-2 rounded-full bg-primary text-white border-2 border-border disabled:opacity-50 hover:-translate-y-px transition-all"
              style={{ fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700, boxShadow: "3px 3px 0 hsl(var(--border))" }}
              data-testid="button-create-task">
              {createTask.isPending ? "Adding…" : "Add Task"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

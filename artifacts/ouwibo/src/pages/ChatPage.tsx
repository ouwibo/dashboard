import { useState, useRef, useEffect } from "react";
import { useSendChat } from "@workspace/api-client-react";
import { Send, Bot, User, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";
const PASTEL  = { sky: "#b8d8f0", mint: "#b8e8c8", peach: "#f0c4a8", lavender: "#d4c0f0" };

interface Message { id: string; role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "What are the best active airdrops right now?",
  "Show me easy airdrops for beginners",
  "What upcoming airdrops should I watch?",
  "How do I maximize my airdrop earnings?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "Hello! I'm your Airdrop AI assistant 🚀 I can help you find the best crypto airdrops, explain how to complete tasks, and answer questions about specific projects. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendChat = useSendChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(text?: string) {
    const content = text ?? input.trim();
    if (!content || sendChat.isPending) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages(prev => [...prev, userMsg]);

    const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    sendChat.mutate(
      { data: { messages: allMessages } },
      {
        onSuccess: data => {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.message }]);
        },
        onError: () => {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I ran into an error. Please try again." }]);
        },
      }
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary border-2 border-foreground flex items-center justify-center"
          style={{ boxShadow: "3px 3px 0 hsl(var(--foreground))" }}>
          <Bot size={18} color="white" />
        </div>
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "1.2rem", fontWeight: 700 }}>AI Airdrop Assistant</h1>
          <p className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.65rem" }}>
            Ask anything about crypto airdrops
          </p>
        </div>
        <span className="ml-auto px-2.5 py-1 rounded-full border-2 border-foreground/20 flex items-center gap-1"
          style={{ backgroundColor: PASTEL.mint, fontFamily: MONO, fontSize: "0.6rem", fontWeight: 700 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
            {/* Avatar */}
            <div className={cn("w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 mt-0.5", msg.role === "assistant" ? "bg-primary border-foreground" : "bg-foreground border-foreground")}
              style={{ boxShadow: "2px 2px 0 hsl(var(--border))" }}>
              {msg.role === "assistant"
                ? <Bot size={14} color="white" />
                : <User size={14} color="hsl(var(--background))" />
              }
            </div>
            {/* Bubble */}
            <div className={cn("max-w-[78%] px-4 py-3 rounded-2xl border-2 text-sm leading-relaxed", msg.role === "assistant" ? "border-foreground/15" : "border-foreground")}
              style={{
                backgroundColor: msg.role === "assistant" ? PASTEL.sky : "hsl(var(--foreground))",
                color: msg.role === "user" ? "hsl(var(--background))" : undefined,
                boxShadow: "3px 3px 0 hsl(var(--border))",
                fontFamily: msg.role === "user" ? MONO : undefined,
                fontSize: msg.role === "user" ? "0.75rem" : undefined,
              }}>
              {msg.content}
            </div>
          </div>
        ))}
        {sendChat.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl border-2 border-foreground bg-primary flex items-center justify-center shrink-0"
              style={{ boxShadow: "2px 2px 0 hsl(var(--border))" }}>
              <Bot size={14} color="white" />
            </div>
            <div className="px-4 py-3 rounded-2xl border-2 border-foreground/15 flex items-center gap-2"
              style={{ backgroundColor: PASTEL.sky, boxShadow: "3px 3px 0 hsl(var(--border))" }}>
              <Loader2 size={14} className="animate-spin text-muted-foreground" />
              <span className="text-muted-foreground text-xs" style={{ fontFamily: MONO }}>Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (only when no user messages yet) */}
      {messages.length === 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => handleSend(s)}
              className="text-left p-3 rounded-2xl border-2 border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-all hover:-translate-y-0.5"
              style={{ fontFamily: MONO, fontSize: "0.62rem", boxShadow: "2px 2px 0 hsl(var(--border))" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask about airdrops…"
          disabled={sendChat.isPending}
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          style={{ fontFamily: MONO, fontSize: "0.75rem", boxShadow: "3px 3px 0 hsl(var(--border))" }}
          data-testid="input-chat-message"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || sendChat.isPending}
          className="w-12 h-12 rounded-2xl bg-primary text-white border-2 border-foreground flex items-center justify-center hover:-translate-y-px transition-all disabled:opacity-50 shrink-0"
          style={{ boxShadow: "3px 3px 0 hsl(var(--foreground))" }}
          data-testid="button-send-chat">
          {sendChat.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      <p className="text-center text-muted-foreground mt-2" style={{ fontFamily: MONO, fontSize: "0.58rem" }}>
        Connect your LLM API in settings to unlock full AI capabilities
      </p>
    </div>
  );
}

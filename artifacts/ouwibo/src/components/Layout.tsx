import { Link, useLocation } from "wouter";
import { useState } from "react";
import { LayoutDashboard, Zap, MessageSquare, Settings, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

const navItems = [
  { href: "/",         icon: LayoutDashboard, label: "Dashboard" },
  { href: "/airdrops", icon: Zap,             label: "Airdrops"  },
  { href: "/chat",     icon: MessageSquare,   label: "AI Chat"   },
  { href: "/settings", icon: Settings,        label: "Settings"  },
];

function NavItem({ href, icon: Icon, label }: { href: string; icon: typeof LayoutDashboard; label: string }) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  return (
    <Link href={href}
      className={cn(
        "flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition-all duration-150",
        isActive ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground hover:bg-muted"
      )}
      style={{ fontFamily: MONO, fontSize: "0.72rem", fontWeight: 700, boxShadow: isActive ? "2px 2px 0 rgba(0,0,0,0.15)" : undefined }}
      data-testid={`nav-${label.toLowerCase().replace(" ", "-")}`}>
      <Icon size={14} />
      {label}
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-52 border-r-2 border-border bg-sidebar fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-[60px] border-b-2 border-border">
          <div className="w-8 h-8 rounded-xl bg-primary border-2 border-foreground flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0 hsl(var(--foreground))" }}>
            <Zap size={14} fill="white" color="white" />
          </div>
          <span style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>Ouwibo</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(item => <NavItem key={item.href} {...item} />)}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t-2 border-border">
          <button onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border-2 border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            style={{ fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}
            data-testid="button-theme-toggle">
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-14 px-4 border-b-2 border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-primary border-2 border-foreground flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0 hsl(var(--foreground))" }}>
            <Zap size={11} fill="white" color="white" />
          </div>
          <span style={{ fontFamily: DISPLAY, fontSize: "0.8rem", fontWeight: 700 }}>Ouwibo</span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="w-8 h-8 rounded-xl border-2 border-border flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0 hsl(var(--border))" }}>
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-8 h-8 rounded-xl border-2 border-border flex items-center justify-center"
            style={{ boxShadow: "2px 2px 0 hsl(var(--border))" }}>
            {mobileOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-sidebar border-r-2 border-border flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 h-14 border-b-2 border-border">
              <span style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>Ouwibo</span>
              <button onClick={() => setMobileOpen(false)}><X size={15} /></button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1">
              {navItems.map(item => (
                <div key={item.href} onClick={() => setMobileOpen(false)}>
                  <NavItem {...item} />
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-52 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

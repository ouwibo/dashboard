import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Zap, Newspaper, Wallet, Calendar, Bell,
  Settings, Sun, Moon, Menu, X, ChevronUp, Search,
  TrendingUp, Gift, BookOpen, ExternalLink, ChevronRight,
} from "lucide-react";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

/* ── Nav definition ── */
const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      { href: "/",          label: "Dashboard",  Icon: LayoutDashboard, color: "#f97316" },
      { href: "/airdrops",  label: "Airdrops",   Icon: Zap,             color: "#8b5cf6" },
      { href: "/news",      label: "News",       Icon: Newspaper,       color: "#06b6d4" },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { href: "/portfolio", label: "Portfolio",  Icon: Wallet,          color: "#10b981" },
      { href: "/calendar",  label: "Calendar",   Icon: Calendar,        color: "#f43f5e" },
      { href: "/alerts",    label: "Alerts",     Icon: Bell,            color: "#eab308" },
    ],
  },
  {
    label: "RESOURCES",
    items: [
      { href: "/guide",     label: "How to Farm",Icon: BookOpen,        color: "#a855f7" },
      { href: "/chat",      label: "AI Chat",    Icon: TrendingUp,      color: "#14b8a6" },
    ],
  },
];

const ALL_NAV = NAV_GROUPS.flatMap(g => g.items);

/* ── Scroll-to-top button ── */
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-5 z-50 w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      style={{ boxShadow: "3px 3px 0 hsl(var(--border))" }}
    >
      <ChevronUp size={16} />
    </button>
  );
}

/* ── Coming soon stub for placeholder pages ── */
function isStub(href: string) {
  return ["/portfolio", "/calendar", "/alerts", "/guide"].includes(href);
}

/* ── Sidebar nav item ── */
function NavItem({
  item,
  active,
  expanded,
  onClick,
}: {
  item: (typeof ALL_NAV)[0];
  active: boolean;
  expanded: boolean;
  onClick?: () => void;
}) {
  const stub = isStub(item.href);
  const inner = (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all w-full",
        active ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      style={active ? { backgroundColor: item.color, boxShadow: `0 4px 14px ${item.color}55` } : {}}
    >
      <div className="shrink-0 w-5 flex items-center justify-center">
        <item.Icon size={17} color={active ? "#fff" : undefined} />
      </div>
      {expanded && (
        <span className="text-[11px] font-bold flex-1 whitespace-nowrap" style={{ fontFamily: MONO }}>
          {item.label}
        </span>
      )}
      {expanded && stub && !active && (
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-muted-foreground/15 text-muted-foreground" style={{ fontFamily: MONO }}>
          SOON
        </span>
      )}
      {expanded && active && (
        <ChevronRight size={12} className="ml-auto opacity-60" />
      )}
    </div>
  );

  if (stub) {
    return <div onClick={onClick} className="w-full px-2">{inner}</div>;
  }
  return (
    <div className="w-full px-2">
      <Link href={item.href} onClick={onClick}>
        {inner}
      </Link>
    </div>
  );
}

/* ── Main Layout ── */
export default function Layout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  const SIDEBAR_W = expanded ? 220 : 64;

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/90 backdrop-blur-md border-b border-border flex items-center gap-3 px-4">
        {/* Hamburger — desktop toggles sidebar, mobile opens drawer */}
        <button
          onClick={() => {
            if (window.innerWidth >= 1024) {
              setExpanded(o => !o);
            } else {
              setMobileOpen(o => !o);
            }
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors shrink-0"
        >
          <Menu size={18} />
        </button>

        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer select-none shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
              style={{ background: "linear-gradient(135deg,#f97316,#8b5cf6)", fontFamily: DISPLAY }}
            >
              O
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-sm leading-none" style={{ fontFamily: DISPLAY }}>Ouwibo</span>
              <span className="text-[9px] text-muted-foreground" style={{ fontFamily: MONO }}>Cloud</span>
            </div>
          </div>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2 text-muted-foreground border border-border/50">
            <Search size={13} />
            <span className="text-[11px]" style={{ fontFamily: MONO }}>Search airdrops, news…</span>
            <span className="ml-auto text-[10px] bg-background border border-border rounded px-1.5 py-0.5 hidden md:block" style={{ fontFamily: MONO }}>
              ⌘K
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ml-1 border-2 border-border"
            style={{ background: "linear-gradient(135deg,#f97316,#8b5cf6)", fontFamily: DISPLAY }}
          >
            O
          </div>
        </div>
      </header>

      {/* ── Desktop Left Sidebar ── */}
      <aside
        className="fixed top-14 left-0 bottom-0 z-40 border-r border-border bg-background hidden lg:flex flex-col py-4 gap-0 transition-all duration-300 overflow-hidden"
        style={{ width: SIDEBAR_W }}
      >
        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-1 space-y-1">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="mx-4 my-2 border-t border-border/50" />}
              {expanded && (
                <p
                  className="px-5 mb-1.5 text-[9px] font-bold text-muted-foreground/50 tracking-widest select-none"
                  style={{ fontFamily: MONO }}
                >
                  {group.label}
                </p>
              )}
              {group.items.map(item => (
                <NavItem
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  expanded={expanded}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom: theme + settings */}
        <div className="shrink-0 border-t border-border/50 pt-3 space-y-1">
          <NavItem
            item={{ href: "/settings", label: "Settings", Icon: Settings, color: "#6b7280" }}
            active={isActive("/settings")}
            expanded={expanded}
          />
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 mx-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            style={{ width: "calc(100% - 16px)" }}
          >
            <div className="shrink-0 w-5 flex items-center justify-center">
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </div>
            {expanded && (
              <span className="text-[11px] font-bold whitespace-nowrap" style={{ fontFamily: MONO }}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside
            className="absolute top-0 left-0 bottom-0 w-64 bg-background border-r border-border flex flex-col py-4 gap-0"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: "linear-gradient(135deg,#f97316,#8b5cf6)", fontFamily: DISPLAY }}
                >
                  O
                </div>
                <div>
                  <span className="font-black text-sm" style={{ fontFamily: DISPLAY }}>Ouwibo</span>
                  <span className="text-[9px] text-muted-foreground ml-1" style={{ fontFamily: MONO }}>Cloud</span>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 px-0">
              {NAV_GROUPS.map((group, gi) => (
                <div key={group.label}>
                  {gi > 0 && <div className="mx-4 my-2 border-t border-border/50" />}
                  <p
                    className="px-5 mb-1.5 text-[9px] font-bold text-muted-foreground/50 tracking-widest select-none"
                    style={{ fontFamily: MONO }}
                  >
                    {group.label}
                  </p>
                  {group.items.map(item => (
                    <NavItem
                      key={item.href}
                      item={item}
                      active={isActive(item.href)}
                      expanded={true}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="shrink-0 border-t border-border/50 pt-3 space-y-1 px-0">
              <NavItem
                item={{ href: "/settings", label: "Settings", Icon: Settings, color: "#6b7280" }}
                active={isActive("/settings")}
                expanded={true}
                onClick={() => setMobileOpen(false)}
              />
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-5 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <div className="shrink-0 w-5 flex items-center justify-center">
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </div>
                <span className="text-[11px] font-bold whitespace-nowrap" style={{ fontFamily: MONO }}>
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <main
        className="pt-14 transition-all duration-300 hidden lg:block"
        style={{ marginLeft: SIDEBAR_W }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 pb-10">
          {children}
        </div>
      </main>

      {/* Mobile main (no margin) */}
      <main className="pt-14 lg:hidden pb-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* ── Bottom Mobile Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur border-t border-border flex lg:hidden">
        {ALL_NAV.slice(0, 5).map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={isStub(item.href) ? location : item.href}
              className="flex-1"
            >
              <div className="flex flex-col items-center justify-center h-full gap-1 cursor-pointer">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                    active ? "text-white scale-110" : "text-muted-foreground"
                  )}
                  style={active ? { backgroundColor: item.color, boxShadow: `0 3px 10px ${item.color}66` } : {}}
                >
                  <item.Icon size={17} color={active ? "#fff" : undefined} />
                </div>
                <span
                  className="text-[8px] font-bold truncate"
                  style={{ fontFamily: MONO, color: active ? item.color : undefined }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <ScrollTop />
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

/* ── Custom SVG Icons (inspired by iCloudice Blogger template) ── */
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M2.4 11.713C2.4 6.082 3.014 6.475 6.319 3.41 7.765 2.246 10.015 0 11.958 0c1.942 0 4.237 2.235 5.696 3.41C20.959 6.475 21.572 6.082 21.572 11.713 21.572 20 19.613 20 11.986 20 4.359 20 2.4 20 2.4 11.713Z"/>
    <line x1="9" y1="20" x2="9" y2="14" strokeWidth="1.5"/>
    <line x1="15" y1="20" x2="15" y2="14" strokeWidth="1.5"/>
    <line x1="9" y1="14" x2="15" y2="14" strokeWidth="1.5"/>
  </svg>
);

const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M9 22h6l-3-9 5-2L7 2l3 9-5 2 4 9Z"/>
    <path d="M13 2 9 11l5 2-5 9" strokeDasharray="2 2" opacity="0.4"/>
  </svg>
);

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M19.07 19.07C16.016 22.127 11.49 22.787 7.786 21.074c-.547-.22-4.085.76-4.853-.007-.768-.768.213-4.307-.007-4.854C1.213 12.51 1.874 7.983 4.93 4.927c3.9-3.9 10.24-3.9 14.14 0 3.9 3.9 3.9 10.24 0 14.14Z"/>
    <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
  </svg>
);

const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
  </svg>
);

const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconHam = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
    <path d="M3 18H14M10 6H21"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* Wave SVG (from Blogger template wave animation) */
const WaveDecoration = () => (
  <div style={{ position: "relative", height: "48px", overflow: "hidden", opacity: 0.5 }}>
    <svg preserveAspectRatio="none" viewBox="0 24 150 28" style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}>
      <defs>
        <path id="wave-nav" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"/>
      </defs>
      <g>
        <use xlinkHref="#wave-nav" x="48" y="0" fill="hsl(var(--primary)/0.15)"/>
        <use xlinkHref="#wave-nav" x="48" y="3" fill="hsl(var(--primary)/0.1)"/>
        <use xlinkHref="#wave-nav" x="48" y="5" fill="hsl(var(--primary)/0.07)"/>
      </g>
    </svg>
  </div>
);

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    color: "#f97316",
    colorMuted: "rgba(249,115,22,0.15)",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#f97316" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: "/airdrops",
    label: "Airdrops",
    color: "#8b5cf6",
    colorMuted: "rgba(139,92,246,0.15)",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#8b5cf6" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "AI Chat",
    color: "#06b6d4",
    colorMuted: "rgba(6,182,212,0.15)",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#06b6d4" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <circle cx="9" cy="10" r="1" fill={active ? "#06b6d4" : "currentColor"}/>
        <circle cx="12" cy="10" r="1" fill={active ? "#06b6d4" : "currentColor"}/>
        <circle cx="15" cy="10" r="1" fill={active ? "#06b6d4" : "currentColor"}/>
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    color: "#10b981",
    colorMuted: "rgba(16,185,129,0.15)",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    ),
  },
];

function NavItem({ href, label, color, colorMuted, icon }: typeof navItems[0]) {
  const [loc] = useLocation();
  const active = href === "/" ? loc === "/" : loc.startsWith(href);

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer group",
          active ? "shadow-sm" : "hover:bg-muted/60"
        )}
        style={active ? {
          background: colorMuted,
          border: `2px solid ${color}30`,
          boxShadow: `0 2px 12px ${color}25`,
        } : { border: "2px solid transparent" }}
      >
        <span className="transition-transform duration-200 group-hover:scale-110">
          {icon(active)}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: active ? color : undefined,
          }}
          className={cn("transition-colors", !active && "text-muted-foreground group-hover:text-foreground")}
        >
          {label}
        </span>
        {active && (
          <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
        )}
      </div>
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* ── Desktop Sidebar ──────────────────── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-52 bg-card border-r-2 border-border z-30">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-3 border-b-2 border-border">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f97316,#8b5cf6)", boxShadow: "3px 3px 0 rgba(0,0,0,0.2)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 800 }}>Ouwibo</p>
            <p className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.55rem" }}>Airdrop Tracker</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                  active ? "border-2" : "hover:bg-muted border-2 border-transparent"
                )}
                  style={active ? {
                    background: item.colorMuted,
                    borderColor: item.color,
                    boxShadow: `2px 2px 0 ${item.color}40`,
                  } : {}}>
                  <span style={{ color: active ? item.color : undefined }} className={cn(!active && "text-muted-foreground")}>
                    {item.icon(active)}
                  </span>
                  <span style={{
                    fontFamily: MONO, fontSize: "0.68rem", fontWeight: 700,
                    color: active ? item.color : undefined,
                  }} className={cn(!active && "text-foreground")}>
                    {item.label}
                  </span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Wave + Theme Toggle */}
        <div className="mt-auto">
          <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="w-full h-8 opacity-30">
            <path d="M0,20 C40,5 80,35 120,20 C160,5 180,25 200,20 L200,40 L0,40 Z" fill="#f97316" />
            <path d="M0,25 C50,10 100,35 150,22 C175,15 190,28 200,25 L200,40 L0,40 Z" fill="#8b5cf6" />
            <path d="M0,30 C60,20 120,38 200,28 L200,40 L0,40 Z" fill="#06b6d4" />
          </svg>
          <div className="px-3 pb-4">
            <button onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-border bg-background hover:bg-muted transition-all"
              style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
              {theme === "dark" ? (
                <><IconSun /><span>Light Mode</span></>
              ) : (
                <><IconMoon /><span>Dark Mode</span></>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header ──────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b-2 border-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f97316,#8b5cf6)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span style={{ fontFamily: DISPLAY, fontSize: "0.82rem", fontWeight: 800 }}>Ouwibo</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-muted border-2 border-border transition-all">
          <IconHam />
        </button>
      </header>

      {/* ── Mobile Drawer ──────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card border-r-2 border-border flex flex-col">
            <div className="px-5 pt-6 pb-4 flex items-center justify-between border-b-2 border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#f97316,#8b5cf6)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 800 }}>Ouwibo</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-muted border-2 border-border">
                <IconClose />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map(item => {
                const active = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border-2",
                      active ? "" : "border-transparent hover:bg-muted"
                    )}
                      style={active ? { background: item.colorMuted, borderColor: item.color, boxShadow: `2px 2px 0 ${item.color}40` } : {}}
                      onClick={() => setMobileOpen(false)}>
                      <span style={{ color: active ? item.color : undefined }} className={cn(!active && "text-muted-foreground")}>
                        {item.icon(active)}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: "0.68rem", fontWeight: 700, color: active ? item.color : undefined }} className={cn(!active && "text-foreground")}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 pb-6">
              <button onClick={() => { toggleTheme(); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-border bg-background hover:bg-muted transition-all"
                style={{ fontFamily: MONO, fontSize: "0.62rem", fontWeight: 700, boxShadow: "2px 2px 0 hsl(var(--border))" }}>
                {theme === "dark" ? <><IconSun /><span>Light Mode</span></> : <><IconMoon /><span>Dark Mode</span></>}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Mobile Bottom Nav ──────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t-2 border-border z-40 flex items-center justify-around px-2">
        {navItems.map(item => {
          const active = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
                style={active ? { background: item.colorMuted } : {}}>
                <span style={{ color: active ? item.color : undefined }} className={cn(!active && "text-muted-foreground")}>
                  {item.icon(active)}
                </span>
                <span style={{ fontFamily: MONO, fontSize: "0.5rem", fontWeight: 700, color: active ? item.color : undefined }} className={cn(!active && "text-muted-foreground")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Main ──────────────────── */}
      <main className="flex-1 lg:ml-52 pt-14 pb-20 lg:pt-0 lg:pb-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

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
  { href: "/",         Icon: IconHome,     label: "Dashboard" },
  { href: "/airdrops", Icon: IconZap,      label: "Airdrops"  },
  { href: "/chat",     Icon: IconChat,     label: "AI Chat"   },
  { href: "/settings", Icon: IconSettings, label: "Settings"  },
];

function NavItem({ href, Icon, label, onClick }: { href: string; Icon: () => JSX.Element; label: string; onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  return (
    <Link href={href} onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 group relative",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      style={{
        fontFamily: MONO,
        fontSize: "0.72rem",
        fontWeight: 700,
        boxShadow: isActive ? "3px 3px 0 hsl(var(--border))" : undefined,
        border: isActive ? "2px solid hsl(var(--border))" : "2px solid transparent",
      }}>
      <Icon />
      <span>{label}</span>
      {isActive && (
        <span style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          width: 6, height: 6, borderRadius: "50%",
          background: "currentColor", opacity: 0.5,
        }}/>
      )}
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 fixed inset-y-0 left-0 z-30 bg-sidebar"
        style={{ borderRight: "2px solid hsl(var(--border))" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-[64px]"
          style={{ borderBottom: "2px solid hsl(var(--border))" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: "hsl(var(--primary))",
            border: "2px solid hsl(var(--border))",
            boxShadow: "3px 3px 0 hsl(var(--border))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconZap />
          </div>
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: "0.9rem", fontWeight: 700, lineHeight: 1 }}>Ouwibo</div>
            <div style={{ fontFamily: MONO, fontSize: "0.55rem", opacity: 0.5, marginTop: 2 }}>Airdrop Tracker</div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(item => <NavItem key={item.href} {...item} />)}
        </nav>

        {/* Wave decoration */}
        <WaveDecoration />

        {/* Footer — theme toggle */}
        <div className="px-3 pb-5">
          <button onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl transition-all"
            style={{
              fontFamily: MONO, fontSize: "0.65rem", fontWeight: 700,
              border: "2px solid hsl(var(--border))",
              boxShadow: "3px 3px 0 hsl(var(--border))",
              background: "hsl(var(--muted))",
              color: "hsl(var(--muted-foreground))",
            }}>
            {theme === "dark" ? <IconSun /> : <IconMoon />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4"
        style={{ height: 56, background: "hsl(var(--sidebar))", borderBottom: "2px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 30, height: 30, borderRadius: 10,
            background: "hsl(var(--primary))",
            border: "2px solid hsl(var(--border))",
            boxShadow: "2px 2px 0 hsl(var(--border))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconZap />
          </div>
          <span style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>Ouwibo</span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTheme}
            className="flex items-center justify-center"
            style={{
              width: 34, height: 34, borderRadius: 10,
              border: "2px solid hsl(var(--border))",
              boxShadow: "2px 2px 0 hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}>
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center"
            style={{
              width: 34, height: 34, borderRadius: 10,
              border: "2px solid hsl(var(--border))",
              boxShadow: "2px 2px 0 hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}>
            {mobileOpen ? <IconClose /> : <IconHam />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}/>
          <aside className="absolute left-0 top-0 bottom-0 w-60 flex flex-col"
            style={{ background: "hsl(var(--sidebar))", borderRight: "2px solid hsl(var(--border))" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5"
              style={{ height: 56, borderBottom: "2px solid hsl(var(--border))" }}>
              <span style={{ fontFamily: DISPLAY, fontSize: "0.85rem", fontWeight: 700 }}>Ouwibo</span>
              <button onClick={() => setMobileOpen(false)}><IconClose /></button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1">
              {navItems.map(item => (
                <NavItem key={item.href} {...item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>
            <WaveDecoration />
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0 min-h-screen pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav (like Blogger template) ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-center"
        style={{
          height: 60,
          background: "hsl(var(--sidebar))",
          borderTop: "2px solid hsl(var(--border))",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        }}>
        {navItems.map(({ href, Icon, label }) => {
          const [location] = useLocation();
          const isActive = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
              style={{
                color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                fontFamily: MONO, fontSize: "0.52rem", fontWeight: 700,
              }}>
              <Icon />
              <span>{label}</span>
              {isActive && (
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "hsl(var(--primary))", marginTop: 1 }}/>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

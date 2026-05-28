import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { Palette, Bell } from "lucide-react";

const PASTEL  = ["#b8d8f0", "#f0c4a8", "#d4c0f0"];

function NeoSection({ title, bg, children, icon: Icon }: { title: string; bg: string; children: React.ReactNode; icon: typeof Palette }) {
  return (
    <div className="neo-card p-5" style={{ backgroundColor: bg }}><div className="flex items-center gap-2 mb-5"><div className="w-7 h-7 rounded-xl border-2 border-foreground/20 flex items-center justify-center bg-white/40"><Icon size={13} /></div><p style={{ fontSize: "0.82rem", fontWeight: 700 }}>{title}</p></div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [siteName, setSiteName] = useState("Ouwibo");
  const [siteDesc, setSiteDesc] = useState("Crypto airdrop tracker & news");

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.15 }}>Settings</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.7rem" }}>Public website settings — keep this light and useful.</p>
      </div>
      <div className="space-y-4 max-w-2xl">
        <NeoSection title="Site Configuration" bg={PASTEL[0]} icon={Palette}>
          <div className="space-y-3">
            <div>
              <Label style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Site Name</Label>
              <Input className="mt-1" value={siteName} onChange={e => setSiteName(e.target.value)} style={{ border: "2px solid hsl(var(--border))", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.5)" }} data-testid="input-site-name" />
            </div>
            <div>
              <Label style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Site Description</Label>
              <Input className="mt-1" value={siteDesc} onChange={e => setSiteDesc(e.target.value)} style={{ border: "2px solid hsl(var(--border))", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.5)" }} data-testid="input-site-desc" />
            </div>
            <p className="text-foreground/70" style={{ fontSize: "0.66rem", lineHeight: 1.5 }}>
              This section is here so you can edit public-facing name and tagline without touching code. If you want full site branding, use the homepage and header instead.
            </p>
          </div>
        </NeoSection>
      </div>
    </div>
  );
}

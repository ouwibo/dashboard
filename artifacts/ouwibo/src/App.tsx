import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage";
import AirdropsPage from "@/pages/AirdropsPage";
import AirdropDetailPage from "@/pages/AirdropDetailPage";
import NewsPage from "@/pages/NewsPage";
import ChatPage from "@/pages/ChatPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";

const MONO    = "'Space Mono', monospace";
const DISPLAY = "'Unbounded', sans-serif";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
  },
});

function ComingSoon({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-5">{icon}</div>
      <h1 className="font-black text-2xl mb-2" style={{ fontFamily: DISPLAY }}>{title}</h1>
      <p className="text-muted-foreground text-sm" style={{ fontFamily: MONO }}>
        This section is under construction. Coming soon!
      </p>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/"           component={DashboardPage} />
        <Route path="/airdrops"   component={AirdropsPage} />
        <Route path="/airdrops/:id" component={AirdropDetailPage} />
        <Route path="/news"       component={NewsPage} />
        <Route path="/chat"       component={ChatPage} />
        <Route path="/settings"   component={SettingsPage} />
        <Route path="/portfolio"  component={() => <ComingSoon title="Portfolio" icon="💼" />} />
        <Route path="/calendar"   component={() => <ComingSoon title="Airdrop Calendar" icon="📅" />} />
        <Route path="/alerts"     component={() => <ComingSoon title="Alerts" icon="🔔" />} />
        <Route path="/guide"      component={() => <ComingSoon title="How to Farm Airdrops" icon="📖" />} />
        <Route                    component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

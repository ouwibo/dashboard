import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import AirdropsPage from "@/pages/AirdropsPage";
import AirdropDetailPage from "@/pages/AirdropDetailPage";
import NewsPage from "@/pages/NewsPage";
import ArticlePage from "@/pages/ArticlePage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30000, retry: 1 } } });

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/"                component={HomePage}        />
        <Route path="/airdrops"        component={AirdropsPage}    />
        <Route path="/airdrops/:id"    component={AirdropDetailPage} />
        <Route path="/news"            component={NewsPage}        />
        <Route path="/article/:slug"   component={ArticlePage}     />
        <Route path="/admin/login"     component={AdminLoginPage}  />
        <Route path="/admin"           component={AdminPage}       />
        <Route                         component={NotFound}        />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
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

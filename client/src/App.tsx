import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import About from "@/pages/About";
import Chat from "@/pages/Chat";
import Home from "@/pages/Home";
import LocalServices from "@/pages/LocalServices";
import NotFound from "@/pages/NotFound";
import RagPipeline from "@/pages/RagPipeline";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function AppRouter() {
  // إزالة السلاش الأخيرة تلقائياً لتتوافق مع مكتبة wouter
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <WouterRouter base={baseUrl}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/chat" component={Chat} />
        <Route path="/rag" component={RagPipeline} />
        <Route path="/services" component={LocalServices} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
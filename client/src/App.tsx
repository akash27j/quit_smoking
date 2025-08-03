import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { TopNavigation, Navigation } from "@/components/navigation";

import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Goals from "@/pages/goals";
import Journal from "@/pages/journal";
import Calm from "@/pages/calm";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/goals" component={Goals} />
      <Route path="/journal" component={Journal} />
      <Route path="/calm" component={Calm} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <TopNavigation />
            <main className="pt-0">
              <Router />
            </main>
            <Navigation />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

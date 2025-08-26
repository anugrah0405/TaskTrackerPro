import { Switch, Route, useLocation } from "wouter";
import { useCallback, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  const [location] = useLocation();

  const applyTheme = useCallback(() => {
    if (typeof document === "undefined") return;
    const isAuth = location.startsWith("/auth");
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;
    if (isAuth) {
      document.documentElement.classList.remove("dark");
    } else if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [location]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  useEffect(() => {
    window.addEventListener("storage", applyTheme);
    window.addEventListener("themechange", applyTheme);
    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("themechange", applyTheme);
    };
  }, [applyTheme]);

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

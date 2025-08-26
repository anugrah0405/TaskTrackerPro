import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import CategoryManager from "@/components/category-manager";
import CreateTodo from "@/components/create-todo";
import TodoList from "@/components/todo-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Moon, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Persist preference and update the <html> class on non-auth pages
  useEffect(() => {
    if (typeof window === "undefined") return;
    const desired = isDark ? "dark" : "light";
    localStorage.setItem("theme", desired);
    // App-level will handle applying to <html> depending on route
    const event = new Event("themechange");
    window.dispatchEvent(event);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">TaskTrackerPro</span>
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Welcome, {user?.username}
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage categories</DialogTitle>
                </DialogHeader>
                <CategoryManager />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => setIsDark((v) => !v)}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-[90%] sm:max-w-[70%] space-y-6">
          <Card className="shadow-lg p-6">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg font-semibold tracking-tight">Create a task</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CreateTodo />
            </CardContent>
          </Card>

          <Card className="shadow-lg p-6">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg font-semibold tracking-tight">Your tasks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TodoList />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
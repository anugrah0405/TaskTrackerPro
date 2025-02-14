import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import CreateTodo from "@/components/create-todo";
import TodoList from "@/components/todo-list";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TodoApp</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Welcome, {user?.username}
            </span>
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

      <main className="container mx-auto px-4 py-8">
        <CreateTodo />
        <div className="h-8" />
        <TodoList />
      </main>
    </div>
  );
}

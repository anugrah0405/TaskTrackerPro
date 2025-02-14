import { useQuery, useMutation } from "@tanstack/react-query";
import { Todo, Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import TodoFilters, { TodoFilters as FilterType } from "./todo-filters";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditTodo from "./edit-todo";

export default function TodoList() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterType>({});
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Todo deleted",
        description: "Your todo has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get all unique labels from todos
  const availableLabels = useMemo(() => {
    if (!todos) return [];
    const labels = new Set<string>();
    todos.forEach((todo) => {
      todo.labels?.forEach((label) => labels.add(label));
    });
    return Array.from(labels).sort();
  }, [todos]);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    if (!todos) return [];

    return todos
      .filter((todo) => {
        // Filter by category
        if (filters.category !== undefined && todo.categoryId !== filters.category) {
          return false;
        }

        // Filter by completion status
        if (filters.completed !== undefined && todo.completed !== filters.completed) {
          return false;
        }

        // Filter by label
        if (filters.label && (!todo.labels || !todo.labels.includes(filters.label))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!filters.sortBy) return 0;

        switch (filters.sortBy) {
          case "created":
            // Ensure both items have createdAt before comparing
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return filters.sortDirection === "asc"
              ? aTime - bTime
              : bTime - aTime;

          case "title":
            return filters.sortDirection === "asc"
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);

          case "deadline":
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return filters.sortDirection === "asc"
              ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
              : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();

          default:
            return 0;
        }
      });
  }, [todos, filters]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!todos?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No todos yet. Create one above!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <TodoFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        availableLabels={availableLabels}
      />

      {filteredTodos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No todos match your filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredTodos.map((todo) => {
          const category = categories?.find((c) => c.id === todo.categoryId);

          return (
            <Card key={todo.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={(checked) =>
                        updateTodoMutation.mutate({
                          id: todo.id,
                          completed: checked as boolean,
                        })
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <p
                        className={`font-medium ${
                          todo.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {todo.title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {category && (
                          <div
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: category.color,
                              color: "white",
                            }}
                          >
                            {category.name}
                          </div>
                        )}
                        {todo.labels?.map((label) => (
                          <div
                            key={label}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                      {todo.deadline && (
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(todo.deadline), "PPp")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTodo(todo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodoMutation.mutate(todo.id)}
                      disabled={deleteTodoMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
      <Dialog open={editingTodo !== null} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <EditTodo
              todo={editingTodo}
              onClose={() => setEditingTodo(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTodoSchema, InsertTodo } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateTodo() {
  const { toast } = useToast();
  const form = useForm<InsertTodo>({
    resolver: zodResolver(insertTodoSchema),
  });

  const createTodoMutation = useMutation({
    mutationFn: async (todo: InsertTodo) => {
      const res = await apiRequest("POST", "/api/todos", todo);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      form.reset();
      toast({
        title: "Todo created",
        description: "Your todo has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          onSubmit={form.handleSubmit((data) => createTodoMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Task</Label>
            <Input id="title" {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (optional)</Label>
            <Input
              id="deadline"
              type="datetime-local"
              {...form.register("deadline")}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createTodoMutation.isPending}
          >
            {createTodoMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Todo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

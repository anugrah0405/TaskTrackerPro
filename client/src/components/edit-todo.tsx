import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTodoSchema, InsertTodo, Category, Todo } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type EditTodoProps = {
  todo: Todo;
  onClose: () => void;
};

export default function EditTodo({ todo, onClose }: EditTodoProps) {
  const { toast } = useToast();
  const [currentLabel, setCurrentLabel] = useState("");
  const form = useForm<InsertTodo>({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      title: todo.title,
      categoryId: todo.categoryId ?? undefined,
      labels: todo.labels ?? [],
      deadline: todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 16) : undefined,
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const editTodoMutation = useMutation({
    mutationFn: async (updatedTodo: Partial<InsertTodo>) => {
      const res = await apiRequest(
        "PATCH",
        `/api/todos/${todo.id}/details`,
        updatedTodo
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      onClose();
      toast({
        title: "Todo updated",
        description: "Your todo has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addLabel = () => {
    if (!currentLabel) return;
    const currentLabels = form.getValues("labels") || [];
    form.setValue("labels", [...currentLabels, currentLabel]);
    setCurrentLabel("");
  };

  const removeLabel = (label: string) => {
    const currentLabels = form.getValues("labels") || [];
    form.setValue(
      "labels",
      currentLabels.filter((l) => l !== label)
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit((data) => editTodoMutation.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Task</Label>
        <Input id="title" {...form.register("title")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.getValues("categoryId")?.toString()}
          onValueChange={(value) =>
            form.setValue("categoryId", parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="labels">Labels</Label>
        <div className="flex space-x-2">
          <Input
            id="labels"
            value={currentLabel}
            onChange={(e) => setCurrentLabel(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLabel();
              }
            }}
            placeholder="Press Enter to add"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addLabel}
          >
            Add
          </Button>
        </div>
        {form.getValues("labels")?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.getValues("labels")?.map((label) => (
              <div
                key={label}
                className="flex items-center space-x-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => removeLabel(label)}
                  className="text-secondary-foreground/50 hover:text-secondary-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (optional)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Set the date and time for your task (HH:MM format)
            </p>
            <Input
              id="deadline"
              type="datetime-local"
              step="60"
              {...form.register("deadline")}
              className="px-3 py-2"
            />
          </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={editTodoMutation.isPending}
        >
          {editTodoMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@shared/schema";
import { Check, X } from "lucide-react";

export type TodoFilters = {
  category?: number;
  completed?: boolean;
  label?: string;
  sortBy?: "deadline" | "title" | "created"; //reverted this line to original
  sortDirection?: "asc" | "desc";
};

type TodoFiltersProps = {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
  categories?: Category[];
  availableLabels?: string[];
};

export default function TodoFilters({
  filters,
  onFiltersChange,
  categories,
  availableLabels,
}: TodoFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      {/* Category filter */}
      <Select
        value={filters.category ? filters.category.toString() : "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            category: value === "all" ? undefined : parseInt(value),
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
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

      {/* Status filter */}
      <Select
        value={filters.completed !== undefined ? filters.completed.toString() : "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            completed:
              value === "all" ? undefined : value === "true",
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tasks</SelectItem>
          <SelectItem value="false">
            <span className="flex items-center gap-2">
              Pending
            </span>
          </SelectItem>
          <SelectItem value="true">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Completed
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Label filter */}
      <Select
        value={filters.label || "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            label: value === "all" ? undefined : value,
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by label" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All labels</SelectItem>
          {availableLabels?.map((label) => (
            <SelectItem key={label} value={label}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort options */}
      <Select
        value={
          filters.sortBy
            ? `${filters.sortBy}-${filters.sortDirection || "asc"}`
            : "default"
        }
        onValueChange={(value) => {
          if (value === "default") {
            onFiltersChange({
              ...filters,
              sortBy: undefined,
              sortDirection: undefined,
            });
          } else {
            const [sortBy, sortDirection] = value.split("-") as [
              TodoFilters["sortBy"],
              TodoFilters["sortDirection"]
            ];
            onFiltersChange({
              ...filters,
              sortBy,
              sortDirection,
            });
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="deadline-asc">Deadline (earliest first)</SelectItem>
          <SelectItem value="deadline-desc">Deadline (latest first)</SelectItem>
          <SelectItem value="title-asc">Title (A-Z)</SelectItem>
          <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          <SelectItem value="created-asc">Created (oldest first)</SelectItem>
          <SelectItem value="created-desc">Created (newest first)</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters button */}
      {(filters.category !== undefined ||
        filters.completed !== undefined ||
        filters.label !== undefined ||
        filters.sortBy !== undefined) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          className="rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
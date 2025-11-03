import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortBy, SortDirection } from "@/types/todo";

interface TodoSortProps {
  sortBy: SortBy;
  direction: SortDirection;
  onSortChange: (sortBy: SortBy) => void;
  onDirectionChange: () => void;
}

const sortOptions: { value: SortBy; label: string }[] = [
  { value: "createdAt", label: "Data de Criação" },
  { value: "dueDate", label: "Data de Vencimento" },
  { value: "priority", label: "Prioridade" },
  { value: "text", label: "Nome (A-Z)" },
];

export function TodoSort({
  sortBy,
  direction,
  onSortChange,
  onDirectionChange,
}: TodoSortProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="size-4 text-muted-foreground" />

      <Select
        onValueChange={(value) => onSortChange(value as SortBy)}
        value={sortBy}
      >
        <SelectTrigger className="w-[180px]" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={onDirectionChange}
        size="icon-sm"
        title={direction === "asc" ? "Ordem crescente" : "Ordem decrescente"}
        variant="outline"
      >
        {direction === "asc" ? (
          <ArrowUp className="size-4" />
        ) : (
          <ArrowDown className="size-4" />
        )}
      </Button>
    </div>
  );
}

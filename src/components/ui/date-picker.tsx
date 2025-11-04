"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecione uma data",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClearDate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateChange(undefined);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            variant="outline"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: ptBR }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            autoFocus
            captionLayout="dropdown"
            formatters={{
              formatMonthDropdown: (date) =>
                date.toLocaleDateString("pt-BR", { month: "long" }),
            }}
            locale={ptBR}
            mode="single"
            onSelect={(newDate) => {
              onDateChange(newDate);
              setOpen(false);
            }}
            selected={date}
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button
          className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
          onClick={handleClearDate}
          size="sm"
          type="button"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

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
    e.stopPropagation();
    onDateChange(undefined);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          variant="outline"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ptBR }) : placeholder}
          {date && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClearDate}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          initialFocus
          mode="single"
          onSelect={(newDate) => {
            onDateChange(newDate);
            setOpen(false);
          }}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
}

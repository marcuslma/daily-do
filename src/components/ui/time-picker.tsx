"use client";

import { X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  time?: Date;
  onTimeChange: (time: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function TimePicker({ time, onTimeChange, className }: TimePickerProps) {
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    if (time) {
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      setValue(`${hours}:${minutes}`);
    } else {
      setValue("");
    }
  }, [time]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d]/g, ""); // Remove tudo exceto dígitos

    // Limita a 4 dígitos (HHMM)
    if (input.length > 4) {
      input = input.slice(0, 4);
    }

    // Valida e formata
    let formatted = "";
    if (input.length >= 1) {
      let hours = input.slice(0, 2);
      // Limita hora a 23
      if (Number.parseInt(hours, 10) > 23) {
        hours = "23";
      }
      formatted = hours;

      if (input.length >= 3) {
        let minutes = input.slice(2, 4);
        // Limita minutos a 59
        if (Number.parseInt(minutes, 10) > 59) {
          minutes = "59";
        }
        formatted += `:${minutes}`;
      }
    }

    setValue(formatted);

    // Atualiza o time se estiver completo
    if (formatted.length === 5) {
      const [hours, minutes] = formatted.split(":").map(Number);
      const newTime = new Date();
      newTime.setHours(hours, minutes, 0, 0);
      onTimeChange(newTime);
    } else if (formatted === "") {
      onTimeChange(undefined);
    }
  };

  const handleClear = () => {
    setValue("");
    onTimeChange(undefined);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        className="flex-1"
        maxLength={5}
        onChange={handleChange}
        placeholder="00:00"
        type="text"
        value={value}
      />
      <Button
        className="shrink-0"
        onClick={handleClear}
        size="icon"
        type="button"
        variant="ghost"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

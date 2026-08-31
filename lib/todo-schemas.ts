import { z } from "zod";
import { isCalendarDay } from "@/lib/timezone";

export const todoDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Informe uma descrição.")
    .max(500, "Descrição muito longa."),
});

export const todoIdSchema = z.string().uuid();

export const todoDateSchema = z.string().refine(isCalendarDay, {
  message: "Informe uma data válida.",
});

export const todoFormSchema = z.object({
  description: todoDescriptionSchema.shape.description,
  todoDate: todoDateSchema,
});

export const todoCompletionSchema = z.object({
  todoId: todoIdSchema,
  completed: z.boolean(),
});

import { z } from "zod";

export const todoDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Informe uma descrição.")
    .max(500, "Descrição muito longa."),
});

export const todoIdSchema = z.string().uuid();

export const todoCompletionSchema = z.object({
  todoId: todoIdSchema,
  completed: z.boolean(),
});

import { z } from "zod";

const name = z
  .string()
  .trim()
  .min(2, "Informe seu nome.")
  .max(100, "Nome muito longo.");

const email = z.string().trim().email("Informe um e-mail válido.");

const password = z
  .string()
  .min(8, "A senha deve ter ao menos 8 caracteres.")
  .max(128, "A senha deve ter no máximo 128 caracteres.");

export const signUpSchema = z.object({
  name,
  email,
  password,
});

export const signInSchema = z.object({
  email,
  password,
});

export const passwordResetRequestSchema = z.object({
  email,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Link de redefinição inválido."),
    password,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  });

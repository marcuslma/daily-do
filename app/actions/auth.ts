"use server";

import {
  passwordResetRequestSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/auth-schemas";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { AuthActionState } from "@/lib/auth-action-state";
import { getRequiredServerEnv } from "@/lib/env";

function getStringValue(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    name: getStringValue(formData, "name"),
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        ...parsed.data,
        callbackURL: getRequiredServerEnv("BETTER_AUTH_URL") + "/dashboard",
      },
      headers: await headers(),
    });
  } catch {
    return {
      message: "Não foi possível criar sua conta. Tente novamente.",
    };
  }

  redirect("/dashboard");
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        ...parsed.data,
        callbackURL: getRequiredServerEnv("BETTER_AUTH_URL") + "/dashboard",
      },
      headers: await headers(),
    });
  } catch {
    return {
      message: "Não foi possível entrar. Verifique seus dados e tente novamente.",
    };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/sign-in");
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = passwordResetRequestSchema.safeParse({
    email: getStringValue(formData, "email"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: getRequiredServerEnv("BETTER_AUTH_URL") + "/reset-password",
      },
    });
  } catch {
    // Keep the response neutral so account existence is not disclosed.
  }

  return {
    message: "Se houver uma conta com este e-mail, você receberá as instruções.",
  };
}

export async function resetPassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: getStringValue(formData, "token"),
    password: getStringValue(formData, "password"),
    passwordConfirmation: getStringValue(formData, "passwordConfirmation"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        token: parsed.data.token,
        newPassword: parsed.data.password,
      },
    });
  } catch {
    return {
      message: "Não foi possível redefinir sua senha. Solicite um novo link.",
    };
  }

  redirect("/sign-in?reset=success");
}

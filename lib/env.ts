import "server-only";

export type RequiredServerEnv =
  | "DATABASE_URL"
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  | "RESEND_API_KEY"
  | "RESEND_FROM";

export function getRequiredServerEnv(name: RequiredServerEnv): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }

  return value;
}

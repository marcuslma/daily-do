import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { getRequiredServerEnv } from "@/lib/env";
import { sendTransactionalEmail } from "@/lib/mail";

const baseURL = getRequiredServerEnv("BETTER_AUTH_URL");

export const auth = betterAuth({
  appName: "Daily Do",
  baseURL,
  secret: getRequiredServerEnv("BETTER_AUTH_SECRET"),
  trustedOrigins: [baseURL],
  database: db,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      void sendTransactionalEmail({
        to: user.email,
        subject: "Redefina sua senha do Daily Do",
        html:
          '<p>Use este link para redefinir sua senha: <a href="' +
          url +
          '">Redefinir senha</a>.</p>',
        text: "Use este link para redefinir sua senha: " + url,
      }).catch(() => console.error("Failed to send password-reset email"));
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      void sendTransactionalEmail({
        to: user.email,
        subject: "Confirme seu e-mail no Daily Do",
        html:
          '<p>Confirme seu e-mail: <a href="' +
          url +
          '">Confirmar e-mail</a>.</p>',
        text: "Confirme seu e-mail: " + url,
      }).catch(() => console.error("Failed to send verification email"));
    },
  },
  plugins: [nextCookies()],
});

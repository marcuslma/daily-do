import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  betterAuth: vi.fn(),
  nextCookies: vi.fn(() => ({ id: "next-cookies" })),
  sendTransactionalEmail: vi.fn(),
}));

vi.mock("better-auth", () => ({
  betterAuth: mocks.betterAuth,
}));

vi.mock("better-auth/next-js", () => ({
  nextCookies: mocks.nextCookies,
}));

vi.mock("@/lib/db", () => ({
  db: { query: vi.fn() },
}));

vi.mock("@/lib/mail", () => ({
  sendTransactionalEmail: mocks.sendTransactionalEmail,
}));

describe("auth configuration", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.sendTransactionalEmail.mockResolvedValue(undefined);
  });

  async function getOptions() {
    mocks.betterAuth.mockReturnValue({ api: {} });
    await import("@/lib/auth");

    return mocks.betterAuth.mock.calls[0]?.[0] as {
      emailAndPassword: {
        sendResetPassword?: (data: unknown) => Promise<void>;
      } & Record<string, unknown>;
      emailVerification: {
        sendVerificationEmail?: (data: unknown) => Promise<void>;
      } & Record<string, unknown>;
      plugins: unknown[];
    };
  }

  it("enables automatic email-password signup without blocking unverified users", async () => {
    const options = await getOptions();

    expect(options.emailAndPassword).toMatchObject({
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 60 * 60,
    });
    expect(options.emailVerification).toMatchObject({
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 60 * 60,
    });
    expect(options.plugins).toEqual([{ id: "next-cookies" }]);
  });

  it("sends a verification link to the user who signs up", async () => {
    const options = await getOptions();

    await options.emailVerification.sendVerificationEmail?.({
      user: { email: "ana@example.com" },
      url: "http://localhost:3000/api/auth/verify-email?token=token_1",
      token: "token_1",
    });

    expect(mocks.sendTransactionalEmail).toHaveBeenCalledWith({
      to: "ana@example.com",
      subject: "Confirme seu e-mail no Daily Do",
      html: expect.stringContaining(
        "http://localhost:3000/api/auth/verify-email?token=token_1",
      ),
      text: expect.stringContaining(
        "http://localhost:3000/api/auth/verify-email?token=token_1",
      ),
    });
  });

  it("sends a reset link to the user who requests a new password", async () => {
    const options = await getOptions();

    await options.emailAndPassword.sendResetPassword?.({
      user: { email: "ana@example.com" },
      url: "http://localhost:3000/reset-password?token=token_1",
      token: "token_1",
    });

    expect(mocks.sendTransactionalEmail).toHaveBeenCalledWith({
      to: "ana@example.com",
      subject: "Redefina sua senha do Daily Do",
      html: expect.stringContaining(
        "http://localhost:3000/reset-password?token=token_1",
      ),
      text: expect.stringContaining(
        "http://localhost:3000/reset-password?token=token_1",
      ),
    });
  });
});

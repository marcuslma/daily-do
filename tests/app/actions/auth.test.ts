import { beforeEach, describe, expect, it, vi } from "vitest";
import { initialAuthActionState } from "@/lib/auth-action-state";

const requestHeaders = new Headers({ cookie: "better-auth.session_token=test" });
const mocks = vi.hoisted(() => ({
  signUpEmail: vi.fn(),
  signInEmail: vi.fn(),
  signOut: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
  headers: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      signUpEmail: mocks.signUpEmail,
      signInEmail: mocks.signInEmail,
      signOut: mocks.signOut,
      requestPasswordReset: mocks.requestPasswordReset,
      resetPassword: mocks.resetPassword,
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: mocks.headers,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

describe("signUp", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(requestHeaders);
  });

  it("returns field errors before sending an incomplete signup to Better Auth", async () => {
    const { signUp } = await import("@/app/actions/auth");

    const state = await signUp(initialAuthActionState, new FormData());

    expect(state.fieldErrors?.name).toContain("Informe seu nome.");
    expect(state.fieldErrors?.email).toContain("Informe um e-mail válido.");
    expect(state.fieldErrors?.password).toContain(
      "A senha deve ter ao menos 8 caracteres.",
    );
    expect(mocks.signUpEmail).not.toHaveBeenCalled();
  });

  it("creates a session through Better Auth and redirects after a valid signup", async () => {
    mocks.signUpEmail.mockResolvedValue({
      token: "session_token",
      user: { id: "user_1" },
    });
    const { signUp } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("name", "Ana Silva");
    formData.set("email", "ana@example.com");
    formData.set("password", "senha-segura");

    await expect(signUp(initialAuthActionState, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mocks.signUpEmail).toHaveBeenCalledWith({
      body: {
        name: "Ana Silva",
        email: "ana@example.com",
        password: "senha-segura",
        callbackURL: "http://localhost:3000/dashboard",
      },
      headers: requestHeaders,
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns a safe account-creation message when Better Auth rejects signup", async () => {
    mocks.signUpEmail.mockRejectedValue(new Error("provider details"));
    const { signUp } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("name", "Ana Silva");
    formData.set("email", "ana@example.com");
    formData.set("password", "senha-segura");

    await expect(signUp(initialAuthActionState, formData)).resolves.toEqual({
      message: "Não foi possível criar sua conta. Tente novamente.",
    });
  });
});

describe("signIn", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(requestHeaders);
  });

  it("returns field errors before sending incomplete credentials to Better Auth", async () => {
    const { signIn } = await import("@/app/actions/auth");

    const state = await signIn(initialAuthActionState, new FormData());

    expect(state.fieldErrors?.email).toContain("Informe um e-mail válido.");
    expect(state.fieldErrors?.password).toContain(
      "A senha deve ter ao menos 8 caracteres.",
    );
    expect(mocks.signInEmail).not.toHaveBeenCalled();
  });

  it("creates a session and redirects after valid credentials", async () => {
    mocks.signInEmail.mockResolvedValue({
      token: "session_token",
      user: { id: "user_1" },
    });
    const { signIn } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("email", "ana@example.com");
    formData.set("password", "senha-segura");

    await expect(signIn(initialAuthActionState, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mocks.signInEmail).toHaveBeenCalledWith({
      body: {
        email: "ana@example.com",
        password: "senha-segura",
        callbackURL: "http://localhost:3000/dashboard",
      },
      headers: requestHeaders,
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns a generic message when credentials are rejected", async () => {
    mocks.signInEmail.mockRejectedValue(new Error("provider details"));
    const { signIn } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("email", "ana@example.com");
    formData.set("password", "senha-segura");

    await expect(signIn(initialAuthActionState, formData)).resolves.toEqual({
      message: "Não foi possível entrar. Verifique seus dados e tente novamente.",
    });
  });
});

describe("signOut", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(requestHeaders);
  });

  it("forwards the current session headers and redirects to sign-in", async () => {
    mocks.signOut.mockResolvedValue({
      success: true,
      url: undefined,
      redirect: undefined,
    });
    const { signOut } = await import("@/app/actions/auth");

    await expect(signOut()).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.signOut).toHaveBeenCalledWith({ headers: requestHeaders });
    expect(mocks.redirect).toHaveBeenCalledWith("/sign-in");
  });
});

describe("requestPasswordReset", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(requestHeaders);
  });

  it("returns an email field error before requesting a reset for invalid input", async () => {
    const { requestPasswordReset } = await import("@/app/actions/auth");

    const state = await requestPasswordReset(
      initialAuthActionState,
      new FormData(),
    );

    expect(state.fieldErrors?.email).toContain("Informe um e-mail válido.");
    expect(mocks.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("requests a reset and returns a neutral confirmation message", async () => {
    mocks.requestPasswordReset.mockResolvedValue({ status: true });
    const { requestPasswordReset } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("email", "ana@example.com");

    await expect(
      requestPasswordReset(initialAuthActionState, formData),
    ).resolves.toEqual({
      message: "Se houver uma conta com este e-mail, você receberá as instruções.",
    });

    expect(mocks.requestPasswordReset).toHaveBeenCalledWith({
      body: {
        email: "ana@example.com",
        redirectTo: "http://localhost:3000/reset-password",
      },
    });
  });

  it("keeps the confirmation neutral if Better Auth rejects the reset request", async () => {
    mocks.requestPasswordReset.mockRejectedValue(new Error("provider details"));
    const { requestPasswordReset } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("email", "missing@example.com");

    await expect(
      requestPasswordReset(initialAuthActionState, formData),
    ).resolves.toEqual({
      message: "Se houver uma conta com este e-mail, você receberá as instruções.",
    });
  });
});

describe("resetPassword", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(requestHeaders);
  });

  it("returns a field error when password confirmation does not match", async () => {
    const { resetPassword } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("token", "token_1");
    formData.set("password", "senha-segura");
    formData.set("passwordConfirmation", "outra-senha");

    const state = await resetPassword(initialAuthActionState, formData);

    expect(state.fieldErrors?.passwordConfirmation).toContain(
      "As senhas não coincidem.",
    );
    expect(mocks.resetPassword).not.toHaveBeenCalled();
  });

  it("updates the password and redirects to sign-in", async () => {
    mocks.resetPassword.mockResolvedValue({ status: true });
    const { resetPassword } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("token", "token_1");
    formData.set("password", "senha-segura");
    formData.set("passwordConfirmation", "senha-segura");

    await expect(
      resetPassword(initialAuthActionState, formData),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.resetPassword).toHaveBeenCalledWith({
      body: { token: "token_1", newPassword: "senha-segura" },
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/sign-in?reset=success");
  });

  it("returns a safe reset error when the token is rejected", async () => {
    mocks.resetPassword.mockRejectedValue(new Error("provider details"));
    const { resetPassword } = await import("@/app/actions/auth");
    const formData = new FormData();
    formData.set("token", "invalid_token");
    formData.set("password", "senha-segura");
    formData.set("passwordConfirmation", "senha-segura");

    await expect(
      resetPassword(initialAuthActionState, formData),
    ).resolves.toEqual({
      message: "Não foi possível redefinir sua senha. Solicite um novo link.",
    });
  });
});

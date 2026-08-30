import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";

const mocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  signIn: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock("@/app/actions/auth", () => ({
  signUp: mocks.signUp,
  signIn: mocks.signIn,
  requestPasswordReset: mocks.requestPasswordReset,
  resetPassword: mocks.resetPassword,
}));

describe("authentication forms", () => {
  it("renders the signup fields consumed by the signup Server Function", () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText("Nome")).toHaveAttribute("name", "name");
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("name", "password");
    expect(
      screen.getByRole("button", { name: "Criar conta" }),
    ).toBeEnabled();
  });

  it("renders the sign-in fields consumed by the signIn Server Function", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText("E-mail")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("name", "password");
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
  });

  it("renders the email field consumed by the reset-request Server Function", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText("E-mail")).toHaveAttribute("name", "email");
    expect(
      screen.getByRole("button", { name: "Enviar instruções" }),
    ).toBeEnabled();
  });

  it("renders the token and password fields consumed by resetPassword", () => {
    render(<ResetPasswordForm token="token_1" />);

    expect(screen.getByDisplayValue("token_1")).toHaveAttribute(
      "name",
      "token",
    );
    expect(screen.getByLabelText("Nova senha")).toHaveAttribute(
      "name",
      "password",
    );
    expect(screen.getByLabelText("Confirmar nova senha")).toHaveAttribute(
      "name",
      "passwordConfirmation",
    );
  });
});

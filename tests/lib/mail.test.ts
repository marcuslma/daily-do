import { describe, expect, it, vi } from "vitest";

const send = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

describe("sendTransactionalEmail", () => {
  it("delivers the supplied HTML and text through the configured sender", async () => {
    send.mockResolvedValue({ data: { id: "email_123" }, error: null });
    const { sendTransactionalEmail } = await import("@/lib/mail");

    await sendTransactionalEmail({
      to: "person@example.com",
      subject: "Confirme seu e-mail",
      html: "<p>Confirme sua conta.</p>",
      text: "Confirme sua conta.",
    });

    expect(send).toHaveBeenCalledWith({
      from: "Daily Do <onboarding@resend.dev>",
      to: "person@example.com",
      subject: "Confirme seu e-mail",
      html: "<p>Confirme sua conta.</p>",
      text: "Confirme sua conta.",
    });
  });

  it("fails without exposing a provider error when delivery is rejected", async () => {
    send.mockResolvedValue({ data: null, error: { message: "invalid sender" } });
    const { sendTransactionalEmail } = await import("@/lib/mail");

    await expect(
      sendTransactionalEmail({
        to: "person@example.com",
        subject: "Confirme seu e-mail",
        html: "<p>Confirme sua conta.</p>",
        text: "Confirme sua conta.",
      }),
    ).rejects.toThrow("Unable to send transactional email");
  });
});

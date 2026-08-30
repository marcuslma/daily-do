import "server-only";
import { Resend } from "resend";
import { getRequiredServerEnv } from "@/lib/env";

const resend = new Resend(getRequiredServerEnv("RESEND_API_KEY"));

export type TransactionalEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
}: TransactionalEmail): Promise<void> {
  const { error } = await resend.emails.send({
    from: getRequiredServerEnv("RESEND_FROM"),
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error("Unable to send transactional email");
  }
}

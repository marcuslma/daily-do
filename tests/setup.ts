import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(() => cleanup());

process.env.DATABASE_URL =
  "postgresql://daily_do:daily_do_local@localhost:5433/daily_do";
process.env.BETTER_AUTH_SECRET =
  "test-secret-with-at-least-thirty-two-characters";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.RESEND_API_KEY = "re_test";
process.env.RESEND_FROM = "Daily Do <onboarding@resend.dev>";
process.env.TZ = "America/Sao_Paulo";

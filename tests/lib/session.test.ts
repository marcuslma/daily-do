import { beforeEach, describe, expect, it, vi } from "vitest";

const requestHeaders = new Headers({ cookie: "better-auth.session_token=test" });
const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  headers: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: mocks.headers,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mocks.getSession,
    },
  },
}));

describe("requireSession", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(requestHeaders);
  });

  it("redirects an unauthenticated dashboard request to sign-in", async () => {
    mocks.getSession.mockResolvedValue(null);
    const { requireSession } = await import("@/lib/session");

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.getSession).toHaveBeenCalledWith({ headers: requestHeaders });
    expect(mocks.redirect).toHaveBeenCalledWith("/sign-in");
  });
});

describe("redirectIfAuthenticated", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(requestHeaders);
  });

  it("redirects an authenticated public-page request to the dashboard", async () => {
    mocks.getSession.mockResolvedValue({
      session: { id: "session_1" },
      user: { id: "user_1", name: "Ana" },
    });
    const { redirectIfAuthenticated } = await import("@/lib/session");

    await expect(redirectIfAuthenticated()).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.getSession).toHaveBeenCalledWith({ headers: requestHeaders });
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { handler: vi.fn() },
  toNextJsHandler: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("better-auth/next-js", () => ({
  toNextJsHandler: mocks.toNextJsHandler,
}));

describe("Better Auth route handler", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("mounts the official handler for GET and POST requests", async () => {
    const GET = vi.fn();
    const POST = vi.fn();
    mocks.toNextJsHandler.mockReturnValue({ GET, POST });

    const route = await import("@/app/api/auth/[...all]/route");

    expect(mocks.toNextJsHandler).toHaveBeenCalledWith(mocks.auth);
    expect(route.GET).toBe(GET);
    expect(route.POST).toBe(POST);
  });
});

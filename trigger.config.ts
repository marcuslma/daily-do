import { defineConfig } from "@trigger.dev/sdk";

function getTriggerProjectRef(): string {
  const projectRef = process.env.TRIGGER_PROJECT_REF?.trim();

  if (!projectRef) {
    throw new Error("Missing required environment variable: TRIGGER_PROJECT_REF");
  }

  return projectRef;
}

export default defineConfig({
  project: getTriggerProjectRef(),
  dirs: ["./trigger"],
  maxDuration: 300,
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      factor: 2,
      minTimeoutInMs: 1_000,
      maxTimeoutInMs: 10_000,
      randomize: true,
    },
  },
});

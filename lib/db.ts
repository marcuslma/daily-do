import "server-only";
import { Pool } from "pg";
import { getRequiredServerEnv } from "@/lib/env";

export const db = new Pool({
  connectionString: getRequiredServerEnv("DATABASE_URL"),
});

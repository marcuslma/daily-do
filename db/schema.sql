CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL,
  image text,
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS account (
  id text PRIMARY KEY,
  issuer text NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp with time zone,
  "refreshTokenExpiresAt" timestamp with time zone,
  scope text,
  password text,
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "account_issuer_accountId_uidx"
  ON account (issuer, "accountId");

CREATE INDEX IF NOT EXISTS "account_userId_idx" ON account ("userId");

CREATE TABLE IF NOT EXISTS session (
  id text PRIMARY KEY,
  "expiresAt" timestamp with time zone NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp with time zone NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "session_userId_idx" ON session ("userId");

CREATE TABLE IF NOT EXISTS verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamp with time zone NOT NULL,
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp with time zone NOT NULL
);

CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification (identifier);

CREATE TABLE IF NOT EXISTS todo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  description text NOT NULL CHECK (char_length(btrim(description)) BETWEEN 1 AND 500),
  todo_date date NOT NULL DEFAULT CURRENT_DATE,
  original_created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  carryover_count integer NOT NULL DEFAULT 0 CONSTRAINT todo_carryover_count_nonnegative CHECK (carryover_count >= 0),
  previous_todo_id uuid CONSTRAINT todo_previous_todo_id_fkey REFERENCES todo(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamp with time zone
);

ALTER TABLE todo ADD COLUMN IF NOT EXISTS todo_date date;
ALTER TABLE todo ADD COLUMN IF NOT EXISTS original_created_at timestamp with time zone;
ALTER TABLE todo ADD COLUMN IF NOT EXISTS carryover_count integer;
ALTER TABLE todo ADD COLUMN IF NOT EXISTS previous_todo_id uuid;

UPDATE todo SET todo_date = created_at::date WHERE todo_date IS NULL;
UPDATE todo
SET original_created_at = created_at
WHERE original_created_at IS NULL;
UPDATE todo SET carryover_count = 0 WHERE carryover_count IS NULL;

ALTER TABLE todo
  ALTER COLUMN todo_date SET DEFAULT CURRENT_DATE,
  ALTER COLUMN todo_date SET NOT NULL,
  ALTER COLUMN original_created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN original_created_at SET NOT NULL,
  ALTER COLUMN carryover_count SET DEFAULT 0,
  ALTER COLUMN carryover_count SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'todo_carryover_count_nonnegative'
      AND conrelid = 'todo'::regclass
  ) THEN
    ALTER TABLE todo
      ADD CONSTRAINT todo_carryover_count_nonnegative
      CHECK (carryover_count >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'todo_previous_todo_id_fkey'
      AND conrelid = 'todo'::regclass
  ) THEN
    ALTER TABLE todo
      ADD CONSTRAINT todo_previous_todo_id_fkey
      FOREIGN KEY (previous_todo_id) REFERENCES todo(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS todo_user_completion_created_idx
  ON todo (user_id, completed_at, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS todo_previous_todo_id_uidx
  ON todo (previous_todo_id);

CREATE INDEX IF NOT EXISTS todo_user_date_idx ON todo (user_id, todo_date DESC);

CREATE INDEX IF NOT EXISTS todo_date_completion_idx ON todo (todo_date, completed_at);

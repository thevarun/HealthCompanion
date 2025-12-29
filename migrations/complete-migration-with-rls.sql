-- Complete Migration for health_companion.threads table
-- Apply this entire script in Supabase SQL Editor
-- This includes schema creation + RLS policies

-- Step 1: Create schema and table (from Drizzle migration)
CREATE SCHEMA IF NOT EXISTS "health_companion";

CREATE TABLE IF NOT EXISTS "health_companion"."threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"conversation_id" text NOT NULL,
	"title" text,
	"last_message_preview" text,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "threads_conversation_id_unique" UNIQUE("conversation_id")
);

CREATE INDEX IF NOT EXISTS "idx_threads_user_id" ON "health_companion"."threads" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_threads_conversation_id" ON "health_companion"."threads" USING btree ("conversation_id");
CREATE INDEX IF NOT EXISTS "idx_threads_user_archived" ON "health_companion"."threads" USING btree ("user_id","archived");

-- Step 2: Enable Row Level Security
ALTER TABLE health_companion.threads ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies

-- Policy 1: SELECT - Users can only view their own threads
CREATE POLICY "Users can view their own threads"
ON health_companion.threads
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: INSERT - Users can only create threads for themselves
CREATE POLICY "Users can create their own threads"
ON health_companion.threads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: UPDATE - Users can only update their own threads
CREATE POLICY "Users can update their own threads"
ON health_companion.threads
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: DELETE - Users can only delete their own threads
CREATE POLICY "Users can delete their own threads"
ON health_companion.threads
FOR DELETE
USING (auth.uid() = user_id);

-- Verification queries (run these to confirm)
-- SELECT * FROM pg_policies WHERE tablename = 'threads';
-- SELECT * FROM health_companion.threads; -- Should only show your threads when authenticated

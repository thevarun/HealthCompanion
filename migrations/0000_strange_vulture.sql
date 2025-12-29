CREATE SCHEMA "health_companion";
--> statement-breakpoint
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
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_threads_user_id" ON "health_companion"."threads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_threads_conversation_id" ON "health_companion"."threads" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_threads_user_archived" ON "health_companion"."threads" USING btree ("user_id","archived");
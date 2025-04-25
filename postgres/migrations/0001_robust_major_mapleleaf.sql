CREATE TABLE "error_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"stack" text,
	"type" text,
	"url" text,
	"user_agent" text,
	"user_id" text,
	"user_role" text,
	"metadata" jsonb,
	"severity" text DEFAULT 'medium',
	"status" text DEFAULT 'new',
	"resolved_at" timestamp,
	"resolved_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

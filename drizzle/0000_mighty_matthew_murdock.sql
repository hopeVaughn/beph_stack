CREATE TABLE IF NOT EXISTS "todos" (
	"id" uuid PRIMARY KEY DEFAULT get_random_uuid() NOT NULL,
	"content" varchar(256) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);

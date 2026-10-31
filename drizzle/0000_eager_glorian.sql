CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"hero_image" text NOT NULL,
	"category" varchar(100) DEFAULT 'panduan' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author" varchar(255) DEFAULT 'Tim Ahli Agro Prima Greenhouse' NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cron_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_name" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"message" text,
	"articles_processed" integer DEFAULT 0,
	"executed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"pathname" varchar(500) NOT NULL,
	"filename" varchar(255) NOT NULL,
	"content_type" varchar(100),
	"size" integer,
	"alt_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_articles_status_scheduled" ON "articles" USING btree ("status","scheduled_at");--> statement-breakpoint
CREATE INDEX "idx_articles_published_at" ON "articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "idx_articles_category" ON "articles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_cron_logs_executed_at" ON "cron_logs" USING btree ("executed_at");--> statement-breakpoint
CREATE INDEX "idx_media_created_at" ON "media" USING btree ("created_at");
CREATE TYPE "public"."weekday" AS ENUM('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU');--> statement-breakpoint
ALTER TABLE "class_schedules" ADD COLUMN "start_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD COLUMN "rrule" text NOT NULL;--> statement-breakpoint
ALTER TABLE "class_schedules" ADD COLUMN "weekly_times" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "class_schedules" DROP COLUMN "week_of";--> statement-breakpoint
ALTER TABLE "class_schedules" DROP COLUMN "weekday";--> statement-breakpoint
ALTER TABLE "class_schedules" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "class_schedules" DROP COLUMN "end_time";
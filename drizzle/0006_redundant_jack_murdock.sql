ALTER TABLE "class_schedules" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "class_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "class_schedules" CASCADE;--> statement-breakpoint
DROP TABLE "class_sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_session_id_class_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "session_id";
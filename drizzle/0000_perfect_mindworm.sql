CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"color" text DEFAULT '#3b82f6',
	"price" bigint NOT NULL,
	"sort_order" integer DEFAULT 0,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"class_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"status" text DEFAULT 'paid' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "classes_name_uidx" ON "classes" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "classes_code_uidx" ON "classes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "classes_sort_idx" ON "classes" USING btree ("sort_order","name");--> statement-breakpoint
CREATE INDEX "classes_is_deleted_index" ON "classes" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "payments_date_idx" ON "payments" USING btree ("date");--> statement-breakpoint
CREATE INDEX "payments_class_date_idx" ON "payments" USING btree ("class_id","date");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");
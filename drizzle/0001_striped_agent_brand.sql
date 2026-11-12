CREATE TYPE "public"."department" AS ENUM('women', 'men', 'unisex');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "department" "department" DEFAULT 'unisex' NOT NULL;--> statement-breakpoint
CREATE INDEX "products_department_idx" ON "products" USING btree ("department");
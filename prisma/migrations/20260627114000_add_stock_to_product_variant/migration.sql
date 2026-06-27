-- Add stock column back to product_variants
ALTER TABLE "product_variants" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;

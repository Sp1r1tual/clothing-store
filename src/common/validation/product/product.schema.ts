import { z } from "zod";

export interface ProductSchemaMessages {
  imageUrlRequired: string;
  variantSizeRequired: string;
  variantStockMin: string;
  productNameRequired: string;
  productNameMax: string;
  productSlugRequired: string;
  productSlugRegex: string;
  productPriceRequired: string;
  productPricePositive: string;
  productDiscountPricePositive: string;
  productCategoryRequired: string;
}

export const createProductImageSchema = (msg: ProductSchemaMessages) =>
  z.object({
    url: z.string().min(1, msg.imageUrlRequired),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
    order: z.number().default(0),
  });

export const createProductVariantSchema = (msg: ProductSchemaMessages) =>
  z.object({
    size: z.string().min(1, msg.variantSizeRequired),
    color: z.string().optional(),
    stock: z.number().min(0, msg.variantStockMin).default(0),
    sku: z.string().optional(),
  });

export const createProductSchema = (msg: ProductSchemaMessages) =>
  z.object({
    name: z.string().min(1, msg.productNameRequired).max(255, msg.productNameMax),
    slug: z
      .string()
      .min(1, msg.productSlugRequired)
      .regex(/^[a-z0-9-]+$/, msg.productSlugRegex),
    description: z.string().optional(),
    composition: z.string().optional(),
    careInstructions: z.string().optional(),
    measurements: z.string().optional(),
    price: z.number({ message: msg.productPriceRequired }).positive(msg.productPricePositive),
    discountPrice: z.number().positive(msg.productDiscountPricePositive).optional().nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    categoryId: z.string().min(1, msg.productCategoryRequired),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    isFeatured: z.boolean().default(false),
    images: z.array(createProductImageSchema(msg)).default([]),
    variants: z.array(createProductVariantSchema(msg)).default([]),
  });

export const productSchema = createProductSchema({
  imageUrlRequired: "Image URL is required",
  variantSizeRequired: "Size is required",
  variantStockMin: "Stock cannot be negative",
  productNameRequired: "Name is required",
  productNameMax: "Name is too long",
  productSlugRequired: "Slug is required",
  productSlugRegex: "Slug can only contain lowercase letters, numbers, and hyphens",
  productPriceRequired: "Price is required",
  productPricePositive: "Price must be greater than 0",
  productDiscountPricePositive: "Discounted price must be greater than 0",
  productCategoryRequired: "Category is required",
});

export type ProductFormData = z.infer<typeof productSchema>;

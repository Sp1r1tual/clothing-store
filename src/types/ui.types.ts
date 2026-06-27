export type ButtonVariant = "primary" | "secondary" | "ghost" | "google" | "danger" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type BadgeVariant = "sale" | "new" | "featured" | "outOfStock" | "default";
export type BadgeSize = "sm" | "md";

export interface DrawerLinkItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  isDanger?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Subcategory {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string;
  _count?: { products: number };
}

export type CategoryId = "shoes" | "outerwear" | "pants" | "accessories";

export type ContactFormData = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: string;
};

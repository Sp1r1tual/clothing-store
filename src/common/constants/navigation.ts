export interface ILinkItem {
  href: string;
  label: string;
}

export const CATALOG_LINKS: ILinkItem[] = [
  { href: "/men", label: "Чоловіки" },
  { href: "/women", label: "Жінки" },
  { href: "/kids", label: "Діти" },
  { href: "/new-arrivals", label: "Новинки" },
  { href: "/brands", label: "Бренди" },
];

export const CUSTOMER_LINKS: ILinkItem[] = [
  { href: "/shipping-delivery", label: "Доставка та оплата" },
  { href: "/returns", label: "Повернення" },
  { href: "/faq", label: "FAQ" },
];

import { NextRequest, NextResponse } from "next/server";

import { searchProducts } from "@/db/product";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const locale = searchParams.get("locale") ?? "uk";

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const { products } = await searchProducts(q, { page: 1, limit: 6 });

    const result = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: locale === "en" ? p.nameEn : p.nameUk,
      price: p.price,
      discountPrice: p.discountPrice,
      image: p.images[0]?.url ?? null,
      categorySlug: p.category.slug,
    }));

    return NextResponse.json({ products: result });
  } catch {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

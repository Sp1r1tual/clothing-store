import "dotenv/config";

import { prisma } from "../src/libs/prisma";

async function main() {
  console.log("Start seeding base categories...");

  const baseCategories = [
    {
      nameUk: "Чоловіки",
      nameEn: "Men",
      slug: "men",
      order: 0,
    },
    {
      nameUk: "Жінки",
      nameEn: "Women",
      slug: "women",
      order: 1,
    },
    {
      nameUk: "Унісекс",
      nameEn: "Unisex",
      slug: "unisex",
      order: 2,
    },
    {
      nameUk: "Аксесуари",
      nameEn: "Accessories",
      slug: "accessories",
      order: 3,
    },
  ];

  for (const category of baseCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        nameUk: category.nameUk,
        nameEn: category.nameEn,
        slug: category.slug,
        order: category.order,
      },
    });
    console.log(`Upserted root category: ${created.nameUk} / ${created.nameEn} (${created.slug})`);
  }

  const parents = ["men", "women", "unisex"];
  const subCategoriesData = [
    { nameUk: "Взуття", nameEn: "Shoes", slugSuffix: "shoes", order: 0 },
    { nameUk: "Верхній одяг", nameEn: "Outerwear", slugSuffix: "outerwear", order: 1 },
    { nameUk: "Штани", nameEn: "Pants", slugSuffix: "pants", order: 2 },
  ];

  for (const parentSlug of parents) {
    const parentCategory = await prisma.category.findUnique({ where: { slug: parentSlug } });
    if (parentCategory) {
      for (const sub of subCategoriesData) {
        const subSlug = `${parentSlug}-${sub.slugSuffix}`;
        const shoesSub = await prisma.category.upsert({
          where: { slug: subSlug },
          update: {},
          create: {
            nameUk: sub.nameUk,
            nameEn: sub.nameEn,
            slug: subSlug,
            order: sub.order,
            parentId: parentCategory.id,
          },
        });
        console.log(
          `Upserted subcategory: ${shoesSub.nameUk} (${shoesSub.slug}) under ${parentSlug}`,
        );
      }
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

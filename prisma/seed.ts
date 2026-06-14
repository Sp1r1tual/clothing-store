import "dotenv/config";

import { prisma } from "../src/libs/prisma";

async function main() {
  console.log("Start seeding base categories...");

  const baseCategories = [
    {
      nameUk: "Чоловіки",
      nameEn: "Men",
      slug: "men",
      order: 1,
    },
    {
      nameUk: "Жінки",
      nameEn: "Women",
      slug: "women",
      order: 2,
    },
    {
      nameUk: "Інше",
      nameEn: "Other",
      slug: "other",
      order: 3,
    },
  ];

  for (const category of baseCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {}, // If it exists, do nothing
      create: {
        nameUk: category.nameUk,
        nameEn: category.nameEn,
        slug: category.slug,
        order: category.order,
      },
    });
    console.log(`Upserted category: ${created.nameUk} / ${created.nameEn} (${created.slug})`);
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

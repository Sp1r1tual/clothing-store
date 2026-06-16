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
      nameUk: "Інше",
      nameEn: "Other",
      slug: "other",
      order: 2,
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

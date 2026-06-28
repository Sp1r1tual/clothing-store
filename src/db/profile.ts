import { prisma } from "@/libs/prisma";

export async function updateProfile(
  userId: string,
  data: {
    name: string;
    phone: string | null;
  },
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
    },
    select: {
      name: true,
      phone: true,
    },
  });
}

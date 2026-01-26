import { prisma } from "@/db/client";

export async function fetchFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
}

export async function fetchAllProducts({
  search = "",
}: { search?: string } = {}) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

import { prisma } from "@/db/client";

export async function fetchFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
}

export async function fetchAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

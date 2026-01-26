import { prisma } from "@/db/client";
import { redirect } from "next/navigation";

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

export async function fetchSingleProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect("/products");
  return product;
}

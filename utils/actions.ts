"use server";
import { prisma } from "@/db/client";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getAuthUser() {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
}

function renderError(error:unknown):{message:string} {
  console.error(error);
  return {
    message:
      error instanceof Error ? error.message : "Failed to create product",
  };
}

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

export async function createProductAction(
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> {
  const user = await getAuthUser();
  try {
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const price = Number(formData.get("price") as string);
    // temp
    const image = formData.get("image") as File;
    const description = formData.get("description") as string;
    const featured = Boolean(formData.get("featured") as string);

    await prisma.product.create({
      data: {
        name,
        company,
        price,
        image: "/images/product-1.jpg",
        description,
        featured,
        clerkId: user?.id,
      },
    });
    return { message: "product created successfully" };
  } catch (error) {
    return renderError(error);
  }
}

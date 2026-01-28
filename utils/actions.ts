"use server";
import { prisma } from "@/db/client";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, validateWithZodSchema } from "./schemas";
import z from "zod";

async function getAuthUser() {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
}

function renderError(error: unknown): { message: string } {
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
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;
    const validatedData = validateWithZodSchema(productSchema, rawData);
    const validateFile = validateWithZodSchema(imageSchema, {image: file});

    await prisma.product.create({
      data: {
        ...validatedData,
        clerkId: user.id,
        image: "/images/product-3.jpg",
      },
    });

    return { message: "product created successfully" };
  } catch (error) {
    return renderError(error);
  }
}

import { prisma } from "@/db/client";
import productsJson from "./products.json";

async function main() {
  for (const product of productsJson) {
    await prisma.product.create({ data: product });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

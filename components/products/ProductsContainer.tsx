import { fetchAllProducts } from "@/utils/actions";
import React from "react";
import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";
import { Button } from "../ui/button";
import Link from "next/link";
import { Grid2X2Icon, ListIcon } from "lucide-react";

type Props = { layout: string; search: string };

async function ProductsContainer({ layout, search }: Props) {
  const products = await fetchAllProducts({search});
  const totalProducts = products.length;
  const searchTerm = search ? `&search=${search}` : ``;

  return (
    <>
      {/* HEADER */}
      <section className="flex justify-between items-center">
        <h4 className="font-md text-lg">
          {totalProducts} product{totalProducts > 1 && "s"}
        </h4>
        <div className="flex gap-x-4">
          <Button
            variant={layout === "grid" ? "default" : "ghost"}
            size={"icon"}
            asChild
          >
            <Link href={`/products?layout=grid${searchTerm}`}>
              <Grid2X2Icon />
            </Link>
          </Button>
          <Button
            variant={layout === "list" ? "default" : "ghost"}
            size={"icon"}
            asChild
          >
            <Link href={`/products?layout=list${searchTerm}`}>
              <ListIcon/>
            </Link>
          </Button>
        </div>
      </section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your search...
          </h5>
        ) : layout === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </>
  );
}

export default ProductsContainer;

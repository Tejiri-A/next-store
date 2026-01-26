"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { debounce } from "@tanstack/react-pacer";

function NavSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState<string>(
    searchParams.get("search")?.toString() || "",
  );

  const handleSearch = debounce(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      // addd search query params in the prescence of some value
      if (value) params.set("search", value);
      else params.delete("search");
      replace(`/products?${params.toString()}`);
    },
    { wait: 500 },
  );

  useEffect(() => {
    if (!searchParams.get("search")) setSearch("");
  }, [searchParams.get("search")]);

  return (
    <Input
      type="search"
      placeholder="search product..."
      className="max-w-xs dark:bg-muted"
      onChange={(e) => {
        // control state value
        setSearch(e.target.value);
        // navigate to the product and provide the right query parameters
        handleSearch(e.target.value);
      }}
      value={search}
    />
  );
}

export default NavSearch;

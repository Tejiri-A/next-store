# Search Parameters in Next.js: Complete Guide

## Table of Contents

1. [Understanding URLs](#understanding-urls)
2. [What are Search Parameters?](#what-are-search-parameters)
3. [Search Parameters in Next.js](#search-parameters-in-nextjs)
4. [Reading Search Parameters](#reading-search-parameters)
5. [Updating Search Parameters](#updating-search-parameters)
6. [Keeping UI in Sync](#keeping-ui-in-sync)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## Understanding URLs

A URL (Uniform Resource Locator) is the address of a resource on the web. Let's break down its components:

```
https://example.com:443/products/shoes?color=red&size=10#reviews
└─┬─┘   └────┬────┘ └┬┘ └─────┬─────┘ └──────┬──────┘ └───┬──┘
  │          │       │        │               │            │
scheme     domain   port    path          query string   fragment
```

### URL Components:

- **Scheme**: Protocol (http, https)
- **Domain**: The website address
- **Port**: Network port (usually omitted, defaults to 80/443)
- **Path**: The route/page location
- **Query String**: Search parameters (key-value pairs)
- **Fragment**: Section identifier (hash)

---

## What are Search Parameters?

Search parameters (also called query parameters or URL parameters) are key-value pairs appended to a URL after a `?` symbol. They're used to:

- Filter data (e.g., `?category=electronics`)
- Sort results (e.g., `?sort=price-asc`)
- Paginate content (e.g., `?page=2`)
- Track state (e.g., `?tab=details`)
- Pass data between pages
- Enable deep linking (shareable URLs with specific state)

### Syntax:

```
?key1=value1&key2=value2&key3=value3
```

- Starts with `?`
- Multiple parameters separated by `&`
- Each parameter is `key=value`
- Values should be URL-encoded (spaces become `%20`, etc.)

### Examples:

```
# Single parameter
/products?search=laptop

# Multiple parameters
/products?search=laptop&sort=price&order=asc

# Array-like parameters
/products?colors=red&colors=blue&colors=green
# OR
/products?colors=red,blue,green

# Encoded special characters
/products?search=coffee%20maker&brand=Mr.%20Coffee
```

---

## Search Parameters in Next.js

Next.js provides different approaches depending on whether you're using the **App Router** (Next.js 13+) or **Pages Router**.

### App Router (Recommended - Next.js 13+)

In the App Router, Next.js distinguishes between:

- **Server Components** (default)
- **Client Components** (marked with `'use client'`)

#### Server Components

Server components receive search parameters through the `searchParams` prop:

```tsx
// app/products/page.tsx
interface SearchParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
}

interface ProductsPageProps {
  searchParams: SearchParams;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const search = searchParams.search || "";
  const category = searchParams.category || "all";
  const currentPage = Number(searchParams.page) || 1;

  // Fetch data based on search parameters
  const products = await fetchProducts({
    search,
    category,
    page: currentPage,
  });

  return (
    <div>
      <h1>Products</h1>
      {/* Render products */}
    </div>
  );
}
```

**Key Points:**

- Search params are passed as props automatically
- They're available on page components only (not layout components)
- The prop is a plain object with string values
- Server components can be async

#### Client Components

Client components use the `useSearchParams` hook:

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";

  return (
    <div>
      <p>Current search: {search}</p>
      <p>Current category: {category}</p>
    </div>
  );
}
```

---

## Reading Search Parameters

### In Server Components

```tsx
// app/products/page.tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Direct property access
  const search = searchParams.search;
  const category = searchParams.category;

  // Handle arrays (multiple values for same key)
  const colors = Array.isArray(searchParams.colors)
    ? searchParams.colors
    : searchParams.colors
      ? [searchParams.colors]
      : [];

  // Provide defaults
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = searchParams.limit ? Number(searchParams.limit) : 20;

  return <div>...</div>;
}
```

### In Client Components

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function FilterPanel() {
  const searchParams = useSearchParams();

  // Get single value
  const search = searchParams.get("search"); // string | null

  // Get all values for a key (for array parameters)
  const colors = searchParams.getAll("colors"); // string[]

  // Check if parameter exists
  const hasSort = searchParams.has("sort"); // boolean

  // Get all parameters as entries
  const allParams = Array.from(searchParams.entries());
  // [['search', 'laptop'], ['category', 'electronics']]

  // Convert to object
  const paramsObject = Object.fromEntries(searchParams.entries());

  return <div>...</div>;
}
```

---

## Updating Search Parameters

### Method 1: Using Router Push (Client Component)

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearch = useCallback(
    (newSearch: string) => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams(searchParams.toString());

      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      // Update the URL
      router.push(`/products?${params.toString()}`);
    },
    [searchParams, router],
  );

  return (
    <input
      type="text"
      defaultValue={searchParams.get("search") || ""}
      onChange={(e) => updateSearch(e.target.value)}
    />
  );
}
```

### Method 2: Using Links (Server or Client Component)

```tsx
import Link from "next/link";

export default function CategoryFilter({
  currentCategory,
}: {
  currentCategory: string;
}) {
  const categories = ["all", "electronics", "clothing", "books"];

  return (
    <div>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/products?category=${category}`}
          className={currentCategory === category ? "active" : ""}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
```

### Method 3: Preserving Existing Parameters

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSort = (newSort: string) => {
    // Create new URLSearchParams preserving existing params
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);

    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={searchParams.get("sort") || ""}
      onChange={(e) => updateSort(e.target.value)}
    >
      <option value="">Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name">Name</option>
    </select>
  );
}
```

---

## Keeping UI in Sync

### The Challenge

When using search parameters, you need to ensure:

1. URL updates when user interacts with UI
2. UI reflects current URL state
3. Changes are smooth without full page reloads
4. Browser back/forward buttons work correctly

### Solution 1: Single Source of Truth Pattern

Always read from URL, write to URL:

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for input (for typing experience)
  const [inputValue, setInputValue] = useState("");

  // Sync local state with URL
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setInputValue(urlSearch);
  }, [searchParams]);

  // Update URL (debounced)
  const updateURL = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    // Optionally debounce this
    updateURL(value);
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="Search products..."
    />
  );
}
```

### Solution 2: Debounced Updates

For better performance, debounce URL updates:

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");

  // Sync with URL on mount and URL changes
  useEffect(() => {
    setInputValue(searchParams.get("search") || "");
  }, [searchParams]);

  // Debounced URL update
  const debouncedUpdateURL = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
      // Reset to first page when searching
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, 300); // 300ms delay

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedUpdateURL(value);
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}
```

### Solution 3: Custom Hook for Search Params Management

Create a reusable hook:

```tsx
// hooks/useUpdateSearchParams.ts
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useUpdateSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const getAllParams = useCallback((): Record<string, string> => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  return { updateParams, getParam, getAllParams };
}

// Usage:
export default function FilterComponent() {
  const { updateParams, getParam } = useUpdateSearchParams();

  const handleCategoryChange = (category: string) => {
    updateParams({
      category,
      page: "1", // Reset page when changing category
    });
  };

  return (
    <select
      value={getParam("category") || ""}
      onChange={(e) => handleCategoryChange(e.target.value)}
    >
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="clothing">Clothing</option>
    </select>
  );
}
```

---

## Best Practices

### 1. Type Safety

Define types for your search parameters:

```tsx
// types/searchParams.ts
export interface ProductSearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "price-asc" | "price-desc" | "name" | "date";
  page?: string;
}

// Validation function
export function parseProductSearchParams(params: {
  [key: string]: string | string[] | undefined;
}): ProductSearchParams {
  return {
    search: typeof params.search === "string" ? params.search : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    minPrice: typeof params.minPrice === "string" ? params.minPrice : undefined,
    maxPrice: typeof params.maxPrice === "string" ? params.maxPrice : undefined,
    sort:
      typeof params.sort === "string" &&
      ["price-asc", "price-desc", "name", "date"].includes(params.sort)
        ? (params.sort as ProductSearchParams["sort"])
        : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
  };
}
```

### 2. Always Provide Defaults

```tsx
const page = Number(searchParams.page) || 1;
const limit = Number(searchParams.limit) || 20;
const sort = searchParams.sort || "date-desc";
```

### 3. Clean Up Empty Parameters

```tsx
const createQueryString = (params: Record<string, string | null>) => {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== "" && value !== undefined) {
      urlParams.set(key, value);
    }
  });

  return urlParams.toString();
};
```

### 4. Handle Arrays Consistently

```tsx
// Reading arrays
const colors = searchParams.getAll("color"); // ['red', 'blue']

// Writing arrays
const params = new URLSearchParams();
["red", "blue", "green"].forEach((color) => {
  params.append("color", color);
});
// Results in: ?color=red&color=blue&color=green
```

### 5. Reset Related Parameters

When changing filters, reset pagination:

```tsx
const handleFilterChange = (filter: string) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("filter", filter);
  params.set("page", "1"); // Reset to first page
  router.push(`${pathname}?${params.toString()}`);
};
```

### 6. Encode Special Characters

```tsx
const params = new URLSearchParams();
params.set("search", "coffee & tea"); // Automatically encoded
// Results in: ?search=coffee+%26+tea
```

### 7. Suspense Boundaries

Wrap components using `useSearchParams` in Suspense:

```tsx
// app/products/page.tsx
import { Suspense } from "react";
import SearchBar from "./SearchBar";

export default function ProductsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBar />
      </Suspense>
      {/* Other content */}
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Search with Filters and Pagination

```tsx
// app/products/page.tsx
import ProductList from "./ProductList";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import Pagination from "./Pagination";

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParams.search || "";
  const category = searchParams.category || "all";
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : 0;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : Infinity;
  const currentPage = searchParams.page ? Number(searchParams.page) : 1;
  const itemsPerPage = 20;

  const { products, totalCount } = await fetchProducts({
    search,
    category,
    minPrice,
    maxPrice,
    page: currentPage,
    limit: itemsPerPage,
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div>
      <SearchBar />
      <Filters />
      <ProductList products={products} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
```

```tsx
// components/Pagination.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)}>Previous</Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link href={createPageURL(currentPage + 1)}>Next</Link>
      )}
    </div>
  );
}
```

### Pattern 2: Multi-Select Filters

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ColorFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedColors = searchParams.getAll("color");

  const toggleColor = (color: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove all existing color params
    params.delete("color");

    // Add back all colors except the one being toggled off
    let newColors = [...selectedColors];
    if (newColors.includes(color)) {
      newColors = newColors.filter((c) => c !== color);
    } else {
      newColors.push(color);
    }

    // Add new colors to params
    newColors.forEach((c) => params.append("color", c));

    // Reset to first page
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const colors = ["red", "blue", "green", "yellow", "black", "white"];

  return (
    <div>
      <h3>Colors</h3>
      {colors.map((color) => (
        <label key={color}>
          <input
            type="checkbox"
            checked={selectedColors.includes(color)}
            onChange={() => toggleColor(color)}
          />
          {color}
        </label>
      ))}
    </div>
  );
}
```

### Pattern 3: Persistent Search with Form

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FormEvent } from "react";

export default function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    // Update or delete each form field
    const search = formData.get("search") as string;
    const category = formData.get("category") as string;
    const minPrice = formData.get("minPrice") as string;

    if (search) params.set("search", search);
    else params.delete("search");

    if (category && category !== "all") params.set("category", category);
    else params.delete("category");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    // Reset to first page
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="search"
        type="text"
        defaultValue={searchParams.get("search") || ""}
        placeholder="Search..."
      />

      <select
        name="category"
        defaultValue={searchParams.get("category") || "all"}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <input
        name="minPrice"
        type="number"
        defaultValue={searchParams.get("minPrice") || ""}
        placeholder="Min price"
      />

      <button type="submit">Apply Filters</button>
    </form>
  );
}
```

---

## Troubleshooting

### Issue 1: URL Updates But Immediately Reverts

**Cause**: Using controlled inputs without proper state management.

**Solution**: Use `defaultValue` instead of `value` for form inputs, or manage state properly:

```tsx
// ❌ Wrong
<input type="text" value={searchParams.get('search') || ''} />

// ✅ Correct
<input type="text" defaultValue={searchParams.get('search') || ''} />

// ✅ Also correct (with state)
const [value, setValue] = useState(searchParams.get('search') || '');
<input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
```

### Issue 2: useSearchParams Causes Error

**Error**: "useSearchParams() should be wrapped in a suspense boundary"

**Solution**: Wrap the component in a Suspense boundary:

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComponentUsingSearchParams />
    </Suspense>
  );
}
```

### Issue 3: Parameters Not Updating

**Cause**: Not using `router.push` correctly or forgetting to preserve existing params.

**Solution**: Always create a new URLSearchParams from existing params:

```tsx
const params = new URLSearchParams(searchParams.toString());
params.set("key", "value");
router.push(`${pathname}?${params.toString()}`);
```

### Issue 4: Special Characters in URLs

**Cause**: Not properly encoding values.

**Solution**: URLSearchParams handles encoding automatically:

```tsx
const params = new URLSearchParams();
params.set("search", "user@email.com"); // Automatically encoded
```

### Issue 5: Type Errors with searchParams

**Cause**: searchParams can have string, string[], or undefined values.

**Solution**: Always validate and normalize:

```tsx
const getValue = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || "";
  return param || "";
};

const category = getValue(searchParams.category);
```

---

## Summary

### Key Takeaways:

1. **Search parameters** are part of the URL after `?` and enable shareable, bookmarkable state
2. **Server Components** receive searchParams as props (preferred for better performance)
3. **Client Components** use the `useSearchParams()` hook
4. **Always preserve existing params** when updating unless intentionally removing them
5. **Use URLSearchParams** for manipulating query strings
6. **Provide defaults** for all parameters
7. **Debounce updates** for better UX and performance
8. **Wrap in Suspense** when using `useSearchParams()` in client components
9. **Reset pagination** when filters change
10. **Type your parameters** for better developer experience

### Common Workflow:

1. Read current params from URL
2. Display them in your UI
3. When user interacts, update params
4. Push new URL with router
5. Next.js re-renders with new params
6. Repeat

This creates a seamless, URL-driven application where the URL is always the source of truth for application state.

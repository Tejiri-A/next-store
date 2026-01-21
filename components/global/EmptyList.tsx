import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  heading?: string;
  className?: string;
};

function EmptyList({ heading = "No items found.", className }: Props) {
  return <h2 className={cn("text-lg", className)}>{heading}</h2>;
}

export default EmptyList;

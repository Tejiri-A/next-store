import React from "react";
import { Button } from "../ui/button";
import { HeartIcon } from "lucide-react";

type Props = {
  productId: string;
};

function FavoriteToggleButton({ productId }: Props) {
  return (
    <Button size={"icon"} variant={"outline"} className="p-2 cursor-pointer">
      <HeartIcon />
    </Button>
  );
}

export default FavoriteToggleButton;

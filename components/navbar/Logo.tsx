import { Button } from "../ui/button";
import Link from "next/link";
import { CodeXml } from "lucide-react";

function Logo() {
  return (
    <Button asChild size={"icon"}>
      <Link href={"/"}>
        <CodeXml className="size-6" />
      </Link>
    </Button>
  );
}

export default Logo;

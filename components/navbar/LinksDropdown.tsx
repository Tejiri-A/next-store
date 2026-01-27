import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { AlignLeftIcon } from "lucide-react";
import { links } from "@/utils/links";
import Link from "next/link";
import UserIcon from "./UserIcon";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import SignOutLink from "./SignOutLink";
import { auth } from "@clerk/nextjs/server";

async function LinksDropdown() {
  const { userId } = await auth();
  const isAdmin = userId === process.env.ADMIN_USER_ID;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="flex gap-4 max-w-[100px]">
          <AlignLeftIcon className="size-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start" sideOffset={10}>
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode="modal">
              <Button className="w-full text-left">Sign In</Button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignUpButton mode="modal">
              <Button className="w-full text-left">Sign Up</Button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
        <SignedIn>
          {links.map(({ href, label }) => {
            if(label === 'dashboard' && !isAdmin) return null;
            return (
              <DropdownMenuItem key={href}>
                <Link href={href} className="capitalize w-full">
                  {label}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <hr />
          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;

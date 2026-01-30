"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Loader2Icon,
  PencilIcon,
  RotateCwIcon,
  Trash2Icon,
} from "lucide-react";

type btnSize = "default" | "lg" | "sm";

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export function SubmitButton({
  className = "",
  text = "",
  size = "lg",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn("capitalize", className)}
      size={size}
    >
      {pending ? (
        <>
          <Loader2Icon className="size-4 mr-2 animate-spin" />
          please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type ActionType = "edit" | "delete";

export function IconButton({ actionType }: { actionType: ActionType }) {
  const { pending } = useFormStatus();
  const renderIcon = () => {
    switch (actionType) {
      case "edit":
        return <PencilIcon />;
      case "delete":
        return <Trash2Icon />;
      default:
        const never: never = actionType;
        throw new Error("Invalid action type: " + never);
    }
  };
  return (
    <Button
      type="submit"
      size={"icon"}
      variant={"link"}
      className="p-2 cursor-pointer hover:bg-muted-foreground hover:text-white rounded-full"
    >
      {pending ? <RotateCwIcon className="animate-spin" /> : renderIcon()}
    </Button>
  );
}

"use client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { imageSchema, validateWithZodSchema } from "@/utils/schemas";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRef } from "react";

function ImageInput() {
  const inputImageRef = useRef<HTMLInputElement>(null);
  const imageUploadHandler = (e: any) => {
    const file = e.target.files?.[0];
    try {
      validateWithZodSchema(imageSchema, { image: file });
    } catch (error) {
      toast.error(
        error instanceof Error || error instanceof ZodError
          ? error.message
          : "Something went wrong",
      );
      if (inputImageRef.current) {
        inputImageRef.current.value = "";
      }
    }
  };
  const name = "image";
  return (
    <div className="mb-2 space-y-2">
      <Label htmlFor={name} className="capitalize">
        Image
      </Label>
      <Input
        id={name}
        name={name}
        type="file"
        required
        accept="image/*"
        onChange={imageUploadHandler}
        ref={inputImageRef}
      />
    </div>
  );
}

export default ImageInput;

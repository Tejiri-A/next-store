import { z, ZodSchema } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters long" })
    .max(100, { message: "name must be at most 100 characters long" }),
  company: z.string(),
  price: z.coerce
    .number()
    .int()
    .min(0, { message: "price must be a positive number" }),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    { message: "description must be between 10 and 1000 words" },
  ),
  featured: z.coerce.boolean(),
});

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw new Error(errors.join(", "));
  }
  return result.data;
}

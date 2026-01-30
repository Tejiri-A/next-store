import { createClient } from "@supabase/supabase-js";

const bucket = "main-bucket";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing supabase configuration. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(image: File) {
  const timestamp = Date.now();

  // sanitize the file name to avoid URL issues
  // extracts the file extension and replaces non alphanumeric characters with underscores
  const extension = image.name.split(".").pop();
  const originalName = image.name.split(".")[0];
  const sanitizedName = originalName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const newName = `${timestamp}-${sanitizedName}.${extension}`;

  //   destructure the error object for precise reporting
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: "3600" });

  if (error) {
    console.error("Supabase upload error", error);
    throw new Error(`Storage Error: ${error.message}`);
  }

  //   return the public URL of the uploaded image
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(newName);
  return urlData.publicUrl;
}

export function deleteImage(url: string) {
  const imageName = url.split("/").pop();
  if (!imageName) throw new Error("Invalid URL");
  return supabase.storage.from(bucket).remove([imageName]);
}

"use server";

import { getTranslations } from "next-intl/server";

import { assertAdmin } from "@/common/auth/server";
import { getSupabaseServer } from "@/common/utils/supabase/server";
import { validateImageFile } from "@/common/validation/file.validation";

export async function uploadProductImage(formData: FormData) {
  await assertAdmin();

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const t = await getTranslations("Admin.products.form.validation");
  validateImageFile(file, {
    imageSizeMax: t("imageSizeMax"),
    imageTypeInvalid: t("imageTypeInvalid"),
  });

  const supabase = await getSupabaseServer();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file, { upsert: false });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

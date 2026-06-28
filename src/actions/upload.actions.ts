"use server";

import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

import { assertAdmin } from "@/common/auth/server";
import { limiter } from "@/common/utils/rate-limit";
import { getSupabaseStorageClient } from "@/common/utils/supabase/client";
import { validateImageFile } from "@/common/validation/file.validation";

export async function uploadProductImage(formData: FormData) {
  const user = await assertAdmin();

  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  try {
    await limiter.check(50, `upload_${user.id}_${ip}`);
  } catch {
    throw new Error("Rate limit exceeded. Try again later.");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const t = await getTranslations("Admin.products.form.validation");
  await validateImageFile(file, {
    imageSizeMax: t("imageSizeMax"),
    imageTypeInvalid: t("imageTypeInvalid"),
  });

  const supabase = getSupabaseStorageClient();
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

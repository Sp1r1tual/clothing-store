export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface FileValidationMessages {
  imageSizeMax?: string;
  imageTypeInvalid?: string;
}

export function validateImageFile(file: File, messages?: FileValidationMessages) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(messages?.imageSizeMax || "File size must be less than 5MB");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(messages?.imageTypeInvalid || "Only image files are allowed");
  }
}

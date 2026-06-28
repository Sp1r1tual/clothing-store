export function getLocalizedField<T extends object, K extends string>(
  item: T,
  baseField: K,
  locale: string,
  fallbackField?: K,
): string {
  const isEn = locale === "en";
  const keyEn = `${baseField}En` as keyof T;
  const keyUk = `${baseField}Uk` as keyof T;

  const value = isEn ? item[keyEn] : item[keyUk];

  if (!value && fallbackField) {
    const fallbackEn = `${fallbackField}En` as keyof T;
    const fallbackUk = `${fallbackField}Uk` as keyof T;
    return (isEn ? item[fallbackEn] : item[fallbackUk]) as string;
  }

  return value as string;
}

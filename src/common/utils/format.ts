export const formatDate = (date: Date | string, locale: string, includeTime = false) => {
  return new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(new Date(date));
};

export const formatPrice = (amount: number, locale: string) => {
  const formatted = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return locale === "uk" ? `${formatted} грн` : `${formatted} UAH`;
};

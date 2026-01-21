export function formatCurrency(amount: number | null) {
  const value = amount || 0;
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

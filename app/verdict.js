// Verdict logic for FridayVault: one job — turn a deal's numbers and its
// verdict label into the numbers and words the cards show.

export const VERDICT_ORDER = { newlow: 0, strong: 1, routine: 2, inflated: 3 };

export const VERDICT_LABELS = {
  newlow: "NEW LOW",
  strong: "STRONG DEAL",
  routine: "ROUTINE SALE",
  inflated: "INFLATED — CHECK",
};

// Discount percentage from the two prices, rounded to a whole number.
export function discountPercent(deal) {
  if (!deal.was || deal.was <= 0) return 0;
  return Math.round(((deal.was - deal.price) / deal.was) * 100);
}

// Dollars saved, to two decimals where the price has cents.
export function dollarsSaved(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

export function formatPrice(value) {
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function verdictLabel(deal) {
  return VERDICT_LABELS[deal.verdict] ?? "ROUTINE SALE";
}

export function verdictRank(deal) {
  return VERDICT_ORDER[deal.verdict] ?? 2;
}

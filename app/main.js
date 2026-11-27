// FridayVault main script: one job — render the deal grid and make the
// search box, filters and sorting actually work, plus the detail dialog.

import { deals, comparisons, CHECKED_LABEL } from "./data.js";
import {
  discountPercent,
  dollarsSaved,
  formatPrice,
  verdictLabel,
  verdictRank,
} from "./verdict.js";

const grid = document.getElementById("deal-grid");
const countLine = document.getElementById("result-count");
const statsBox = document.getElementById("stats");
const compareBox = document.getElementById("compare");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("filter-category");
const storeSelect = document.getElementById("filter-store");
const discountSelect = document.getElementById("filter-discount");
const sortSelect = document.getElementById("sort");
const dialog = document.getElementById("deal-dialog");
const dialogBody = document.getElementById("dialog-body");

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function fillSelect(select, values, allLabel) {
  const all = document.createElement("option");
  all.value = "";
  all.textContent = allLabel;
  select.append(all);
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

function renderStats() {
  const total = deals.length;
  const avg = Math.round(
    deals.reduce((sum, deal) => sum + discountPercent(deal), 0) / total,
  );
  const newLows = deals.filter((deal) => deal.verdict === "newlow").length;
  const biggest = Math.max(...deals.map(discountPercent));
  const stats = [
    [total, "deals checked today"],
    [avg + "%", "average discount"],
    [newLows, "new-low prices"],
    [biggest + "%", "biggest discount"],
  ];
  statsBox.innerHTML = "";
  for (const [value, label] of stats) {
    const cell = document.createElement("div");
    cell.className = "stat";
    const big = document.createElement("b");
    big.textContent = value;
    const small = document.createElement("span");
    small.textContent = label;
    cell.append(big, small);
    statsBox.append(cell);
  }
}

function renderCompare() {
  const heading = document.createElement("h2");
  heading.textContent = "Same product, two stores — compare before you buy";
  compareBox.append(heading);
  for (const item of comparisons) {
    const row = document.createElement("div");
    row.className = "compare-row";
    const name = document.createElement("b");
    name.textContent = item.product + ": ";
    row.append(name);
    for (const entry of item.entries) {
      const span = document.createElement("span");
      span.textContent = entry.store + " " + formatPrice(entry.price);
      row.append(span);
    }
    const same = document.createElement("span");
    same.className = "same";
    same.textContent = "Same price — ";
    row.append(same);
    const note = document.createElement("span");
    note.textContent = item.note;
    row.append(note);
    compareBox.append(row);
  }
}

function dealCard(deal) {
  const card = document.createElement("article");
  card.className = "deal-card";
  card.tabIndex = 0;

  const top = document.createElement("div");
  top.className = "deal-top";
  const badge = document.createElement("span");
  badge.className = "verdict verdict-" + deal.verdict;
  badge.textContent = verdictLabel(deal);
  const off = document.createElement("span");
  off.className = "discount-badge";
  off.textContent = "-" + discountPercent(deal) + "%";
  top.append(badge, off);

  const title = document.createElement("h3");
  title.textContent = deal.title;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.innerHTML = "";
  const storeBold = document.createElement("b");
  storeBold.textContent = deal.store;
  meta.append(storeBold, document.createTextNode(" · " + deal.category));

  const prices = document.createElement("div");
  prices.className = "price-row";
  const sale = document.createElement("span");
  sale.className = "sale-price";
  sale.textContent = formatPrice(deal.price);
  const was = document.createElement("span");
  was.className = "was-price";
  was.textContent = formatPrice(deal.was);
  prices.append(sale, was);

  const save = document.createElement("p");
  save.className = "save-line";
  save.textContent = "You save " + formatPrice(dollarsSaved(deal)) + " (" + discountPercent(deal) + "% off)";

  const evidence = document.createElement("p");
  evidence.className = "evidence";
  evidence.textContent = deal.evidence;

  const checked = document.createElement("p");
  checked.className = "checked";
  checked.textContent = "Checked " + CHECKED_LABEL + " · Source: " + deal.source;

  const link = document.createElement("a");
  link.className = "store-link";
  link.href = deal.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View at " + deal.store + " →";

  card.append(top, title, meta, prices, save, evidence, checked, link);
  const open = (event) => {
    if (event.target === link) return;
    showDetail(deal);
  };
  card.addEventListener("click", open);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") showDetail(deal);
  });
  return card;
}

function showDetail(deal) {
  dialogBody.innerHTML = "";
  const title = document.createElement("h2");
  title.textContent = deal.title;
  const verdict = document.createElement("p");
  const verdictBadge = document.createElement("span");
  verdictBadge.className = "verdict verdict-" + deal.verdict;
  verdictBadge.textContent = verdictLabel(deal);
  verdict.append(verdictBadge);
  const list = document.createElement("dl");
  const rows = [
    ["Store", deal.store],
    ["Category", deal.category],
    ["Sale price", formatPrice(deal.price)],
    ["Usual price", formatPrice(deal.was)],
    ["Discount", discountPercent(deal) + "% — you save " + formatPrice(dollarsSaved(deal))],
    ["Checked", CHECKED_LABEL + " (07:00 UTC)"],
    ["Source", deal.source],
    ["Why this verdict", deal.evidence],
  ];
  for (const [term, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = term;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.append(dt, dd);
  }
  const link = document.createElement("a");
  link.className = "store-link";
  link.href = deal.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View at " + deal.store + " →";
  dialogBody.append(title, verdict, list, link);
  dialog.showModal();
}

function currentFilters() {
  return {
    query: searchInput.value.trim().toLowerCase(),
    category: categorySelect.value,
    store: storeSelect.value,
    minDiscount: Number(discountSelect.value),
    sort: sortSelect.value,
  };
}

function applyFilters() {
  const filters = currentFilters();
  let shown = deals.filter((deal) => {
    if (filters.category && deal.category !== filters.category) return false;
    if (filters.store && deal.store !== filters.store) return false;
    if (discountPercent(deal) < filters.minDiscount) return false;
    if (filters.query) {
      const haystack = (deal.title + " " + deal.store + " " + deal.category).toLowerCase();
      if (!haystack.includes(filters.query)) return false;
    }
    return true;
  });

  const sorters = {
    discount: (a, b) => discountPercent(b) - discountPercent(a),
    verdict: (a, b) => verdictRank(a) - verdictRank(b) || discountPercent(b) - discountPercent(a),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.title.localeCompare(b.title),
  };
  shown = [...shown].sort(sorters[filters.sort] ?? sorters.discount);

  grid.innerHTML = "";
  if (shown.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No deals match those filters — try clearing the search or lowering the discount.";
    grid.append(empty);
  } else {
    for (const deal of shown) grid.append(dealCard(deal));
  }
  countLine.textContent =
    "Showing " + shown.length + " of " + deals.length + " deals · sorted by " +
    sortSelect.options[sortSelect.selectedIndex].textContent.toLowerCase();
}

fillSelect(categorySelect, uniqueSorted(deals.map((deal) => deal.category)), "All categories");
fillSelect(storeSelect, uniqueSorted(deals.map((deal) => deal.store)), "All stores");

// Deep-linkable filters: ?q=tv&category=Audio&store=Amazon&discount=40&sort=verdict
// lets a filtered view be shared — and screenshotted — directly.
const params = new URLSearchParams(window.location.search);
if (params.get("q")) searchInput.value = params.get("q");
if (params.get("category")) categorySelect.value = params.get("category");
if (params.get("store")) storeSelect.value = params.get("store");
if (params.get("discount")) discountSelect.value = params.get("discount");
if (params.get("sort")) sortSelect.value = params.get("sort");
renderStats();
renderCompare();
applyFilters();

for (const control of [searchInput, categorySelect, storeSelect, discountSelect, sortSelect]) {
  control.addEventListener("input", applyFilters);
  control.addEventListener("change", applyFilters);
}

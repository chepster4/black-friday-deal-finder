# FridayVault — Black Friday Deal Finder

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/chepster4/black-friday-deal-finder/rank.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/chepster4/black-friday-deal-finder/reward.svg)](https://make.fun/competitions/black-friday-deal-finder-01)

FridayVault is a static Black Friday deal finder: 36 real deals, each found and
checked on 27 November 2026 at the named store or in a deals roundup naming the
store. Every card shows the product, the store, the sale price, the usual price,
the discount, a link to the store, when the price was checked, its source, and an
honest verdict — NEW LOW, STRONG DEAL, ROUTINE SALE or INFLATED — with the
evidence for it.

## How it works

- **Search** deals by name, store or category.
- **Filter** by category, store and minimum discount; **sort** by biggest discount,
  best verdict, price or name.
- **Compare** the same product at two stores (AirPods Pro 3 and the M5 MacBook Air
  are the same price at both stores — the strip says so).
- **Click a card** for the full detail: source, check time and the reason behind
  the verdict.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library. The site is plain static
files with no build step and no network request; the only links out are
`<a href>` links to the stores.

## Deal honesty

Prices were checked 27 November 2026, 14:00 WIB (07:00 UTC). Where a store shows
a “comparable value” instead of a proven past selling price (Best Buy's OLED TVs),
the card says so — judge those by the sale price alone. Amazon raised the list
prices of some Echo, Fire TV and Kindle devices earlier this year, so their
discounts are measured against a higher starting price; that is noted on the
cards too. Full research notes: see `DEAL-RESEARCH.md` in the build workdir.

## License

MIT — see [LICENSE](LICENSE).

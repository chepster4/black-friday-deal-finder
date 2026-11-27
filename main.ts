// FridayVault entry program (Node 22, standard library only).
//
// The site is plain static files under app/ (index.html, style.css, main.js,
// data.js, verdict.js) with no build step and no network request: every deal
// lives in app/data.js and every link out is a plain <a href> to a store.
// This program hands the entry in: it copies app/ and screenshots/ from
// beside this file into /output and writes /output/dossier.json with the
// vendored make.fun library, which is what the scorer compares byte for byte.
// Leave vendor/makefun-frontend.ts untouched.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// It must write identical bytes on every run.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// Dossier limits mirror the scorer's gate caps (reference/gate.json):
// text_max_bytes shapes the dossier text; the screenshot and app caps refuse
// an entry the scorer would refuse outright. Keeping them here, in one
// named object, makes a cap change a one-line edit instead of a hunt.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
} as const;

writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, DOSSIER_LIMITS),
);

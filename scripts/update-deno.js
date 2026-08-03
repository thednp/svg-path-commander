/**
 * Syncs JSR metadata fields in deno.json from package.json.
 * Copies version, description, keywords, and license.
 *
 * Usage:
 *   node scripts/update-deno.js
 */

import fs from "node:fs";

const FIELDS = ["version", "description", "keywords", "license"];

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const deno = JSON.parse(fs.readFileSync("deno.json", "utf-8"));

for (const field of FIELDS) {
  if (pkg[field] !== undefined) {
    deno[field] = pkg[field];
  }
}

fs.writeFileSync("deno.json", JSON.stringify(deno, null, 2) + "\n");
console.log(`[update-deno] Synced ${FIELDS.join(", ")} from package.json`);

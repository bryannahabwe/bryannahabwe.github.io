// Verifies every internal link and #fragment in the built site resolves.
// Usage: npm run build && npm run check:links   (add --external to also HEAD-check external URLs)
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const checkExternal = process.argv.includes("--external");

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) htmlFiles.push(p);
  }
})(dist);

const idsByFile = new Map();
const ids = (file) => {
  if (!idsByFile.has(file)) {
    const html = readFileSync(file, "utf8");
    idsByFile.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsByFile.get(file);
};

const resolvePage = (pathname) => {
  const clean = decodeURIComponent(pathname).replace(/^\//, "");
  const candidates = [join(dist, clean), join(dist, clean, "index.html"), join(dist, `${clean}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

const errors = [];
const external = new Set();

for (const file of htmlFiles) {
  const page = "/" + relative(dist, file).replace(/index\.html$/, "");
  const html = readFileSync(file, "utf8");
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(mailto:|tel:|data:)/.test(raw)) continue;
    if (/^https?:\/\//.test(raw)) {
      if (!raw.startsWith("https://bryan.umbatech.com")) external.add(raw);
      continue;
    }
    const url = new URL(raw.replace(/&amp;/g, "&"), `https://x${page}`);
    const target = resolvePage(url.pathname);
    if (!target) {
      errors.push(`${page}: ${attr}="${raw}" → missing file`);
      continue;
    }
    if (url.hash && target.endsWith(".html") && !ids(target).has(decodeURIComponent(url.hash.slice(1)))) {
      errors.push(`${page}: ${attr}="${raw}" → missing #${url.hash.slice(1)}`);
    }
  }
}

if (checkExternal) {
  for (const href of external) {
    try {
      const res = await fetch(href, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000) });
      console.log(`${res.status} ${href}`);
      if (res.status >= 400 && res.status !== 999 && res.status !== 403) errors.push(`external ${res.status}: ${href}`);
    } catch (e) {
      errors.push(`external error: ${href} (${e.message})`);
    }
  }
}

console.log(`Checked ${htmlFiles.length} pages, ${external.size} external URLs ${checkExternal ? "fetched" : "skipped"}.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("All links resolve.");

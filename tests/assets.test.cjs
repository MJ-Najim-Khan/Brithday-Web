const fs = require("node:fs");
const path = require("node:path");
process.chdir(path.resolve(__dirname, ".."));
const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("assets/js/script.js", "utf8");

for (const [, id] of js.matchAll(/getElementById\("([^"]+)"\)/g))
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing #${id}`);
for (const [, asset] of html.matchAll(/(?:src|href)="([^"]+)"/g))
  if (!/^https?:/.test(asset) && !fs.existsSync(asset)) throw new Error(`Missing asset ${asset}`);
for (const [, asset] of js.matchAll(/"([\w/.-]+\.(?:png|jpg))"/g))
  if (!fs.existsSync(asset)) throw new Error(`Missing dynamic image ${asset}`);
console.log("All script element references and local asset paths resolve");

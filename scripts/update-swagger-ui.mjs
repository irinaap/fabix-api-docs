// Downloads the latest (or given) swagger-ui-dist from npm and rebuilds the
// vendor files in api-docs/. No dependencies besides node + npm.
//
//   node scripts/update-swagger-ui.mjs          -> latest
//   node scripts/update-swagger-ui.mjs 5.33.0   -> exact version

import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2] || "latest";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "api-docs");
const tmp = mkdtempSync(join(tmpdir(), "swagger-ui-dist-"));

try {
  const tgz = execSync(`npm pack swagger-ui-dist@${version} --silent`, { cwd: tmp, encoding: "utf8", shell: true })
    .trim().split(/\r?\n/).pop();
  execSync(`tar -xzf "${tgz}"`, { cwd: tmp });
  const pkg = join(tmp, "package");
  const actual = JSON.parse(readFileSync(join(pkg, "package.json"), "utf8")).version;

  const read = (f) => readFileSync(join(pkg, f), "utf8")
    .replace(/\/\/# sourceMappingURL=.*$/gm, "")
    .replace(/\/\*# sourceMappingURL=.*?\*\//g, "");

  // Single JS bundle: swagger-ui-bundle (core + all deps) + standalone preset (top bar with spec selector).
  writeFileSync(join(out, "swagger-ui.bundle.js"),
    `/*! swagger-ui-dist ${actual} (swagger-ui-bundle.js + swagger-ui-standalone-preset.js) */\n` +
    read("swagger-ui-bundle.js") + "\n;\n" + read("swagger-ui-standalone-preset.js") + "\n");
  writeFileSync(join(out, "swagger-ui.css"), `/*! swagger-ui-dist ${actual} */\n` + read("swagger-ui.css"));

  for (const f of ["oauth2-redirect.html", "oauth2-redirect.js", "favicon-16x16.png", "favicon-32x32.png", "LICENSE", "NOTICE"]) {
    copyFileSync(join(pkg, f), join(out, f));
  }
  writeFileSync(join(out, "VERSION"), actual + "\n");
  console.log(`swagger-ui-dist ${actual} -> ${out}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

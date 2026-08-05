import { copyFile, cp, mkdir, rm } from "node:fs/promises";

const outputDirectory = "dist";

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await copyFile("index.html", `${outputDirectory}/index.html`);
await cp("assets", `${outputDirectory}/assets`, { recursive: true });

console.log("Cloudflare Pages artifact created in dist/ (index.html + assets/).");

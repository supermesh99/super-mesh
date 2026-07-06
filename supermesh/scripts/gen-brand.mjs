/**
 * Generate SuperMesh brand assets (logo + twitter banner) via OpenRouter.
 * Usage: node scripts/gen-brand.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const envText = readFileSync(join(root, "..", ".env"), "utf8");
const env = Object.fromEntries(
  envText.split("\n").filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const KEY = env.OPEN_ROUTER_API_KEY;
if (!KEY) throw new Error("OPEN_ROUTER_API_KEY not found");

const OUT = join(root, "landing", "assets");
mkdirSync(OUT, { recursive: true });

const MODEL = "google/gemini-3-pro-image";

async function generate(name, prompt) {
  process.stdout.write(`… ${name} `);
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      modalities: ["image", "text"],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const json = await res.json();
  const img = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!img) {
    console.error("\nno image:", JSON.stringify(json).slice(0, 300));
    return;
  }
  const b64 = img.split(",")[1];
  const ext = img.includes("image/jpeg") ? "jpg" : "png";
  writeFileSync(join(OUT, `${name}.${ext}`), Buffer.from(b64, "base64"));
  console.log(`→ ${name}.${ext} (${(Buffer.from(b64, "base64").length / 1024).toFixed(0)} KB)`);
}

await generate(
  "logo-mark",
  `Minimal geometric logo mark on pure black background, centered, generous margin:
   an abstract "super mesh" glyph — a hexagonal lattice of thin light-grey lines forming
   a subtle letter S in negative space, one node glowing brighter white, flat vector style,
   monochrome silver-white on black, extremely clean, no text, no gradients except the
   single glowing node, premium infrastructure-protocol branding, symmetric, iconic.`
);

await generate(
  "twitter-banner",
  `Twitter/X header banner 3:1 wide aspect ratio, pure black background, premium
   infrastructure-protocol branding: left third has a minimal hexagonal mesh lattice glyph
   in thin light-grey lines with one glowing white node; center-right has the wordmark
   "SUPERMESH" in a clean thin geometric sans-serif, letterspaced, silver-white, with a
   small monospace subtitle "VERIFIABLE PHYSICAL DATA · SOLANA" beneath it; far background
   shows an extremely faint constellation of tiny mesh nodes; monochrome, editorial,
   no other text, sharp, high contrast.`
);

console.log("done");

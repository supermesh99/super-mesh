/**
 * Generate landing-page image assets via OpenRouter image models.
 * Reads OPEN_ROUTER_API_KEY from ../.env (workspace root).
 *
 * Usage: node scripts/gen-assets.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// load .env from workspace root
const envText = readFileSync(join(root, "..", ".env"), "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const KEY = env.OPEN_ROUTER_API_KEY;
if (!KEY) throw new Error("OPEN_ROUTER_API_KEY not found in .env");

const OUT = join(root, "landing", "assets");
mkdirSync(OUT, { recursive: true });

const MODEL = "google/gemini-3.1-flash-image";

async function generate(name, prompt) {
  process.stdout.write(`… ${name} `);
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      modalities: ["image", "text"],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const json = await res.json();
  const img = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!img) {
    console.error("\nno image in response:", JSON.stringify(json).slice(0, 400));
    return;
  }
  const b64 = img.split(",")[1];
  const ext = img.includes("image/jpeg") ? "jpg" : "png";
  const file = join(OUT, `${name}.${ext}`);
  writeFileSync(file, Buffer.from(b64, "base64"));
  console.log(`→ ${file} (${(Buffer.from(b64, "base64").length / 1024).toFixed(0)} KB)`);
}

await generate(
  "hero-bg",
  `Ultra-wide cinematic photograph, 21:9, night city skyline seen from a rooftop at blue hour,
   dense fog, only cold graphite and deep charcoal tones, faint isolated points of white light
   suggesting a distributed sensor network across the city, extremely dark and moody, high-end
   editorial photography, no text, no people, subtle film grain, desaturated, almost monochrome.`
);

await generate(
  "device-studio",
  `Professional studio product photograph of a compact industrial IoT environmental sensor device:
   matte dark-graphite weatherproof enclosure with fine horizontal vent slats, one small stub antenna,
   a single tiny white status LED, standing on a dark reflective stone surface, pitch black background,
   dramatic rim lighting from the left, premium minimalist industrial design like high-end audio gear,
   photorealistic, desaturated, no text, no logos.`
);

await generate(
  "mesh-topo",
  `Abstract dark data-visualization artwork: a sparse constellation of small white nodes connected by
   ultra-thin faint grey lines forming an irregular mesh network over a pure black background,
   subtle depth of field, some nodes slightly brighter, extremely minimal, monochrome, museum-quality
   generative art, no text.`
);

console.log("done");

/**
 * Generate README-exclusive images via OpenRouter (distinct from brand assets).
 * Usage: node scripts/gen-readme.mjs
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

const OUT = join(root, "docs", "img");
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
  "readme-hero",
  `Ultra-wide 3:1 technical hero banner for a GitHub README, pure black (#000) background.
   Theme: planetary-scale decentralized sensor network. A dark globe rendered as a sparse
   wireframe of thin cyan-teal (#19f0d8) latitude/longitude arcs, hundreds of tiny glowing
   sensor nodes scattered across continents connected by faint geodesic light arcs forming
   a mesh. Subtle hexagonal grid overlay fading at edges. Right side: fine monospace-style
   HUD elements — thin bracket corners, tiny tick marks, a faint vertical data readout
   column of small rectangles (no readable text). Aesthetic: precision aerospace mission
   control, dark sci-fi cartography, extremely clean, high contrast, no words, no letters,
   no typography anywhere.`
);

await generate(
  "sensor-exploded",
  `Wide 16:9 technical illustration, pure black background: an exploded-view engineering
   diagram of an environmental sensor device rendered as a luminous cyan-teal wireframe /
   blueprint hologram. Layers separated vertically along an axis: perforated top housing,
   PM2.5 particulate sensor module, PCB with a highlighted secure-element chip glowing
   brighter, antenna coil, battery cell, bottom enclosure. Thin leader lines with small
   empty annotation brackets pointing to each layer (no readable text). Fine measurement
   tick marks and faint concentric alignment circles. Style: holographic CAD blueprint,
   dark aerospace schematic, extremely precise thin lines, monochrome cyan on black,
   no words, no letters.`
);

await generate(
  "settlement-abstract",
  `Wide 16:9 abstract technical visualization, pure black background: an on-chain
   settlement engine depicted as a large central glowing ring gyroscope made of thin
   cyan-teal wireframe circles at different tilts, with streams of tiny luminous squares
   (transactions) flowing into it along curved light paths from left, and ordered
   crystalline blocks chaining out to the right. Faint hexagonal lattice floor grid with
   perspective. Small HUD bracket corners at frame edges. Aesthetic: dark sci-fi precision
   instrument, particle streams, extremely clean composition, monochrome teal on black,
   no text, no letters, no numbers.`
);

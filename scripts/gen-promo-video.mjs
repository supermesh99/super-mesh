/**
 * Generate a SuperMesh Twitter promo video via OpenRouter's async video API.
 * Model: google/veo-3.1-fast (8s · 1080p · 16:9 · native audio).
 * Output: posts-twitter/promo/promo.mp4 (+ post.txt with the tweet copy).
 *
 * Usage: node scripts/gen-promo-video.mjs
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

const MODEL = "google/veo-3.1-fast";
const OUT_DIR = join(root, "posts-twitter", "promo");
mkdirSync(OUT_DIR, { recursive: true });

// First frame = brand logo so the clip opens on-brand.
const logoPng = readFileSync(join(root, "frontend", "public", "assets", "logo-mark.png"));
const logoDataUrl = `data:image/png;base64,${logoPng.toString("base64")}`;

const PROMPT = `Cinematic 8-second protocol launch teaser, premium tech-brand aesthetic, pure black
background throughout, monochrome silver-white with a single Solana-green (#14F195) accent color.

Opening frame: a minimal hexagonal mesh-lattice logo glyph of thin light-grey lines with one
glowing white node, centered on black (use the provided image as the exact first frame).

0-2s: slow push-in on the logo; the glowing node pulses once, emitting a soft green ripple.
2-5s: the camera dives through the lattice — it expands into an infinite 3D network of hexagonal
mesh nodes floating in black space; thin data pulses of green light travel along the edges between
nodes, like sensor readings being verified; subtle depth-of-field, particles drifting.
5-7s: the network rapidly zooms out to reveal it wrapping a dark wireframe globe — thousands of
tiny node lights across continents, a few flashing green as data settles.
7-8s: everything collapses back into the single logo glyph; beneath it the clean thin letterspaced
wordmark "SUPERMESH" fades in, with a small monospace subline "VERIFIABLE PHYSICAL DATA · SOLANA".

Style: sleek, editorial, infrastructure-grade; no people, no lens flares, no clutter, no other text.
Motion: smooth, deliberate, gimbal-like camera. Audio: minimal deep ambient synth swell with soft
electronic pulse ticks synced to the data flashes, ending on a single clean resonant hit.`;

const TWEET = `The mesh is live.

Real-world sensor data. Staked, challenged, verified — settled on Solana.

SuperMesh. Verifiable physical data.`;

const headers = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

console.log(`… submitting job (${MODEL}, 8s, 1080p, 16:9, audio)`);
const submit = await fetch("https://openrouter.ai/api/v1/videos", {
  method: "POST",
  headers,
  body: JSON.stringify({
    model: MODEL,
    prompt: PROMPT,
    duration: 8,
    resolution: "1080p",
    aspect_ratio: "16:9",
    generate_audio: true,
    frame_images: [
      { type: "image_url", image_url: { url: logoDataUrl }, frame_type: "first_frame" },
    ],
  }),
});
const job = await submit.json();
if (!job.id) {
  console.error("submit failed:", JSON.stringify(job).slice(0, 500));
  process.exit(1);
}
console.log(`  job ${job.id} → ${job.status}`);

let status = job;
while (status.status !== "completed") {
  if (status.status === "failed") {
    console.error("generation failed:", status.error ?? "unknown");
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 15000));
  status = await (await fetch(job.polling_url, { headers })).json();
  console.log(`  status: ${status.status}`);
}

const contentUrl = status.unsigned_urls?.[0] ?? `https://openrouter.ai/api/v1/videos/${job.id}/content?index=0`;
const video = await fetch(contentUrl, { headers });
const buf = Buffer.from(await video.arrayBuffer());
writeFileSync(join(OUT_DIR, "promo.mp4"), buf);
writeFileSync(join(OUT_DIR, "post.txt"), TWEET + "\n");
console.log(`→ promo/promo.mp4 (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
if (status.usage?.cost != null) console.log(`  cost: $${status.usage.cost}`);
console.log("done");

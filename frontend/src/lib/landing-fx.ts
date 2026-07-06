/**
 * Landing-page interactions (ported from the static site): 3D scenes,
 * parallax layers, reveals, decode text, counters, ticker.
 * Returns a cleanup function for React effects.
 */
import { mountModelViewer, mountParallaxField, mountSensorViewer } from "./sensor3d";

export function initLanding(): () => void {
  const cleanups: Array<() => void> = [];
  const on = (target: EventTarget, ev: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions) => {
    target.addEventListener(ev, fn, opts);
    cleanups.push(() => target.removeEventListener(ev, fn));
  };

  /* ── 3D: hero device + fixed background field ── */
  const heroCanvas = document.getElementById("hero-3d") as HTMLCanvasElement | null;
  if (heroCanvas) cleanups.push(mountSensorViewer(heroCanvas, { field: true, distance: 4.6, spin: 0.22, scrollRotate: true }));

  const fieldCanvas = document.getElementById("field-3d") as HTMLCanvasElement | null;
  if (fieldCanvas && matchMedia("(min-width: 700px)").matches) cleanups.push(mountParallaxField(fieldCanvas));

  /* ── section-embedded 3D models (lazy) ── */
  const lazyViewers: Array<[string, () => () => void]> = [
    ["gyro-3d", () => mountModelViewer(document.getElementById("gyro-3d") as HTMLCanvasElement, "gyro", { distance: 3.6, tilt: 0.15 })],
    ["chip-3d", () => mountModelViewer(document.getElementById("chip-3d") as HTMLCanvasElement, "chip", { distance: 3.4, tilt: 0.55, spin: 0.35 })],
    ["device2-3d", () => mountModelViewer(document.getElementById("device2-3d") as HTMLCanvasElement, "sensor", { distance: 4.0, tilt: 0.22, spin: 0.45, lookAtY: 0.2 })],
    ["logo-3d", () => mountModelViewer(document.getElementById("logo-3d") as HTMLCanvasElement, "logo", { distance: 8.5, tilt: 0.08, spin: 0.35 })],
  ];
  const pendingViewers = new Map(lazyViewers.map(([id, mount]) => [id, mount]));
  const mountViewer = (id: string) => {
    const mount = pendingViewers.get(id);
    if (mount) {
      pendingViewers.delete(id);
      cleanups.push(mount());
    }
  };
  const viewerIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        mountViewer((e.target as HTMLElement).id);
        viewerIO.unobserve(e.target);
      }),
    { rootMargin: "400px" }
  );
  for (const [id] of lazyViewers) {
    const el = document.getElementById(id);
    if (el) viewerIO.observe(el);
  }
  cleanups.push(() => viewerIO.disconnect());
  const viewerSweep = () => {
    for (const id of [...pendingViewers.keys()]) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight + 400 && r.bottom > -400) mountViewer(id);
    }
  };
  on(window, "scroll", viewerSweep, { passive: true });
  viewerSweep();

  /* ── reveal on scroll ── */
  const revealEls = new Set<Element>(document.querySelectorAll(".reveal"));
  const markIn = (el: Element) => {
    el.classList.add("in");
    revealEls.delete(el);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          markIn(e.target);
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
  const revealSweep = () => {
    for (const el of [...revealEls]) {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.92 && r.bottom > 0) markIn(el);
    }
  };
  on(window, "scroll", revealSweep, { passive: true });
  revealSweep();

  /* ── 2D parallax layers ── */
  const parallaxEls = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
  const heroBg = document.querySelector<HTMLElement>(".hero-bg");
  let ticking = false;
  const applyParallax = () => {
    ticking = false;
    const vh = innerHeight;
    for (const el of parallaxEls) {
      const rate = parseFloat(el.dataset.parallax || "0.1");
      const r = el.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translateY(${(-progress * rate * 100).toFixed(2)}px)`;
    }
    if (heroBg) heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.08)`;
  };
  on(
    window,
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyParallax);
      }
    },
    { passive: true }
  );
  applyParallax();

  /* ── scroll progress ── */
  const progress = document.getElementById("progress");
  if (progress) {
    on(
      window,
      "scroll",
      () => {
        const max = document.body.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${(scrollY / max).toFixed(4)})`;
      },
      { passive: true }
    );
  }

  /* ── text decode ── */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&";
  function decode(el: HTMLElement) {
    const target = el.dataset.text ?? el.textContent ?? "";
    let frame = 0;
    const total = Math.max(14, target.length * 2);
    const tick = () => {
      frame++;
      const solved = Math.floor((frame / total) * target.length);
      el.textContent = target
        .split("")
        .map((ch, i) => (i < solved || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join("");
      if (solved < target.length) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    tick();
  }
  const decodeIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          decode(e.target as HTMLElement);
          decodeIO.unobserve(e.target);
        }
      }),
    { threshold: 0.6 }
  );
  document.querySelectorAll<HTMLElement>(".decode").forEach((el) => {
    el.dataset.text = el.textContent ?? "";
    decodeIO.observe(el);
  });
  cleanups.push(() => decodeIO.disconnect());

  /* ── counters ── */
  function animateCounter(el: HTMLElement) {
    const target = el.dataset.count ?? "";
    const suffix = el.dataset.suffix ?? "";
    const num = parseFloat(target);
    if (isNaN(num)) return;
    const dur = 1200;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = num * eased;
      el.textContent =
        (target.includes(".") ? v.toFixed(target.split(".")[1].length) : Math.round(v).toString()) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const countIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target as HTMLElement);
          countIO.unobserve(e.target);
        }
      }),
    { threshold: 0.8 }
  );
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => countIO.observe(el));
  cleanups.push(() => countIO.disconnect());

  /* ── ticker ── */
  const ticker = document.getElementById("ticker-track");
  if (ticker) {
    const CITIES = ["BLR", "SFO", "BER", "TYO", "NBO", "SAO", "DEL", "LDN", "SEL", "AMS", "LAG", "MEX"];
    const mkEntry = () => {
      const city = CITIES[(Math.random() * CITIES.length) | 0];
      const pm = (8 + Math.random() * 60).toFixed(2);
      const id = Math.random().toString(36).slice(2, 6).toUpperCase();
      const ok = Math.random() > 0.06;
      return `<span class="tk"><b>${city}·${id}</b> PM2.5 ${pm} µg/m³ <i class="${ok ? "tk-ok" : "tk-flag"}">${ok ? "ATTESTED" : "CHALLENGED"}</i></span>`;
    };
    const entries = Array.from({ length: 18 }, mkEntry).join("");
    ticker.innerHTML = entries + entries;
  }

  /* ── nav scrolled ── */
  const nav = document.getElementById("nav");
  if (nav) on(window, "scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });

  return () => cleanups.forEach((fn) => fn());
}

/**
 * Procedural 3D assets for SuperMesh — a physically-modelled sensor device
 * and an ambient mesh-network particle field, rendered with Three.js.
 */
import * as THREE from "three";
/** Global registry so all live viewers can be force-rendered (debug/screenshots). */
function registerRender(fn: () => void) {
  const w = window as any;
  (w.__smRenderers ??= []).push(fn);
  w.__smRenderAll = () => w.__smRenderers.forEach((f: () => void) => f());
}
/* ────────────────────────────── device model ───────────────────────────── */

export function buildSensorDevice(): THREE.Group {
  const g = new THREE.Group();

  const shell = new THREE.MeshStandardMaterial({
    color: 0x4a4f57,
    metalness: 0.7,
    roughness: 0.35,
  });
  const shellDark = new THREE.MeshStandardMaterial({
    color: 0x2a2d33,
    metalness: 0.55,
    roughness: 0.5,
  });
  const slatMat = new THREE.MeshStandardMaterial({
    color: 0x0c0d10,
    metalness: 0.3,
    roughness: 0.9,
  });

  // main enclosure
  const body = new THREE.Mesh(roundedBox(1.6, 1.6, 0.55, 0.08), shell);
  g.add(body);

  // face plate (slightly proud of the body)
  const face = new THREE.Mesh(roundedBox(1.44, 1.44, 0.06, 0.05), shellDark);
  face.position.z = 0.3;
  g.add(face);

  // vent slats on the left side
  for (let i = 0; i < 11; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.4), slatMat);
    slat.position.set(-0.81, -0.62 + i * 0.124, 0);
    g.add(slat);
  }

  // front intake grille — recessed horizontal grooves
  const grooveMat = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, metalness: 0.2, roughness: 0.95 });
  for (let i = 0; i < 7; i++) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.045, 0.02), grooveMat);
    groove.position.set(-0.14, -0.42 + i * 0.115, 0.34);
    g.add(groove);
  }
  // brushed accent line under the grille
  const accent = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.012, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x8b929c, metalness: 0.9, roughness: 0.25 })
  );
  accent.position.set(-0.14, -0.56, 0.34);
  g.add(accent);

  // antenna
  const antMat = new THREE.MeshStandardMaterial({ color: 0x111214, metalness: 0.4, roughness: 0.65 });
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.85, 24), antMat);
  mast.position.set(0.45, 1.2, 0);
  mast.rotation.z = -0.12;
  g.add(mast);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), antMat);
  tip.position.set(0.55, 1.62, 0);
  g.add(tip);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.12, 24), shellDark);
  collar.position.set(0.44, 0.82, 0);
  collar.rotation.z = -0.12;
  g.add(collar);

  // status LED
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xdfe7ee,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    })
  );
  led.position.set(0.5, 0.5, 0.34);
  g.add(led);
  const ledGlow = new THREE.PointLight(0xcfe0ee, 0.6, 1.2);
  ledGlow.position.copy(led.position).z += 0.1;
  g.add(ledGlow);

  // base plinth
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.25, 0.08, 48), slatMat);
  base.position.y = -0.92;
  g.add(base);

  return g;
}

function roundedBox(w: number, h: number, d: number, r: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: d - r * 2,
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r,
    bevelSegments: 4,
    curveSegments: 8,
  });
  geo.center();
  return geo;
}

/* ───────────────────────── mesh-network particles ──────────────────────── */

export function buildNetworkField(count = 130, spread = 14): THREE.Group {
  const g = new THREE.Group();
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    pts.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * spread * 1.9,
        (Math.random() - 0.5) * spread * 0.85,
        (Math.random() - 0.5) * spread * 0.7 - 2
      )
    );
  }

  const nodeGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const nodes = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({ color: 0xaab4c0, size: 0.045, transparent: true, opacity: 0.85 })
  );
  g.add(nodes);

  // connect near neighbours
  const linePos: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (pts[i].distanceTo(pts[j]) < spread * 0.16) {
        linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: 0x3a414b, transparent: true, opacity: 0.35 })
  );
  g.add(lines);
  return g;
}

/* ───────────────────────── secure-element chip ─────────────────────────── */

/**
 * Ed25519 secure element — ceramic package, gold pads, die + bond detail.
 */
export function buildSecureChip(): THREE.Group {
  const g = new THREE.Group();

  const ceramic = new THREE.MeshStandardMaterial({ color: 0x24272c, metalness: 0.35, roughness: 0.55 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xb99f5e, metalness: 1.0, roughness: 0.32 });
  const dieMat = new THREE.MeshStandardMaterial({ color: 0x14161a, metalness: 0.85, roughness: 0.18 });

  // package body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 1.8), ceramic);
  g.add(body);

  // beveled top plate
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.06, 1.55), new THREE.MeshStandardMaterial({ color: 0x2e3238, metalness: 0.5, roughness: 0.4 }));
  top.position.y = 0.14;
  g.add(top);

  // silicon die (reflective) with a laser-etched key square
  const die = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.03, 0.72), dieMat);
  die.position.y = 0.19;
  g.add(die);
  const etch = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.005, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x9fb2c4, emissive: 0x3d4b58, emissiveIntensity: 1.4, roughness: 0.3 })
  );
  etch.position.y = 0.21;
  g.add(etch);

  // gold pins on all four sides
  for (let i = 0; i < 8; i++) {
    const off = -0.7 + i * 0.2;
    for (const [x, z, rot] of [
      [off, 0.98, 0],
      [off, -0.98, 0],
      [0.98, off, Math.PI / 2],
      [-0.98, off, Math.PI / 2],
    ] as const) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.18), gold);
      pin.position.set(x, -0.06, z);
      pin.rotation.y = rot;
      g.add(pin);
    }
  }

  // bond wires: thin arcs from die to package edge
  const wireMat = new THREE.MeshStandardMaterial({ color: 0xcfd6de, metalness: 1, roughness: 0.2 });
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const from = new THREE.Vector3(Math.cos(a) * 0.38, 0.2, Math.sin(a) * 0.38);
    const to = new THREE.Vector3(Math.cos(a) * 0.72, 0.16, Math.sin(a) * 0.72);
    const mid = from.clone().lerp(to, 0.5).setY(0.3);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.008, 6), wireMat);
    g.add(wire);
  }

  return g;
}

/* ──────────────────────── gyroscopic attestation core ───────────────────── */

/**
 * Three nested rotating rings around a glowing core — the "settlement engine".
 */
export function buildGyroCore(): THREE.Group {
  const g = new THREE.Group();

  const ringMat = new THREE.MeshStandardMaterial({ color: 0x3a4048, metalness: 0.85, roughness: 0.3 });
  const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x565d68, metalness: 0.8, roughness: 0.35 });

  const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.035, 12, 90), ringMat);
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.03, 12, 80), ringMat2);
  const r3 = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.025, 12, 70), ringMat);
  r1.name = "r1"; r2.name = "r2"; r3.name = "r3";
  g.add(r1, r2, r3);

  // orbit studs on the outer ring
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), ringMat2);
    stud.position.set(Math.cos(a) * 1.15, Math.sin(a) * 1.15, 0);
    r1.add(stud);
  }

  // core: icosahedron with glow
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.3, 1),
    new THREE.MeshStandardMaterial({
      color: 0xd7dde4,
      emissive: 0x8fa4b8,
      emissiveIntensity: 0.9,
      metalness: 0.4,
      roughness: 0.25,
      flatShading: true,
    })
  );
  core.name = "core";
  g.add(core);
  const glow = new THREE.PointLight(0xaebfd0, 1.4, 4);
  g.add(glow);

  return g;
}

/**
 * Per-frame animator for the gyro rings (call inside a render loop).
 */
export function animateGyro(g: THREE.Group, t: number) {
  const r1 = g.getObjectByName("r1")!;
  const r2 = g.getObjectByName("r2")!;
  const r3 = g.getObjectByName("r3")!;
  const core = g.getObjectByName("core")!;
  r1.rotation.x = t * 0.35;
  r1.rotation.y = t * 0.2;
  r2.rotation.x = -t * 0.5;
  r2.rotation.z = t * 0.3;
  r3.rotation.y = t * 0.65;
  r3.rotation.z = -t * 0.4;
  core.rotation.y = t * 0.5;
  core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.05);
}

/* ─────────────────────────────── viewer rig ────────────────────────────── */

export interface ViewerOpts {
  /** include the ambient particle field behind the device */
  field?: boolean;
  /** initial camera distance */
  distance?: number;
  /** device auto-rotation speed (rad/s) */
  spin?: number;
  /** vertical look-at offset */
  lookAtY?: number;
  /** couple device rotation to page scroll */
  scrollRotate?: boolean;
}

export function mountSensorViewer(canvas: HTMLCanvasElement, opts: ViewerOpts = {}): () => void {
  const { field = true, distance = 4.4, spin = 0.25, lookAtY = 0.1, scrollRotate = false } = opts;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0.6, 0.55, distance);
  camera.lookAt(0, lookAtY, 0);

  // studio lighting: key from upper-left, strong cold rim, soft fill
  scene.add(new THREE.AmbientLight(0x656d78, 1.1));
  const key = new THREE.DirectionalLight(0xeef2f6, 2.4);
  key.position.set(-2.5, 4, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb8c8d8, 3.0);
  rim.position.set(4, 2, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0x6a7480, 0.7);
  fill.position.set(0, -2, 2);
  scene.add(fill);

  const device = buildSensorDevice();
  device.position.y = 0.05;
  scene.add(device);

  if (field) scene.add(buildNetworkField());

  let mouseX = 0, mouseY = 0;
  const onMove = (e: MouseEvent) => {
    mouseX = (e.clientX / innerWidth - 0.5) * 2;
    mouseY = (e.clientY / innerHeight - 0.5) * 2;
  };
  addEventListener("mousemove", onMove);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (canvas.width !== w * devicePixelRatio || canvas.height !== h * devicePixelRatio) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  };

  let raf = 0;
  const t0 = performance.now();
  const frame = (t: number) => {
    resize();
    const scrollTurn = scrollRotate ? scrollY * 0.0022 : 0;
    device.rotation.y = t * spin + mouseX * 0.35 + scrollTurn;
    device.rotation.x = Math.sin(t * 0.4) * 0.04 + mouseY * 0.12;
    device.position.y = 0.05 + Math.sin(t * 0.8) * 0.03;
    renderer.render(scene, camera);
  };
  const loop = () => {
    raf = requestAnimationFrame(loop);
    frame((performance.now() - t0) / 1000);
  };
  // render an immediate first frame (rAF is throttled in background tabs)
  registerRender(() => frame((performance.now() - t0) / 1000));
  frame(0);
  loop();
  // debug/screenshot hook
  (window as any).__smRender = () => frame((performance.now() - t0) / 1000);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("mousemove", onMove);
    renderer.dispose();
  };
}

/* ──────────────────── SuperMesh logo (3D) ─────────────────── */

/**
 * 3D rendition of the SuperMesh logo mark: a hexagonal lattice of thin
 * struts with spherical nodes, one node glowing hot — matches the 2D mark.
 */
export function buildLogoMesh(): THREE.Group {
  const g = new THREE.Group();

  const strutMat = new THREE.MeshStandardMaterial({ color: 0x7d8794, metalness: 0.85, roughness: 0.35 });
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0xaeb7c2, metalness: 0.7, roughness: 0.3 });

  // hex-lattice vertices: center + 2 rings (axial coordinates)
  const pts: THREE.Vector3[] = [];
  const R = 1; // hex cell size
  for (let q = -2; q <= 2; q++) {
    for (let r = -2; r <= 2; r++) {
      if (Math.abs(q + r) > 2) continue; // hexagon boundary
      const x = R * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
      const y = R * 1.5 * r;
      pts.push(new THREE.Vector3(x * 0.62, y * 0.62, 0));
    }
  }

  // nodes
  const nodes: THREE.Mesh[] = [];
  for (const p of pts) {
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), nodeMat);
    n.position.copy(p);
    g.add(n);
    nodes.push(n);
  }

  // struts between neighbouring nodes
  const maxDist = R * Math.sqrt(3) * 0.62 * 1.05;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = pts[i].distanceTo(pts[j]);
      if (d < maxDist) {
        const mid = pts[i].clone().add(pts[j]).multiplyScalar(0.5);
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, d, 8), strutMat);
        strut.position.copy(mid);
        strut.lookAt(pts[j]);
        strut.rotateX(Math.PI / 2);
        g.add(strut);
      }
    }
  }

  // the glowing "identity" node — offset upper-right like the 2D mark
  const hot = nodes[nodes.length - 4] ?? nodes[0];
  hot.material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xdfe7ee,
    emissiveIntensity: 2.6,
    roughness: 0.15,
  });
  hot.scale.setScalar(1.5);
  const glow = new THREE.PointLight(0xd6e2ec, 1.6, 5);
  glow.position.copy(hot.position).z += 0.4;
  g.add(glow);
  g.userData.hot = hot;

  return g;
}

/* ───────────────────── generic model viewer ──────────────────── */

export type ModelKind = "sensor" | "chip" | "gyro" | "logo";

export interface ModelViewerOpts {
  distance?: number;
  spin?: number;
  lookAtY?: number;
  scrollRotate?: boolean;
  /** camera tilt-down angle in radians */
  tilt?: number;
}

/**
 * Mounts any of the procedural models on a canvas with the studio rig.
 */
export function mountModelViewer(
  canvas: HTMLCanvasElement,
  kind: ModelKind,
  opts: ModelViewerOpts = {}
): () => void {
  const { distance = 4, spin = 0.3, lookAtY = 0, scrollRotate = true, tilt = 0.35 } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0.4, Math.sin(tilt) * distance, Math.cos(tilt) * distance);
  camera.lookAt(0, lookAtY, 0);

  scene.add(new THREE.AmbientLight(0x656d78, 1.0));
  const key = new THREE.DirectionalLight(0xeef2f6, 2.2);
  key.position.set(-2.5, 4, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb8c8d8, 2.6);
  rim.position.set(4, 2, -3);
  scene.add(rim);

  const model =
    kind === "chip" ? buildSecureChip()
    : kind === "gyro" ? buildGyroCore()
    : kind === "logo" ? buildLogoMesh()
    : buildSensorDevice();
  scene.add(model);

  let mx = 0, my = 0;
  const onMove = (e: MouseEvent) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  };
  addEventListener("mousemove", onMove, { passive: true });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (canvas.width !== w * renderer.getPixelRatio()) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  };

  let raf = 0;
  const t0 = performance.now();
  const frame = () => {
    resize();
    const t = (performance.now() - t0) / 1000;
    const scrollTurn = scrollRotate ? scrollY * 0.0016 : 0;
    if (kind === "gyro") {
      animateGyro(model, t + scrollY * 0.004);
      model.rotation.y = mx * 0.25;
      model.rotation.x = my * 0.15;
    } else {
      model.rotation.y = t * spin + mx * 0.3 + scrollTurn;
      model.rotation.x = Math.sin(t * 0.35) * 0.05 + my * 0.1 + (kind === "chip" ? 0.12 : 0);
    }
    model.position.y = Math.sin(t * 0.8) * 0.035;
    renderer.render(scene, camera);
  };
  const loop = () => {
    raf = requestAnimationFrame(loop);
    frame();
  };
  registerRender(frame);
  frame();
  loop();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("mousemove", onMove);
    renderer.dispose();
  };
}

/* ─────────────────── full-page parallax particle field ─────────────────── */

/**
 * Fixed, full-viewport 3D field rendered behind the page. Three depth
 * layers of nodes + faint mesh links move at different rates against
 * scroll and cursor — true 3D parallax.
 */
export function mountParallaxField(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08090b, 0.028);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 0, 16);

  interface Layer {
    group: THREE.Group;
    depth: number; // parallax factor
  }
  const layers: Layer[] = [];

  const mkLayer = (count: number, z: number, size: number, opacity: number, links: boolean, depth: number) => {
    const group = new THREE.Group();
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 34,
          z + (Math.random() - 0.5) * 6
        )
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({ color: 0x9aa4b0, size, transparent: true, opacity, sizeAttenuation: true })
      )
    );
    if (links) {
      const linePos: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          if (pts[i].distanceTo(pts[j]) < 5.2) {
            linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
      group.add(
        new THREE.LineSegments(
          lineGeo,
          new THREE.LineBasicMaterial({ color: 0x2c333d, transparent: true, opacity: 0.28 })
        )
      );
    }
    scene.add(group);
    layers.push({ group, depth });
  };

  mkLayer(90, -14, 0.05, 0.28, false, 0.25); // far
  mkLayer(110, -6, 0.07, 0.45, true, 0.55); // mid, meshed
  mkLayer(50, 2, 0.1, 0.7, false, 1.0); // near

  // ── floating 3D wireframe shards at mixed depths ──
  interface Shard {
    mesh: THREE.Mesh | THREE.Group;
    depth: number;
    rx: number;
    ry: number;
    baseY: number;
  }
  const shards: Shard[] = [];
  const wire = (geo: THREE.BufferGeometry, opacity: number) =>
    new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: 0x4a5461, wireframe: true, transparent: true, opacity })
    );

  const shardDefs: Array<[THREE.BufferGeometry, number, number, number, number]> = [
    // geometry, x, y, z, scale
    [new THREE.IcosahedronGeometry(1, 0), -16, 5, -10, 1.4],
    [new THREE.OctahedronGeometry(1, 0), 15, -4, -8, 1.7],
    [new THREE.TetrahedronGeometry(1, 0), -11, -8, -5, 1.1],
    [new THREE.TorusGeometry(1, 0.28, 8, 20), 18, 7, -14, 1.5],
    [new THREE.IcosahedronGeometry(1, 1), 8, 10, -18, 2.2],
    [new THREE.BoxGeometry(1.2, 1.2, 1.2), -20, -2, -16, 1.3],
    [new THREE.TorusKnotGeometry(0.8, 0.22, 48, 8), 0, -12, -12, 1.2],
    [new THREE.DodecahedronGeometry(1, 0), 12, 1, -4, 0.8],
  ];
  for (const [geo, x, y, z, s] of shardDefs) {
    const m = wire(geo, z < -10 ? 0.16 : 0.3);
    m.position.set(x, y, z);
    m.scale.setScalar(s);
    scene.add(m);
    shards.push({
      mesh: m,
      depth: THREE.MathUtils.mapLinear(z, -18, -4, 0.3, 1.1),
      rx: 0.05 + Math.random() * 0.12,
      ry: 0.06 + Math.random() * 0.15,
      baseY: y,
    });
  }

  // one solid mini-gyro drifting far back for depth interest
  const bgGyro = buildGyroCore();
  bgGyro.scale.setScalar(2.4);
  bgGyro.position.set(-7, 12, -20);
  scene.add(bgGyro);

  // ── giant 3D logo mark, monumental and slow, deep in the scene ──
  const logoLight = new THREE.DirectionalLight(0xdde5ec, 1.6);
  logoLight.position.set(-4, 6, 8);
  scene.add(logoLight, new THREE.AmbientLight(0x4c545e, 0.7));
  const bgLogo = buildLogoMesh();
  bgLogo.scale.setScalar(3.2);
  bgLogo.position.set(9, -2, -13);
  scene.add(bgLogo);
  // a second, farther fainter one on the left for depth
  const bgLogo2 = buildLogoMesh();
  bgLogo2.scale.setScalar(1.8);
  bgLogo2.position.set(-14, 4, -17);
  bgLogo2.rotation.z = 0.5;
  scene.add(bgLogo2);

  // occasional "attestation pulse": one node flashes
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xe8edf2, transparent: true, opacity: 0 })
  );
  scene.add(pulse);
  let pulseT = 0;

  let mx = 0,
    my = 0;
  const onMove = (e: MouseEvent) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  };
  addEventListener("mousemove", onMove, { passive: true });

  const resize = () => {
    const w = innerWidth,
      h = innerHeight;
    if (canvas.width !== w * renderer.getPixelRatio()) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  };

  let raf = 0;
  const t0 = performance.now();
  const renderOnce = () => {
    resize();
    renderer.render(scene, camera);
  };
  registerRender(renderOnce);
  const loop = () => {
    raf = requestAnimationFrame(loop);
    resize();
    const t = (performance.now() - t0) / 1000;
    const s = scrollY;

    for (const { group, depth } of layers) {
      group.rotation.y = t * 0.008 * depth + mx * 0.06 * depth;
      group.position.y = s * 0.0035 * depth; // scroll parallax — layers drift apart
      group.position.x = -mx * 0.9 * depth;
    }
    camera.position.y = -my * 0.4;

    // shards: tumble slowly, ride their own parallax depth
    for (const sh of shards) {
      sh.mesh.rotation.x += sh.rx / 60;
      sh.mesh.rotation.y += sh.ry / 60;
      sh.mesh.position.y = sh.baseY + s * 0.005 * sh.depth + Math.sin(t * 0.5 + sh.baseY) * 0.4;
    }
    // background gyro: slow drift + scroll parallax
    animateGyro(bgGyro, t * 0.4);
    bgGyro.position.y = 12 + s * 0.006;
    bgGyro.position.x = -7 - mx * 1.2;

    // monumental logos: slow tumble, deep parallax, pulsing identity node
    bgLogo.rotation.y = t * 0.06 + mx * 0.1;
    bgLogo.rotation.x = Math.sin(t * 0.15) * 0.12 + my * 0.06;
    bgLogo.position.y = -2 + s * 0.0045;
    bgLogo.position.x = 9 - mx * 1.6;
    bgLogo2.rotation.y = -t * 0.04 + mx * 0.05;
    bgLogo2.position.y = 4 + s * 0.0028;
    bgLogo2.position.x = -14 - mx * 0.8;
    const hot = bgLogo.userData.hot as THREE.Mesh | undefined;
    if (hot) {
      const m = hot.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2 + Math.sin(t * 2.4) * 1.1;
    }

    // pulse cycle every ~4s
    pulseT += 1 / 60;
    if (pulseT > 4) {
      pulseT = 0;
      pulse.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10 - 4);
    }
    const p = Math.max(0, 1 - pulseT / 0.9);
    (pulse.material as THREE.MeshBasicMaterial).opacity = p * 0.9;
    pulse.scale.setScalar(1 + (1 - p) * 3);

    renderer.render(scene, camera);
  };
  loop();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("mousemove", onMove);
    renderer.dispose();
  };
}

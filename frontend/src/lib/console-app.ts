/**
 * SuperMesh Console — browser dashboard for the on-chain program.
 *
 * Uses a locally-stored burner keypair against a configurable RPC
 * (localnet by default), so the whole lifecycle can be driven from the UI:
 * init network → register device → submit readings → challenge/resolve →
 * finalize → claim.
 */
import { Buffer } from "buffer";
(globalThis as any).Buffer = Buffer; // web3.js/anchor expect a Node Buffer global

import * as anchor from "@anchor-lang/core";
import { BN, Program, web3 } from "@anchor-lang/core";
import idl from "./supermesh.idl.json";
import { mountSensorViewer } from "./sensor3d";

type Supermesh = any;

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const LAMPORTS = web3.LAMPORTS_PER_SOL;

/* ─────────────────────────── wallet & provider ─────────────────────────── */

function burner(): web3.Keypair {
  const saved = localStorage.getItem("supermesh:burner");
  if (saved) return web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(saved)));
  const kp = web3.Keypair.generate();
  localStorage.setItem("supermesh:burner", JSON.stringify([...kp.secretKey]));
  return kp;
}

function deviceKey(): web3.Keypair {
  const saved = localStorage.getItem("supermesh:device");
  if (saved) return web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(saved)));
  const kp = web3.Keypair.generate();
  localStorage.setItem("supermesh:device", JSON.stringify([...kp.secretKey]));
  return kp;
}

// initialized in initConsole() (browser only)
let wallet: web3.Keypair;
let hardwareKey: web3.Keypair;

let connection: web3.Connection;
let program: Program<Supermesh>;

function connect(rpc: string) {
  connection = new web3.Connection(rpc, "confirmed");
  const signOne = (tx: any) => {
    if ("version" in tx) tx.sign([wallet]); // VersionedTransaction
    else tx.partialSign(wallet); // legacy Transaction
    return tx;
  };
  const anchorWallet = {
    publicKey: wallet.publicKey,
    signTransaction: async (tx: any) => signOne(tx),
    signAllTransactions: async (txs: any[]) => txs.map(signOne),
  };
  const provider = new anchor.AnchorProvider(connection, anchorWallet as any, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  program = new Program(idl as any, provider);
}

/* ────────────────────────────────── pdas ───────────────────────────────── */

const enc = new TextEncoder();
const pdas = (name: string) => {
  const pid = new web3.PublicKey((idl as any).address);
  const [network] = web3.PublicKey.findProgramAddressSync(
    [enc.encode("network"), enc.encode(name)],
    pid
  );
  const [treasury] = web3.PublicKey.findProgramAddressSync(
    [enc.encode("treasury"), network.toBytes()],
    pid
  );
  const [device] = web3.PublicKey.findProgramAddressSync(
    [enc.encode("device"), network.toBytes(), hardwareKey.publicKey.toBytes()],
    pid
  );
  return { pid, network, treasury, device };
};

const readingPda = (device: web3.PublicKey, index: number) => {
  const buf = new Uint8Array(8);
  new DataView(buf.buffer).setBigUint64(0, BigInt(index), true);
  return web3.PublicKey.findProgramAddressSync(
    [enc.encode("reading"), device.toBytes(), buf],
    new web3.PublicKey((idl as any).address)
  )[0];
};

/* ─────────────────────────────── ui helpers ────────────────────────────── */

const logEl = $("log");
function log(msg: string, cls = "") {
  const line = document.createElement("div");
  line.className = `log-line ${cls}`;
  const ts = new Date().toLocaleTimeString("en-GB");
  line.innerHTML = `<span class="log-ts">${ts}</span>${msg}`;
  logEl.prepend(line);
}

function short(k: web3.PublicKey | string) {
  const s = k.toString();
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

async function guard<T>(label: string, fn: () => Promise<T>): Promise<T | undefined> {
  try {
    const r = await fn();
    log(`${label} <span class="ok">ok</span>`);
    return r;
  } catch (e: any) {
    const m = e?.error?.errorMessage ?? e?.message ?? String(e);
    log(`${label} <span class="err">failed</span> — ${m}`, "err-line");
    return undefined;
  }
}

/* ─────────────────────────────── refreshers ────────────────────────────── */

function netName() {
  return ($("net-name") as HTMLInputElement).value.trim() || "pm25-demo";
}

async function refresh() {
  const { network, treasury, device } = pdas(netName());

  // wallet
  const bal = await connection.getBalance(wallet.publicKey).catch(() => 0);
  $("wallet-addr").textContent = short(wallet.publicKey);
  $("wallet-bal").textContent = (bal / LAMPORTS).toFixed(3) + " SOL";
  $("hw-addr").textContent = short(hardwareKey.publicKey);

  // network
  try {
    const n: any = await (program.account as any).network.fetch(network);
    $("net-status").textContent = n.paused ? "PAUSED" : "ACTIVE";
    $("net-status").className = "chip " + (n.paused ? "chip-err" : "chip-ok");
    $("net-devices").textContent = n.deviceCount.toString();
    $("net-finalized").textContent = n.totalFinalizedReadings.toString();
    $("net-stake").textContent = (n.minStake.toNumber() / LAMPORTS).toFixed(2) + " SOL";
    $("net-reward").textContent = (n.rewardPerReading.toNumber() / LAMPORTS).toFixed(4) + " SOL";
    const tb = await connection.getBalance(treasury).catch(() => 0);
    $("net-treasury").textContent = (tb / LAMPORTS).toFixed(3) + " SOL";
    ($("btn-init-net") as HTMLButtonElement).disabled = true;
  } catch {
    $("net-status").textContent = "NOT FOUND";
    $("net-status").className = "chip";
    ["net-devices", "net-finalized", "net-stake", "net-reward", "net-treasury"].forEach(
      (id) => ($(id).textContent = "—")
    );
    ($("btn-init-net") as HTMLButtonElement).disabled = false;
  }

  // device
  let dev: any = null;
  try {
    dev = await (program.account as any).device.fetch(device);
    $("dev-status").textContent = dev.active ? "ACTIVE" : "SUSPENDED";
    $("dev-status").className = "chip " + (dev.active ? "chip-ok" : "chip-err");
    $("dev-stake").textContent = (dev.staked.toNumber() / LAMPORTS).toFixed(3) + " SOL";
    $("dev-rewards").textContent = (dev.pendingRewards.toNumber() / LAMPORTS).toFixed(4) + " SOL";
    $("dev-rep").textContent = dev.reputation.toString();
    $("dev-readings").textContent = dev.readingCount.toString();
    ($("btn-register") as HTMLButtonElement).disabled = true;
  } catch {
    $("dev-status").textContent = "NOT REGISTERED";
    $("dev-status").className = "chip";
    ["dev-stake", "dev-rewards", "dev-rep", "dev-readings"].forEach(
      (id) => ($(id).textContent = "—")
    );
    ($("btn-register") as HTMLButtonElement).disabled = false;
  }

  // readings table
  const tbody = $("readings-body");
  tbody.innerHTML = "";
  if (dev) {
    const count = dev.readingCount.toNumber();
    const slot = await connection.getSlot().catch(() => 0);
    const netAcc: any = await (program.account as any).network.fetch(network).catch(() => null);
    const windowSlots = netAcc ? netAcc.challengeWindowSlots.toNumber() : 0;

    for (let i = Math.max(0, count - 8); i < count; i++) {
      const pda = readingPda(device, i);
      const r: any = await (program.account as any).reading.fetch(pda).catch(() => null);
      if (!r) continue;
      const status = Object.keys(r.status)[0];
      const windowLeft = Math.max(0, r.submittedSlot.toNumber() + windowSlots - slot);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="mono">#${i}</td>
        <td class="mono">${(r.value.toNumber() / 100).toFixed(2)}</td>
        <td><span class="chip chip-${status}">${status}</span></td>
        <td class="mono">${status === "pending" ? windowLeft + " slots" : "—"}</td>
        <td class="row-actions"></td>`;
      const actions = tr.querySelector(".row-actions")!;
      if (status === "pending") {
        actions.append(
          btn("finalize", () => act.finalize(i)),
          btn("challenge", () => act.challenge(i), "danger")
        );
      } else if (status === "challenged") {
        actions.append(
          btn("resolve: fraud", () => act.resolve(i, true), "danger"),
          btn("resolve: honest", () => act.resolve(i, false))
        );
      }
      tbody.append(tr);
    }
  }
}

function btn(label: string, onClick: () => void, kind = "") {
  const b = document.createElement("button");
  b.className = `mini ${kind}`;
  b.textContent = label;
  b.onclick = onClick;
  return b;
}

/* ─────────────────────────────── actions ───────────────────────────────── */

const act = {
  async airdrop() {
    await guard("airdrop 5 SOL", async () => {
      const sig = await connection.requestAirdrop(wallet.publicKey, 5 * LAMPORTS);
      await connection.confirmTransaction(sig);
    });
    refresh();
  },

  async initNetwork() {
    const { network, treasury } = pdas(netName());
    await guard(`init network '${netName()}'`, () =>
      program.methods
        .initNetwork(netName(), new BN(1 * LAMPORTS), new BN(0.01 * LAMPORTS), new BN(0.1 * LAMPORTS), new BN(60))
        .accountsPartial({ authority: wallet.publicKey, network, treasury })
        .rpc()
    );
    // seed the treasury with a reward budget
    await guard("fund treasury 2 SOL", async () => {
      const tx = new web3.Transaction().add(
        web3.SystemProgram.transfer({ fromPubkey: wallet.publicKey, toPubkey: treasury, lamports: 2 * LAMPORTS })
      );
      await web3.sendAndConfirmTransaction(connection, tx, [wallet]);
    });
    refresh();
  },

  async register() {
    const { network, treasury, device } = pdas(netName());
    await guard("register device (stake 1 SOL)", () =>
      program.methods
        .registerDevice(new BN(1 * LAMPORTS), "tdr1wxype")
        .accountsPartial({
          owner: wallet.publicKey,
          deviceSigner: hardwareKey.publicKey,
          network,
          device,
          treasury,
        })
        .signers([hardwareKey])
        .rpc()
    );
    refresh();
  },

  async submit() {
    const { network, device } = pdas(netName());
    const dev: any = await (program.account as any).device.fetch(device).catch(() => null);
    if (!dev) {
      log(`submit reading <span class="err">blocked</span> — register the device first`, "err-line");
      return;
    }
    const idx = dev.readingCount.toNumber();
    const value = Math.round(parseFloat(($("reading-value") as HTMLInputElement).value || "42.35") * 100);
    const payload = crypto.getRandomValues(new Uint8Array(32));
    await guard(`submit reading #${idx} (${(value / 100).toFixed(2)} µg/m³)`, () =>
      program.methods
        .submitReading([...payload], new BN(value), new BN(Math.floor(Date.now() / 1000)))
        .accountsPartial({
          owner: wallet.publicKey,
          deviceSigner: hardwareKey.publicKey,
          network,
          device,
          reading: readingPda(device, idx),
        })
        .signers([hardwareKey])
        .rpc()
    );
    refresh();
  },

  async finalize(i: number) {
    const { network, device } = pdas(netName());
    await guard(`finalize reading #${i}`, () =>
      program.methods
        .finalizeReading()
        .accountsPartial({ cranker: wallet.publicKey, network, device, reading: readingPda(device, i) })
        .rpc()
    );
    refresh();
  },

  async challenge(i: number) {
    const { network, treasury, device } = pdas(netName());
    // burner can't self-challenge; use an ephemeral funded challenger
    const challenger = web3.Keypair.generate();
    await guard(`challenge reading #${i} (bond 0.1 SOL)`, async () => {
      const sig = await connection.requestAirdrop(challenger.publicKey, LAMPORTS);
      await connection.confirmTransaction(sig);
      localStorage.setItem(`supermesh:challenger:${i}`, JSON.stringify([...challenger.secretKey]));
      await program.methods
        .challengeReading()
        .accountsPartial({
          challenger: challenger.publicKey,
          network,
          device,
          reading: readingPda(device, i),
          treasury,
        })
        .signers([challenger])
        .rpc();
    });
    refresh();
  },

  async resolve(i: number, fraud: boolean) {
    const { network, treasury, device } = pdas(netName());
    const saved = localStorage.getItem(`supermesh:challenger:${i}`);
    const reading = saved
      ? null
      : await (program.account as any).reading.fetch(readingPda(device, i)).catch(() => null);
    const challengerPk = saved
      ? web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(saved))).publicKey
      : reading?.challenger;
    if (!challengerPk) {
      log(`resolve #${i} <span class="err">blocked</span> — reading or challenger not found`, "err-line");
      return;
    }
    await guard(`resolve #${i} → ${fraud ? "FRAUD (slash 20%)" : "honest"}`, () =>
      program.methods
        .resolveChallenge(fraud)
        .accountsPartial({
          authority: wallet.publicKey,
          network,
          device,
          reading: readingPda(device, i),
          challenger: challengerPk,
          treasury,
        })
        .rpc()
    );
    refresh();
  },

  async claim() {
    const { network, treasury, device } = pdas(netName());
    await guard("claim rewards", () =>
      program.methods
        .claimRewards()
        .accountsPartial({ owner: wallet.publicKey, network, device, treasury })
        .rpc()
    );
    refresh();
  },
};

/* ─────────────────────────────── bootstrap ─────────────────────────────── */

/** Mounts the console onto the already-rendered DOM. Returns cleanup. */
export function initConsole(): () => void {
  wallet = burner();
  hardwareKey = deviceKey();

  const rpcInput = $("rpc") as HTMLInputElement;
  connect(rpcInput.value);
  rpcInput.addEventListener("change", () => {
    connect(rpcInput.value);
    log(`connected to <span class="mono">${rpcInput.value}</span>`);
    refresh();
  });

  $("btn-airdrop").onclick = act.airdrop;
  $("btn-init-net").onclick = act.initNetwork;
  $("btn-register").onclick = act.register;
  $("btn-submit").onclick = act.submit;
  $("btn-claim").onclick = act.claim;
  $("btn-refresh").onclick = () => refresh();
  $("net-name").addEventListener("change", () => refresh());

  const canvas = $("dash-3d") as unknown as HTMLCanvasElement;
  const disposeViewer = canvas
    ? mountSensorViewer(canvas, { field: false, distance: 6.2, spin: 0.3, lookAtY: 0.35 })
    : () => {};

  log(`console ready — wallet <span class="mono">${short(wallet.publicKey)}</span>, hardware key <span class="mono">${short(hardwareKey.publicKey)}</span>`);
  refresh();
  const iv = setInterval(refresh, 12_000);

  return () => {
    clearInterval(iv);
    disposeViewer();
  };
}

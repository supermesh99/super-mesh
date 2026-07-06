/**
 * SuperMesh end-to-end demo against a local validator.
 *
 * Simulates the full DePIN lifecycle:
 *   1. Initialize a PM2.5 air-quality network
 *   2. Register a simulated sensor device (hardware key + owner stake)
 *   3. Stream signed readings on-chain
 *   4. Challenge a suspicious reading, resolve it (fraud proven -> slash)
 *   5. Finalize honest readings and claim rewards
 *
 * Run:  anchor localnet   (in one terminal)
 *       npm run demo      (in another)
 */
import * as anchor from "@anchor-lang/core";
import { Program, web3, BN } from "@anchor-lang/core";
import { createHash, randomBytes } from "crypto";
import { Supermesh } from "../target/types/supermesh";

const NETWORK_NAME = `pm25-${randomBytes(4).toString("hex")}`;
const LAMPORTS = web3.LAMPORTS_PER_SOL;

const MIN_STAKE = new BN(1 * LAMPORTS);
const REWARD_PER_READING = new BN(0.01 * LAMPORTS);
const CHALLENGE_BOND = new BN(0.1 * LAMPORTS);
const CHALLENGE_WINDOW_SLOTS = new BN(20);

function sha256(payload: object): number[] {
  return [...createHash("sha256").update(JSON.stringify(payload)).digest()];
}

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Supermesh as Program<Supermesh>;
  const authority = provider.wallet.publicKey;

  const [network] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("network"), Buffer.from(NETWORK_NAME)],
    program.programId
  );
  const [treasury] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), network.toBuffer()],
    program.programId
  );

  // ── 1. Initialize the network ────────────────────────────────────────────
  await program.methods
    .initNetwork(
      NETWORK_NAME,
      MIN_STAKE,
      REWARD_PER_READING,
      CHALLENGE_BOND,
      CHALLENGE_WINDOW_SLOTS
    )
    .accountsPartial({ authority, network, treasury })
    .rpc();
  console.log(`✅ network '${NETWORK_NAME}' initialized: ${network.toBase58()}`);

  // Fund the treasury with a reward budget.
  await provider.sendAndConfirm(
    new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: authority,
        toPubkey: treasury,
        lamports: 2 * LAMPORTS,
      })
    )
  );
  console.log("✅ treasury funded with 2 SOL reward budget");

  // ── 2. Register a simulated device ───────────────────────────────────────
  // In production this keypair lives in the sensor's secure element.
  const deviceSigner = web3.Keypair.generate();
  const [device] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("device"), network.toBuffer(), deviceSigner.publicKey.toBuffer()],
    program.programId
  );

  await program.methods
    .registerDevice(MIN_STAKE, "tdr1wxype") // geohash: Bengaluru
    .accountsPartial({
      owner: authority,
      deviceSigner: deviceSigner.publicKey,
      network,
      device,
      treasury,
    })
    .signers([deviceSigner])
    .rpc();
  console.log(`✅ device registered (hardware key ${deviceSigner.publicKey.toBase58().slice(0, 8)}…), 1 SOL staked`);

  // ── 3. Stream readings ───────────────────────────────────────────────────
  const submitReading = async (index: number, valueScaled: number) => {
    const payload = {
      sensor: "sds011",
      pm25: valueScaled / 100,
      ts: Date.now(),
      nonce: randomBytes(8).toString("hex"),
    };
    const [reading] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("reading"),
        device.toBuffer(),
        new BN(index).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    await program.methods
      .submitReading(sha256(payload), new BN(valueScaled), new BN(Math.floor(Date.now() / 1000)))
      .accountsPartial({
        owner: authority,
        deviceSigner: deviceSigner.publicKey,
        network,
        device,
        reading,
      })
      .signers([deviceSigner])
      .rpc();
    return reading;
  };

  const waitSlots = async (n: number) => {
    const start = await provider.connection.getSlot();
    while ((await provider.connection.getSlot()) < start + n) {
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  const honest = await submitReading(0, 4235); // 42.35 µg/m³
  console.log(`✅ reading #0 submitted (42.35 µg/m³): ${honest.toBase58()}`);

  await waitSlots(21); // respect the on-chain rate limit

  const suspicious = await submitReading(1, 99900); // 999 µg/m³ — clearly bogus
  console.log(`✅ reading #1 submitted (999.00 µg/m³ — suspicious!)`);

  // ── 4. Challenge the bogus reading ───────────────────────────────────────
  const challenger = web3.Keypair.generate();
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(challenger.publicKey, 1 * LAMPORTS)
  );

  await program.methods
    .challengeReading()
    .accountsPartial({
      challenger: challenger.publicKey,
      network,
      device,
      reading: suspicious,
      treasury,
    })
    .signers([challenger])
    .rpc();
  console.log("⚔️  reading #1 challenged (0.1 SOL bonded)");

  await program.methods
    .resolveChallenge(true) // fraud proven
    .accountsPartial({
      authority,
      network,
      device,
      reading: suspicious,
      challenger: challenger.publicKey,
      treasury,
    })
    .rpc();

  const deviceState = await program.account.device.fetch(device);
  console.log(
    `🔨 fraud proven → device slashed 20%. stake=${deviceState.staked.toNumber() / LAMPORTS} SOL, reputation=${deviceState.reputation}`
  );

  // ── 5. Finalize the honest reading & claim rewards ───────────────────────
  await waitSlots(CHALLENGE_WINDOW_SLOTS.toNumber() + 1);

  await program.methods
    .finalizeReading()
    .accountsPartial({ cranker: authority, network, device, reading: honest })
    .rpc();
  console.log("✅ reading #0 finalized — reward accrued");

  await program.methods
    .claimRewards()
    .accountsPartial({ owner: authority, network, device, treasury })
    .rpc();

  const finalDevice = await program.account.device.fetch(device);
  const net = await program.account.network.fetch(network);
  console.log(
    `💰 rewards claimed. finalized readings network-wide: ${net.totalFinalizedReadings.toNumber()}, device reputation: ${finalDevice.reputation}`
  );
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

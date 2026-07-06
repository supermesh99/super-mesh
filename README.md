<p align="center"><img src="frontend/public/assets/logo-mark.png" alt="SuperMesh" width="110" /></p>

<h1 align="center">SuperMesh</h1>

<p align="center"><b>Verifiable physical-data infrastructure on Solana.</b><br/>
A DePIN sensor oracle where hardware-signed readings are secured by stake, slashing and optimistic dispute games.</p>

<p align="center">
  <img alt="Anchor" src="https://img.shields.io/badge/Anchor-1.0-19f0d8?style=flat-square&logo=rust&logoColor=white&labelColor=0a0f0e"/>
  <img alt="Tests" src="https://img.shields.io/badge/LiteSVM_tests-10%2F10-19f0d8?style=flat-square&labelColor=0a0f0e"/>
  <img alt="Solana" src="https://img.shields.io/badge/Solana-program-19f0d8?style=flat-square&logo=solana&logoColor=white&labelColor=0a0f0e"/>
  <img alt="License" src="https://img.shields.io/badge/license-ISC-555?style=flat-square&labelColor=0a0f0e"/>
</p>

![SuperMesh network](docs/img/readme-hero.png)

---

## The real-world problem

Environmental data — air quality, noise, weather, radiation — is **sparse, siloed, and easy to falsify**:

- Government monitoring stations are kilometres apart; pollution varies street by street.
- Insurers, researchers and city planners pay for data they cannot independently verify.
- Centralized sensor networks have a single operator who can fabricate or censor readings.

## The solution

SuperMesh lets **anyone deploy a cheap physical sensor, stake SOL as slashable collateral, and get paid per verified reading**. Data consumers get dense, tamper-evident coverage; honest operators earn yield on hardware; liars lose their stake.

## System architecture

```mermaid
flowchart LR
    subgraph EDGE["🛰 Physical edge"]
        S["PM2.5 / noise / weather<br/>sensor module"]
        SE["Secure element<br/>(Ed25519 keypair,<br/>non-extractable)"]
        S -->|raw measurement| SE
    end

    subgraph OFFCHAIN["Off-chain data plane"]
        IPFS[("IPFS / Arweave<br/>raw payload")]
        IDX["Indexers /<br/>data consumers"]
    end

    subgraph CHAIN["⛓ Solana — SuperMesh program"]
        direction TB
        N["Network PDA<br/><i>economic params, authority</i>"]
        T["Treasury PDA<br/><i>stakes + bonds escrow</i>"]
        D["Device PDA<br/><i>stake, reputation, nonce</i>"]
        R["Reading PDA<br/><i>SHA-256, value, status</i>"]
        N --- T
        N --- D
        D --- R
    end

    W["Watchtower<br/>challengers"]
    A["Authority /<br/>v2: juror committee"]

    SE -->|"sign(payload_hash ‖ value ‖ nonce)"| R
    SE -.->|raw payload| IPFS
    IPFS -.->|content hash pinned on-chain| R
    W -->|"challenge + bond"| R
    A -->|resolve| R
    R -->|finalized stream| IDX
    T <-->|"slash / reward flows"| D
```

Every reading is **dual-signed**: the operator wallet pays fees while the device's secure element co-signs the payload hash — so data is attributable to a *specific physical object*, not just a wallet.

## Hardware: the SM-01 sensor node

![SM-01 exploded view](docs/img/sensor-exploded.jpg)

| Layer | Component | Role in the protocol |
|---|---|---|
| 1 | Perforated housing | Passive airflow to the particulate chamber |
| 2 | PM2.5 optical sensor | Laser-scatter particle counting (µg/m³, scaled ×100 on-chain) |
| 3 | MCU + **secure element** | Ed25519 key generated in-silicon; signs every reading; key never leaves the die |
| 4 | LoRa/WiFi radio | Transports signed payloads to the RPC relay |
| 5 | Li-ion cell | ~14 months at one reading / 5 min |

The secure element's pubkey **is** the device identity: `Device` PDA = `["device", network, device_signer]`.

## Reading lifecycle — on-chain state machine

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Pending : submit_reading<br/>(device co-signs, ≥20 slots since last)

    Pending --> Finalized : finalize_reading<br/>(window expired, permissionless crank)
    Pending --> Challenged : challenge_reading<br/>(0.1 SOL bond, within window)

    Challenged --> Slashed : resolve_challenge(fraud)<br/>20% device stake → challenger<br/>reputation −25
    Challenged --> Finalized : resolve_challenge(honest)<br/>challenger bond → device

    Finalized --> [*] : reward accrued →<br/>claim_rewards
    Slashed --> [*]

    note right of Pending
        Optimistic acceptance —
        honest path costs one tx
    end note
    note right of Slashed
        reputation ≤ 0
        ⇒ device suspended
    end note
```

### Full protocol sequence

```mermaid
sequenceDiagram
    autonumber
    participant O as Device Owner
    participant D as Sensor (secure element)
    participant P as SuperMesh Program
    participant T as Treasury PDA
    participant C as Challenger
    participant A as Authority

    O->>P: register_device(stake 1 SOL)
    Note over O,P: device key co-signs registration
    P->>T: escrow stake
    D->>P: submit_reading(sha256, value, sig)
    Note over P: status = Pending<br/>challenge window opens (N slots)

    alt honest reading (common path)
        P->>P: finalize_reading — permissionless crank
        P->>O: reward accrual per finalized reading
        O->>P: claim_rewards
        T->>O: transfer accrued SOL
    else disputed reading
        C->>P: challenge_reading(bond 0.1 SOL)
        C->>T: escrow bond
        A->>P: resolve_challenge(verdict)
        alt fraud proven
            T->>C: bond refund + 20% of device stake
            P->>P: reputation −25, suspend if ≤ 0
        else fraud not proven
            T->>O: challenger bond forfeited to device
        end
    end
```

## Crypto-economic security model

```mermaid
flowchart TB
    subgraph HONEST["Honest operator — expected value"]
        H1["stake 1 SOL"] --> H2["submit readings<br/>(~1 tx fee each)"]
        H2 --> H3["rewards per finalized reading"]
        H3 --> H4["+ forfeited bonds from<br/>failed challenges"]
    end

    subgraph ADVERSARY["Fabricating operator — expected value"]
        F1["stake 1 SOL"] --> F2["submit fake reading"]
        F2 --> F3{"challenged within<br/>window?"}
        F3 -- "p ≈ 1 with watchtowers" --> F4["−20% stake slashed<br/>reputation −25"]
        F3 -- miss --> F5["reading reward"]
        F4 --> F6["reputation ≤ 0<br/>⇒ permanent suspension<br/>⇒ future yield = 0"]
    end

    subgraph GRIEFER["Malicious challenger"]
        G1["bond 0.1 SOL"] --> G2["challenge honest reading"]
        G2 --> G3["bond forfeited<br/>→ paid to device"]
    end
```

The protocol is incentive-compatible when
`E[slash] = p_challenge × 0.20 × stake > E[fraud_reward]` — with public data and permissionless challengers, `p_challenge → 1`, so fabrication is strictly dominated.

| Mechanism | Purpose |
|---|---|
| **Hardware-key co-signing** | Readings attributable to a physical secure element, not just a wallet |
| **Stake & slash (20%)** | Expected slashing loss exceeds fabricated-reading reward |
| **Optimistic challenge window** | Honest path = 1 cheap tx; disputes are the rare expensive path |
| **Challenger bonds** | Griefing honest devices pays the *device* |
| **Reputation score** | Repeated fraud ⇒ permanent suspension at ≤ 0 |
| **Rate limiting** | ≥ 20 slots between readings blocks reward-farming spam |
| **Exit lock** | Stake locked while any reading is under challenge |
| **Off-chain payload, on-chain hash** | Raw data on IPFS/Arweave; only SHA-256 + scaled value on-chain |

## Settlement & data flow

![Settlement engine](docs/img/settlement-abstract.png)

Raw sensor payloads stream off-chain; the program settles only *commitments* — a SHA-256 hash plus a scaled integer value — keeping per-reading cost to a few thousand lamports while preserving full auditability.

## Program architecture

```
programs/supermesh/src/
├── lib.rs                      # program entrypoints + docs
├── constants.rs                # seeds & economic parameters
├── error.rs                    # typed errors
├── state.rs                    # Network, Treasury, Device, Reading accounts
└── instructions/
    ├── init_network.rs         # create network + treasury PDA
    ├── register_device.rs      # stake + hardware-key registration
    ├── submit_reading.rs       # optimistic reading submission
    ├── challenge_reading.rs    # bonded dispute
    ├── resolve_challenge.rs    # slash or bond forfeiture
    ├── finalize_reading.rs     # permissionless reward crank
    ├── claim_rewards.rs        # withdraw accrued rewards
    ├── deactivate_device.rs    # exit with stake (challenge-locked)
    └── set_pause.rs            # emergency circuit breaker
```

### Account graph & PDA derivation

```mermaid
erDiagram
    NETWORK ||--|| TREASURY : "owns escrow"
    NETWORK ||--o{ DEVICE : "registers"
    DEVICE ||--o{ READING : "submits"

    NETWORK {
        pubkey authority
        string name PK "seed: [network, name]"
        u64 min_stake
        u64 reward_per_reading
        u64 challenge_window_slots
        bool paused
    }
    TREASURY {
        pubkey network PK "seed: [treasury, network]"
        u64 escrow_lamports "stakes + bonds"
    }
    DEVICE {
        pubkey device_signer PK "seed: [device, network, signer]"
        pubkey owner
        u64 stake
        i16 reputation "starts 100, fraud minus 25"
        u64 reading_count "monotonic nonce"
        u64 last_reading_slot "rate limit"
        u64 pending_rewards
        bool active
    }
    READING {
        u64 index PK "seed: [reading, device, index_le]"
        bytes32 payload_sha256
        i64 scaled_value "ug_per_m3 x100"
        u64 submitted_slot
        string status "Pending|Challenged|Finalized|Slashed"
        pubkey challenger "bond escrow ref"
    }
```

## Getting started

Prerequisites: Rust, Solana CLI ≥ 3.x, Anchor ≥ 1.0, Node ≥ 18.

```bash
# build the on-chain program
anchor build

# run the full LiteSVM test suite (10 lifecycle tests, no validator needed)
cargo test

# run the interactive demo against a local validator
anchor localnet          # terminal 1
npm run demo             # terminal 2 (ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 ANCHOR_WALLET=~/.config/solana/id.json)
```

The demo simulates a PM2.5 air-quality sensor in Bengaluru: it registers a device, streams an honest reading, submits a bogus 999 µg/m³ reading, challenges and slashes it, then finalizes the honest reading and claims rewards.

## Web: one Next.js app (`frontend/`)

A single Next.js app serves everything — deploy the `frontend/` folder to Vercel as-is.

| Route | Page |
|---|---|
| `/` | Landing — 3D parallax scenes (SM-01 node, secure element, settlement gyro, 3D logo lattice), AI-generated photography |
| `/console` | **SuperMesh Console** — full protocol lifecycle dashboard (init → register → submit → challenge → resolve → finalize → claim) against any RPC with a burner wallet |

```bash
npm run web                    # dev server (proxies to frontend/)
cd frontend && npm run build   # production build (all routes static-prerendered)
```

Deploy to Vercel: set the project root to `frontend/` — no env vars needed. Brand assets live in `frontend/public/assets/`; README art in `docs/img/` (regenerate via `node scripts/gen-readme.mjs`).

## Test coverage

`programs/supermesh/tests/test_supermesh.rs` (LiteSVM, in-process SVM):

- network init + device registration
- submit → finalize → reward accrual
- rate limiting between readings
- fraud challenge → 20% slash + challenger payout
- failed challenge → bond forfeited to device
- self-challenge rejection
- challenge-window expiry enforcement
- reward claiming
- deactivation blocked during open challenges, stake returned after
- network pause circuit breaker

## Roadmap (deep-tech upgrade path)

```mermaid
timeline
    title Decentralization & verification roadmap
    v1 — live : Optimistic oracle : Stake + slash + bonded challenges : Authority adjudication
    v2 : Staked juror committees : Spatial consistency proofs (cross-validation vs neighbouring devices)
    v3 : zk attestation — proofs that readings came from certified firmware : zkTLS / TEE attestations
    v4 : Data DAO — pay-per-query fees streamed by reputation × coverage : ZK-compressed reading accounts at scale
```

## License

ISC

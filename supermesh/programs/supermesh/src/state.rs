use anchor_lang::prelude::*;

/// Global configuration for a SuperMesh network.
///
/// One network = one class of real-world data (e.g. "air-quality:PM2.5",
/// "weather:temperature", "noise:dB"). Devices stake SOL to join and earn
/// rewards for honest readings.
#[account]
#[derive(InitSpace)]
pub struct Network {
    /// Authority that can pause the network and tune parameters.
    pub authority: Pubkey,
    /// Human-readable network identifier, e.g. "pm25-blr".
    #[max_len(32)]
    pub name: String,
    /// Minimum lamports a device must stake to register.
    pub min_stake: u64,
    /// Lamports paid to a device per finalized reading.
    pub reward_per_reading: u64,
    /// Lamports a challenger must bond to dispute a reading.
    pub challenge_bond: u64,
    /// Slots a reading stays challengeable before it can be finalized.
    pub challenge_window_slots: u64,
    /// Total devices ever registered.
    pub device_count: u64,
    /// Total readings ever finalized network-wide.
    pub total_finalized_readings: u64,
    /// Emergency pause switch.
    pub paused: bool,
    /// PDA bump.
    pub bump: u8,
    /// Treasury PDA bump (holds stakes, bonds and reward funds).
    pub treasury_bump: u8,
}

/// Program-owned lamport vault holding stakes, challenge bonds and reward
/// funds for one network. Being program-owned lets the program debit
/// lamports directly when paying out.
#[account]
#[derive(InitSpace)]
pub struct Treasury {
    /// Network this treasury belongs to.
    pub network: Pubkey,
    /// PDA bump.
    pub bump: u8,
}

/// A registered physical sensor device (DePIN node).
#[account]
#[derive(InitSpace)]
pub struct Device {
    /// Wallet that owns this device and receives rewards.
    pub owner: Pubkey,
    /// Network this device belongs to.
    pub network: Pubkey,
    /// Ed25519 public key burned into the device firmware; every reading
    /// submission must be signed by this key (owner co-signs the tx).
    pub device_signer: Pubkey,
    /// Lamports currently staked (slashable collateral).
    pub staked: u64,
    /// Lamports of rewards accrued and not yet claimed.
    pub pending_rewards: u64,
    /// Monotonic counter of readings this device has submitted.
    pub reading_count: u64,
    /// Slot of the most recent submission (rate limiting).
    pub last_reading_slot: u64,
    /// Reputation score; drops on slashes, device suspended at <= 0.
    pub reputation: i32,
    /// Number of this device's readings currently under challenge.
    pub open_challenges: u16,
    /// Whether the device may submit readings.
    pub active: bool,
    /// Geohash of the claimed deployment location (privacy-truncated).
    #[max_len(12)]
    pub geohash: String,
    /// PDA bump.
    pub bump: u8,
}

/// Lifecycle of a submitted reading.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ReadingStatus {
    /// Submitted, inside the challenge window.
    Pending,
    /// Disputed by a challenger; awaiting authority resolution.
    Challenged,
    /// Survived the window (or a failed challenge); reward paid.
    Finalized,
    /// Proven fraudulent; device slashed.
    Rejected,
}

/// One optimistically-accepted sensor reading.
///
/// The raw measurement lives off-chain (IPFS/Arweave); only its hash and a
/// coarse value land on-chain, keeping cost per reading tiny.
#[account]
#[derive(InitSpace)]
pub struct Reading {
    /// Device that produced this reading.
    pub device: Pubkey,
    /// Network the reading belongs to.
    pub network: Pubkey,
    /// Per-device sequence number.
    pub index: u64,
    /// SHA-256 of the full off-chain measurement payload.
    pub data_hash: [u8; 32],
    /// Scaled measurement value (e.g. PM2.5 µg/m³ ×100) for on-chain querying.
    pub value: i64,
    /// Unix timestamp claimed by the device.
    pub measured_at: i64,
    /// Slot at which the reading was submitted.
    pub submitted_slot: u64,
    /// Current lifecycle state.
    pub status: ReadingStatus,
    /// Challenger wallet (set when status == Challenged).
    pub challenger: Pubkey,
    /// Lamports bonded by the challenger.
    pub challenge_bond: u64,
    /// PDA bump.
    pub bump: u8,
}

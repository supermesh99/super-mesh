use anchor_lang::prelude::*;

#[constant]
pub const SEED_NETWORK: &[u8] = b"network";

#[constant]
pub const SEED_TREASURY: &[u8] = b"treasury";

#[constant]
pub const SEED_DEVICE: &[u8] = b"device";

#[constant]
pub const SEED_READING: &[u8] = b"reading";

/// Minimum slots a device must wait between two readings (anti-spam).
pub const MIN_SLOTS_BETWEEN_READINGS: u64 = 20;

/// Portion of a device's stake slashed on a proven-fraudulent reading (basis points).
pub const SLASH_BPS: u64 = 2_000; // 20%

/// Reputation a device starts with.
pub const REPUTATION_START: i32 = 100;

/// Reputation gained per finalized reading.
pub const REPUTATION_GAIN: i32 = 1;

/// Reputation lost per rejected (fraudulent) reading.
pub const REPUTATION_LOSS: i32 = 25;

/// Devices at or below this reputation are suspended.
pub const REPUTATION_SUSPEND_THRESHOLD: i32 = 0;
